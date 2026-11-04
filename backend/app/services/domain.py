import json
import re
import secrets
import urllib.parse
import urllib.request

DOMAIN_RE = re.compile(
    r"^(?=.{1,253}$)(?!-)[a-z0-9-]+(\.[a-z0-9-]+)+$",
    re.IGNORECASE,
)


def normalize_domain(raw: str) -> str:
    value = raw.strip().lower()
    value = value.removeprefix("https://").removeprefix("http://")
    value = value.split("/")[0].split(":")[0]
    if value.startswith("www."):
        value = value[4:]
    if not DOMAIN_RE.match(value):
        raise ValueError("Enter a valid domain like links.yourbrand.com")
    # Block obvious platform hosts
    blocked_suffixes = (
        "localhost",
        "bitlink.click",
        "bitlink.app",
        "railway.app",
        "up.railway.app",
        "vercel.app",
    )
    if value in blocked_suffixes or any(value.endswith("." + s) for s in blocked_suffixes):
        raise ValueError("That domain cannot be used as a custom domain.")
    return value


def new_verify_token() -> str:
    return secrets.token_urlsafe(24)


def txt_lookup_names(domain: str) -> list[str]:
    return [f"_bitlink-challenge.{domain}", f"bitlink-verify.{domain}"]


def fetch_txt_records(name: str) -> list[str]:
    query = urllib.parse.urlencode({"name": name, "type": "TXT"})
    url = f"https://cloudflare-dns.com/dns-query?{query}"
    req = urllib.request.Request(url, headers={"Accept": "application/dns-json"})
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
    except Exception:
        return []

    answers = payload.get("Answer") or []
    values: list[str] = []
    for ans in answers:
        data = str(ans.get("data") or "").strip().strip('"')
        if data:
            values.append(data.replace('"', ""))
    return values


def domain_token_present(domain: str, token: str) -> bool:
    needle = token.strip()
    for name in txt_lookup_names(domain):
        for value in fetch_txt_records(name):
            if needle in value:
                return True
    return False
