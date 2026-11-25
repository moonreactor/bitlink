"""Proof that a verification request comes from whoever runs the linked accounts.

Each profile has a fixed code (`bitlink-xxxxxxxxxxxx`). The owner puts it in the bio of a social
profile, on their website, or in a DNS TXT record of their domain; we look for it and store what
we found on the request. The result is only a signal for the superadmin, it never approves alone.
Social networks often hide profiles from servers (login walls, JavaScript), so "not found" there
is common and the admin then checks by hand.
"""

from __future__ import annotations

import hashlib
import hmac
import ipaddress
import socket
import uuid
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse
from urllib.request import HTTPRedirectHandler, Request, build_opener

from app.core.config import settings
from app.services.domain import fetch_txt_records

MAX_BYTES = 500_000
TIMEOUT = 6.0
MAX_REDIRECTS = 3

# Hosts where a DNS TXT record cannot belong to the user.
SHARED_HOSTS = (
    "instagram.com",
    "tiktok.com",
    "x.com",
    "twitter.com",
    "facebook.com",
    "youtube.com",
    "youtu.be",
    "linkedin.com",
    "github.com",
    "threads.net",
    "twitch.tv",
    "spotify.com",
    "soundcloud.com",
    "behance.net",
    "pinterest.com",
    "medium.com",
    "substack.com",
    "bitlink.click",
)


def proof_code(profile_id: uuid.UUID) -> str:
    digest = hmac.new(settings.SECRET_KEY.encode(), f"verify:{profile_id}".encode(), hashlib.sha256)
    return f"bitlink-{digest.hexdigest()[:12]}"


class UnsafeUrl(ValueError):
    pass


def _check_public_host(url: str) -> None:
    """Refuse anything that is not a public http(s) host on a standard port (SSRF guard)."""
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https") or not parsed.hostname:
        raise UnsafeUrl("Only http(s) links can be checked")
    if parsed.port not in (None, 80, 443):
        raise UnsafeUrl("Only standard ports can be checked")
    try:
        infos = socket.getaddrinfo(parsed.hostname, parsed.port or 443, type=socket.SOCK_STREAM)
    except socket.gaierror as exc:
        raise UnsafeUrl("Host not found") from exc
    for info in infos:
        ip = ipaddress.ip_address(info[4][0])
        if not ip.is_global or ip.is_multicast:
            raise UnsafeUrl("Private addresses cannot be checked")


class _SafeRedirects(HTTPRedirectHandler):
    def __init__(self) -> None:
        self.count = 0

    def redirect_request(self, req, fp, code, msg, headers, newurl):  # noqa: ANN001
        self.count += 1
        if self.count > MAX_REDIRECTS:
            raise UnsafeUrl("Too many redirects")
        target = urljoin(req.full_url, newurl)
        _check_public_host(target)
        return super().redirect_request(req, fp, code, msg, headers, target)


def page_contains(url: str, code: str) -> tuple[bool, str | None]:
    """(found, error). Reads at most MAX_BYTES of the page."""
    try:
        _check_public_host(url)
        opener = build_opener(_SafeRedirects())
        req = Request(
            url,
            headers={
                "User-Agent": "BitlinkBot/1.0 (+https://bitlink.click; verification check)",
                "Accept": "text/html,application/xhtml+xml,text/plain",
            },
        )
        with opener.open(req, timeout=TIMEOUT) as resp:
            body = resp.read(MAX_BYTES).decode("utf-8", errors="ignore")
        return (code in body, None)
    except UnsafeUrl as exc:
        return (False, str(exc))
    except HTTPError as exc:
        return (False, f"The page answered {exc.code}")
    except (URLError, TimeoutError, OSError, ValueError):
        return (False, "Could not open the page")


def dns_contains(domain: str, code: str) -> bool:
    for name in (domain, f"_bitlink-challenge.{domain}"):
        if any(code in value for value in fetch_txt_records(name)):
            return True
    return False


def _own_domain(host: str) -> bool:
    host = host.removeprefix("www.")
    return not any(host == s or host.endswith("." + s) for s in SHARED_HOSTS)


def run_proof_checks(code: str, evidence_urls: list[str], custom_domain: str | None) -> list[dict]:
    """Look for the code on every evidence page and in the TXT records of the user's own domains."""
    pages = list(dict.fromkeys(evidence_urls))
    domains: list[str] = []
    if custom_domain:
        domains.append(custom_domain)
    for url in pages:
        host = (urlparse(url).hostname or "").lower().removeprefix("www.")
        if host and _own_domain(host) and host not in domains:
            domains.append(host)

    checked_at = datetime.now(timezone.utc).isoformat()
    with ThreadPoolExecutor(max_workers=6) as pool:
        page_results = list(pool.map(lambda u: page_contains(u, code), pages))
        dns_results = list(pool.map(lambda d: dns_contains(d, code), domains))

    results = [
        {"kind": "page", "target": url, "found": found, "error": error, "checked_at": checked_at}
        for url, (found, error) in zip(pages, page_results)
    ]
    results += [
        {"kind": "dns", "target": domain, "found": found, "error": None, "checked_at": checked_at}
        for domain, found in zip(domains, dns_results)
    ]
    return results
