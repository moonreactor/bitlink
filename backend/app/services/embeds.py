import re
from urllib.parse import urlparse

from app.services.youtube import extract_youtube_video_id, normalize_youtube_url

SPOTIFY_HOSTS = {"open.spotify.com", "spotify.com", "www.spotify.com"}
SPOTIFY_TYPES = ("track", "playlist", "album", "episode", "show", "artist")


def extract_spotify_embed(url: str | None) -> dict[str, str] | None:
    """Return {kind, id, embed_url} for a Spotify link, or None."""
    if not url:
        return None
    raw = url.strip()
    if not raw:
        return None

    # spotify:track:id
    m = re.fullmatch(r"spotify:(track|playlist|album|episode|show|artist):([A-Za-z0-9]+)", raw)
    if m:
        kind, sid = m.group(1), m.group(2)
        return {
            "kind": kind,
            "id": sid,
            "embed_url": f"https://open.spotify.com/embed/{kind}/{sid}",
        }

    parsed = urlparse(raw if "://" in raw else f"https://{raw}")
    host = (parsed.hostname or "").lower()
    if host not in SPOTIFY_HOSTS:
        return None

    parts = [p for p in parsed.path.split("/") if p and p != "embed" and p != "intl-es" and not p.startswith("intl-")]
    if len(parts) < 2:
        return None
    kind, sid = parts[0], parts[1].split("?")[0]
    if kind not in SPOTIFY_TYPES or not re.fullmatch(r"[A-Za-z0-9]+", sid):
        return None
    return {
        "kind": kind,
        "id": sid,
        "embed_url": f"https://open.spotify.com/embed/{kind}/{sid}",
    }


def normalize_spotify_url(url: str | None) -> str | None:
    data = extract_spotify_embed(url)
    if not data:
        return None
    return f"https://open.spotify.com/{data['kind']}/{data['id']}"


def normalize_contact_url(value: str) -> str:
    v = value.strip()
    if v.lower().startswith(("mailto:", "tel:")):
        return v
    if "@" in v and "://" not in v:
        return f"mailto:{v}"
    digits = re.sub(r"[^\d+]", "", v)
    if digits:
        return f"tel:{digits}"
    return v


def prepare_link_url(link_type: str, url: str | None, title: str) -> str:
    link_type = (link_type or "url").lower()
    raw = (url or "").strip()

    if link_type == "header":
        return raw or f"header:{title}"

    if link_type == "contact":
        if not raw:
            raise ValueError("Contact links need an email or phone number.")
        return normalize_contact_url(raw)

    if link_type == "youtube":
        normalized = normalize_youtube_url(raw)
        if not normalized:
            raise ValueError("Must be a valid YouTube URL or video id.")
        return normalized

    if link_type == "spotify":
        normalized = normalize_spotify_url(raw)
        if not normalized:
            raise ValueError("Must be a valid Spotify track, playlist, album, or episode URL.")
        return normalized

    if not raw:
        raise ValueError("URL is required.")
    if not raw.startswith(("http://", "https://", "mailto:", "tel:")):
        return f"https://{raw}"
    return raw


def public_embed_payload(link_type: str, url: str | None) -> dict[str, str] | None:
    if link_type == "youtube":
        vid = extract_youtube_video_id(url)
        if not vid:
            return None
        return {
            "provider": "youtube",
            "id": vid,
            "embed_url": f"https://www.youtube.com/embed/{vid}",
        }
    if link_type == "spotify":
        data = extract_spotify_embed(url)
        if not data:
            return None
        return {
            "provider": "spotify",
            "id": data["id"],
            "kind": data["kind"],
            "embed_url": data["embed_url"],
        }
    return None
