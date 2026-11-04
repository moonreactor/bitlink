from fastapi import Request

from app.core.config import settings


def public_api_base(request: Request | None = None) -> str:
    """Absolute public API origin for media URLs, etc.

    Prefer PUBLIC_API_URL when it is a real public host. Otherwise derive from
    the incoming request (X-Forwarded-* on Railway) so uploads never stick to
    localhost in production.
    """
    configured = settings.public_api_base
    if configured and not settings.is_local_api_base(configured):
        return configured

    if request is not None:
        host = (request.headers.get("x-forwarded-host") or request.headers.get("host") or "").split(",")[
            0
        ].strip()
        proto = (request.headers.get("x-forwarded-proto") or request.url.scheme or "https").split(",")[
            0
        ].strip()
        if host and "localhost" not in host and "127.0.0.1" not in host:
            return f"{proto}://{host}".rstrip("/")
        if host:
            return f"{request.url.scheme}://{host}".rstrip("/")
        return str(request.base_url).rstrip("/")

    return configured or "http://localhost:8000"
