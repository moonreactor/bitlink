import hashlib
from datetime import datetime

from user_agents import parse as parse_ua


def hash_visitor(visitor_id: str | None, user_agent: str | None, ip: str | None) -> str:
    raw = f"{visitor_id or ''}|{user_agent or ''}|{ip or ''}"
    return hashlib.sha256(raw.encode()).hexdigest()[:32]


def detect_device(user_agent: str | None) -> str:
    if not user_agent:
        return "unknown"
    ua = parse_ua(user_agent)
    if ua.is_bot:
        return "bot"
    if ua.is_mobile:
        return "mobile"
    if ua.is_tablet:
        return "tablet"
    return "desktop"


def normalize_referrer(referrer: str | None) -> str:
    if not referrer:
        return "direct"
    try:
        from urllib.parse import urlparse

        host = urlparse(referrer).netloc.lower()
        return host or "direct"
    except Exception:
        return "direct"


def parse_date_param(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None
