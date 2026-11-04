import re
from urllib.parse import parse_qs, urlparse

YOUTUBE_HOSTS = {"youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be"}


def extract_youtube_video_id(url: str | None) -> str | None:
    if not url:
        return None
    raw = url.strip()
    if not raw:
        return None

    # Bare video id
    if re.fullmatch(r"[\w-]{11}", raw):
        return raw

    parsed = urlparse(raw if "://" in raw else f"https://{raw}")
    host = (parsed.hostname or "").lower()
    if host not in YOUTUBE_HOSTS:
        return None

    if host == "youtu.be":
        candidate = parsed.path.strip("/").split("/")[0]
        return candidate if re.fullmatch(r"[\w-]{11}", candidate) else None

    if parsed.path.startswith("/embed/") or parsed.path.startswith("/shorts/") or parsed.path.startswith("/live/"):
        candidate = parsed.path.strip("/").split("/")[1] if "/" in parsed.path.strip("/") else ""
        return candidate if re.fullmatch(r"[\w-]{11}", candidate) else None

    qs = parse_qs(parsed.query)
    candidate = (qs.get("v") or [None])[0]
    if candidate and re.fullmatch(r"[\w-]{11}", candidate):
        return candidate
    return None


def normalize_youtube_url(url: str | None) -> str | None:
    video_id = extract_youtube_video_id(url)
    if not video_id:
        return None
    return f"https://www.youtube.com/watch?v={video_id}"
