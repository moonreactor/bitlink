"""Google Safe Browsing (Lookup API v4) check for short link destinations."""

import json
import logging
import urllib.request

from app.core.config import settings

logger = logging.getLogger("bitlink.safe_browsing")

ENDPOINT = "https://safebrowsing.googleapis.com/v4/threatMatches:find"
THREAT_TYPES = [
    "MALWARE",
    "SOCIAL_ENGINEERING",
    "UNWANTED_SOFTWARE",
    "POTENTIALLY_HARMFUL_APPLICATION",
]


def find_unsafe_urls(urls: list[str]) -> set[str]:
    """Return the subset of ``urls`` flagged by Safe Browsing.

    Disabled (returns empty) when SAFE_BROWSING_API_KEY is unset. On API errors it fails open
    so a Google outage does not take link creation down; the error is logged.
    """
    key = settings.SAFE_BROWSING_API_KEY.strip()
    urls = [u for u in dict.fromkeys(urls) if u]
    if not key or not urls:
        return set()

    body = {
        "client": {"clientId": "bitlink", "clientVersion": "1.0.0"},
        "threatInfo": {
            "threatTypes": THREAT_TYPES,
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [{"url": u} for u in urls],
        },
    }
    req = urllib.request.Request(
        f"{ENDPOINT}?key={key}",
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=settings.SAFE_BROWSING_TIMEOUT) as res:
            data = json.loads(res.read().decode() or "{}")
    except Exception:  # noqa: BLE001 - fail open, but never log the key
        logger.warning("Safe Browsing lookup failed; allowing URL", exc_info=False)
        return set()

    return {m.get("threat", {}).get("url", "") for m in data.get("matches", [])} & set(urls)


UNSAFE_MESSAGE = "This URL was flagged as unsafe (phishing or malware) and can't be shortened."
