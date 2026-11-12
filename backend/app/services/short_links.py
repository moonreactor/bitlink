import re
import secrets
import string
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

from sqlalchemy.orm import Session

from app.models.profile import Profile
from app.models.short_link import ShortLink

CODE_RE = re.compile(r"^[a-z0-9_-]{2,40}$")

RESERVED_CODES = {
    "admin",
    "api",
    "appearance",
    "blog",
    "dashboard",
    "en",
    "es",
    "forgot-password",
    "links",
    "login",
    "me",
    "public",
    "r",
    "register",
    "reset-password",
    "settings",
    "short",
    "short-links",
    "superuser",
    "u",
}


def normalize_code(code: str) -> str:
    return code.strip().lower()


def validate_code_format(code: str) -> str:
    code = normalize_code(code)
    if not CODE_RE.match(code):
        raise ValueError(
            "Code must be 2–40 characters: lowercase letters, numbers, underscore, or hyphen."
        )
    if code in RESERVED_CODES:
        raise ValueError("This code is reserved. Please choose another.")
    return code


def generate_code(length: int = 7) -> str:
    alphabet = string.ascii_lowercase + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


def code_available(db: Session, code: str, exclude_id=None) -> bool:
    code = normalize_code(code)
    if code in RESERVED_CODES:
        return False
    if db.query(Profile.id).filter(Profile.username == code).first():
        return False
    q = db.query(ShortLink.id).filter(ShortLink.code == code)
    if exclude_id is not None:
        q = q.filter(ShortLink.id != exclude_id)
    return q.first() is None


def allocate_code(db: Session, preferred: str | None = None) -> str:
    if preferred:
        code = validate_code_format(preferred)
        if not code_available(db, code):
            raise ValueError("This code is already taken.")
        return code

    for length in (7, 8, 9, 10):
        for _ in range(12):
            candidate = generate_code(length)
            if code_available(db, candidate):
                return candidate
    raise ValueError("Could not allocate a unique code. Try a custom back-half.")


def normalize_destination(url: str) -> str:
    raw = url.strip()
    if not raw:
        raise ValueError("Destination URL is required.")
    if not raw.startswith(("http://", "https://")):
        raw = f"https://{raw}"
    parsed = urlparse(raw)
    if not parsed.netloc:
        raise ValueError("Destination URL is invalid.")
    return raw


def apply_utm(
    destination_url: str,
    *,
    utm_source: str | None = None,
    utm_medium: str | None = None,
    utm_campaign: str | None = None,
    utm_term: str | None = None,
    utm_content: str | None = None,
) -> str:
    params = {
        "utm_source": (utm_source or "").strip() or None,
        "utm_medium": (utm_medium or "").strip() or None,
        "utm_campaign": (utm_campaign or "").strip() or None,
        "utm_term": (utm_term or "").strip() or None,
        "utm_content": (utm_content or "").strip() or None,
    }
    clean = {k: v for k, v in params.items() if v}
    if not clean:
        return destination_url

    parsed = urlparse(destination_url)
    existing = dict(parse_qsl(parsed.query, keep_blank_values=True))
    existing.update(clean)
    return urlunparse(parsed._replace(query=urlencode(existing)))


def normalize_optional_url(url: str | None) -> str | None:
    if url is None:
        return None
    raw = url.strip()
    if not raw:
        return None
    return normalize_destination(raw)


def normalize_geo_rules(rules: dict | None) -> dict[str, str] | None:
    if not rules:
        return None
    cleaned: dict[str, str] = {}
    for key, value in rules.items():
        country = str(key).strip().upper()
        if len(country) != 2 or not country.isalpha():
            raise ValueError("Geo rules keys must be ISO country codes (e.g. AR, US).")
        if not isinstance(value, str) or not value.strip():
            continue
        cleaned[country] = normalize_destination(value)
    return cleaned or None


def pick_destination(
    *,
    destination_url: str,
    rule_mobile_url: str | None,
    rule_desktop_url: str | None,
    geo_rules: dict | None,
    device: str | None,
    country: str | None,
) -> str:
    """Choose destination by device, then geo, then default."""
    device_key = (device or "").lower()
    if device_key in {"mobile", "tablet"} and rule_mobile_url:
        return rule_mobile_url
    if device_key == "desktop" and rule_desktop_url:
        return rule_desktop_url

    if geo_rules and country:
        cc = country.upper()[:2]
        if cc in geo_rules and geo_rules[cc]:
            return str(geo_rules[cc])

    return destination_url
