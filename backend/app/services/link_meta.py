"""Fetch lightweight link preview metadata (title + favicon)."""

from __future__ import annotations

import re
from html.parser import HTMLParser
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen


class _MetaParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.title_parts: list[str] = []
        self._in_title = False
        self.og_title: str | None = None
        self.twitter_title: str | None = None
        self.icons: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs_map = {k.lower(): (v or "") for k, v in attrs}
        if tag.lower() == "title":
            self._in_title = True
            return
        if tag.lower() == "meta":
            prop = (attrs_map.get("property") or attrs_map.get("name") or "").lower()
            content = attrs_map.get("content", "").strip()
            if not content:
                return
            if prop in {"og:title", "og:site_name"} and not self.og_title:
                self.og_title = content
            if prop in {"twitter:title"} and not self.twitter_title:
                self.twitter_title = content
            return
        if tag.lower() == "link":
            rel = attrs_map.get("rel", "").lower()
            href = attrs_map.get("href", "").strip()
            if href and ("icon" in rel.split() or "apple-touch-icon" in rel):
                self.icons.append(href)

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "title":
            self._in_title = False

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title_parts.append(data)


def normalize_url(raw: str) -> str:
    value = raw.strip()
    if not value:
        raise ValueError("URL is required")
    if not re.match(r"^[a-z][a-z0-9+.-]*://", value, re.I):
        value = f"https://{value}"
    parsed = urlparse(value)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise ValueError("Invalid URL")
    return value


def _fallback_favicon(page_url: str) -> str:
    host = urlparse(page_url).hostname or ""
    host = host.removeprefix("www.")
    return f"https://www.google.com/s2/favicons?domain={host}&sz=128"


def fetch_link_meta(raw_url: str, timeout: float = 6.0) -> dict[str, str | None]:
    url = normalize_url(raw_url)
    parsed = urlparse(url)
    domain = (parsed.hostname or "").removeprefix("www.")

    title: str | None = None
    favicon: str | None = None

    req = Request(
        url,
        headers={
            "User-Agent": "BitlinkBot/1.0 (+https://bitlink.app)",
            "Accept": "text/html,application/xhtml+xml",
        },
        method="GET",
    )

    try:
        with urlopen(req, timeout=timeout) as resp:
            content_type = (resp.headers.get("Content-Type") or "").lower()
            final_url = resp.geturl() or url
            raw = resp.read(250_000)
            if "html" in content_type or raw.lstrip()[:1] in (b"<", b"\xef"):
                text = raw.decode("utf-8", errors="ignore")
                parser = _MetaParser()
                parser.feed(text)
                title = (
                    parser.og_title
                    or parser.twitter_title
                    or "".join(parser.title_parts).strip()
                    or None
                )
                if title:
                    title = re.sub(r"\s+", " ", title).strip()[:120]
                if parser.icons:
                    favicon = urljoin(final_url, parser.icons[0])
    except (HTTPError, URLError, TimeoutError, ValueError):
        pass

    if not title:
        title = domain or url

    if not favicon:
        favicon = _fallback_favicon(url)

    return {
        "url": url,
        "title": title,
        "favicon_url": favicon,
        "domain": domain or None,
    }
