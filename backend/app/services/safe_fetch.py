"""Open URLs that users typed, without letting them point the server at itself (SSRF).

Only http(s) on the standard ports, only hosts whose every address is public, and every
redirect is checked again. Known limit: the host is resolved here and again by urllib when it
connects, so a DNS answer that changes in between (DNS rebinding) is not covered.
"""

from __future__ import annotations

import ipaddress
import socket
from urllib.parse import urljoin, urlparse
from urllib.request import HTTPRedirectHandler, Request, build_opener

MAX_REDIRECTS = 3


class UnsafeUrl(ValueError):
    pass


def check_public_host(url: str) -> None:
    """Raise UnsafeUrl unless the URL is http(s), on port 80/443, to a public address."""
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https") or not parsed.hostname:
        raise UnsafeUrl("Only http(s) links can be opened")
    try:
        port = parsed.port
    except ValueError as exc:
        raise UnsafeUrl("Invalid port") from exc
    if port not in (None, 80, 443):
        raise UnsafeUrl("Only standard ports can be opened")
    try:
        infos = socket.getaddrinfo(parsed.hostname, port or 443, type=socket.SOCK_STREAM)
    except socket.gaierror as exc:
        raise UnsafeUrl("Host not found") from exc
    for info in infos:
        ip = ipaddress.ip_address(info[4][0])
        if not ip.is_global or ip.is_multicast:
            raise UnsafeUrl("Private addresses cannot be opened")


class _SafeRedirects(HTTPRedirectHandler):
    def __init__(self) -> None:
        self.count = 0

    def redirect_request(self, req, fp, code, msg, headers, newurl):  # noqa: ANN001
        self.count += 1
        if self.count > MAX_REDIRECTS:
            raise UnsafeUrl("Too many redirects")
        target = urljoin(req.full_url, newurl)
        check_public_host(target)
        return super().redirect_request(req, fp, code, msg, headers, target)


def open_public_url(url: str, *, headers: dict[str, str], timeout: float):
    """Like urlopen, for user-supplied URLs. Raises UnsafeUrl for anything not public."""
    check_public_host(url)
    return build_opener(_SafeRedirects()).open(Request(url, headers=headers), timeout=timeout)
