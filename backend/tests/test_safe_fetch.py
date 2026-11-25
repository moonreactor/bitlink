from urllib.request import Request

import pytest

from app.services import safe_fetch
from app.services.link_meta import fetch_link_meta
from app.services.safe_fetch import UnsafeUrl, _SafeRedirects


@pytest.fixture()
def no_connections(monkeypatch):
    """Fail the test if anything actually opens a connection."""

    def boom(*_a, **_kw):
        raise AssertionError("tried to open a connection")

    monkeypatch.setattr(safe_fetch, "build_opener", boom)


@pytest.mark.parametrize(
    "url",
    [
        "http://127.0.0.1/admin",
        "http://localhost/",
        "http://169.254.169.254/latest/meta-data/",
        "http://10.1.2.3/",
        "http://192.168.0.1/",
        "http://[::1]/",
        "http://127.0.0.1:8000/docs",
    ],
)
def test_link_preview_never_fetches_internal_addresses(url, no_connections):
    meta = fetch_link_meta(url)
    # Same fallback as a dead link: the host as title, no page content.
    assert meta["title"] == meta["domain"] or meta["title"] == url


def test_redirect_to_internal_address_is_refused():
    handler = _SafeRedirects()
    req = Request("https://example.org/")
    with pytest.raises(UnsafeUrl):
        handler.redirect_request(req, None, 302, "Found", {}, "http://169.254.169.254/")


def test_too_many_redirects(monkeypatch):
    monkeypatch.setattr(safe_fetch, "check_public_host", lambda url: None)
    handler = _SafeRedirects()
    req = Request("https://example.org/")
    for _ in range(safe_fetch.MAX_REDIRECTS):
        handler.redirect_request(req, None, 302, "Found", {}, "https://example.org/next")
    with pytest.raises(UnsafeUrl):
        handler.redirect_request(req, None, 302, "Found", {}, "https://example.org/next")


def test_bad_port_is_refused():
    with pytest.raises(UnsafeUrl):
        safe_fetch.check_public_host("http://example.org:99999/")
