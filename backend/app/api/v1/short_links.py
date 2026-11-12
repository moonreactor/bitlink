import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from urllib.parse import urlparse
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response, status
from fastapi.responses import RedirectResponse, Response as FastAPIResponse
from sqlalchemy import Date, cast, func
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.short_link import ShortLink, ShortLinkClick
from app.models.shortener_event import CLIENT_EVENTS, SOURCES, ShortenerEvent
from app.models.user import User
from app.schemas.short_link import (
    PublicShortLinkCreate,
    PublicShortLinkOut,
    ShortenerEventIn,
    ShortLinkDailyClicks,
    ShortLinkStatCount,
    ShortLinkStatsOut,
    ShortLinkCheckOut,
    ShortLinkClaimOut,
    ShortLinkClaimRequest,
    ShortLinkCreate,
    ShortLinkOut,
    ShortLinkUpdate,
    ShortLinkVisitOut,
)
from app.services.analytics import detect_device, hash_visitor, normalize_referrer
from app.services.safe_browsing import UNSAFE_MESSAGE, find_unsafe_urls
from app.services.qr import generate_profile_qr
from app.services.short_links import (
    CODE_RE,
    RESERVED_CODES,
    allocate_code,
    apply_utm,
    code_available,
    normalize_code,
    pick_destination,
)

router = APIRouter(tags=["short-links"])


def _short_url(code: str) -> str:
    return f"{settings.short_base_url}/{code}"


def _final_url(
    link: ShortLink,
    *,
    device: str | None = None,
    country: str | None = None,
) -> str:
    base = pick_destination(
        destination_url=link.destination_url,
        rule_mobile_url=getattr(link, "rule_mobile_url", None),
        rule_desktop_url=getattr(link, "rule_desktop_url", None),
        geo_rules=getattr(link, "geo_rules", None),
        device=device,
        country=country,
    )
    return apply_utm(
        base,
        utm_source=link.utm_source,
        utm_medium=link.utm_medium,
        utm_campaign=link.utm_campaign,
        utm_term=link.utm_term,
        utm_content=link.utm_content,
    )


def _out(link: ShortLink, clicks: int = 0) -> ShortLinkOut:
    return ShortLinkOut(
        id=link.id,
        code=link.code,
        title=link.title,
        destination_url=link.destination_url,
        final_url=_final_url(link),
        short_url=_short_url(link.code),
        utm_source=link.utm_source,
        utm_medium=link.utm_medium,
        utm_campaign=link.utm_campaign,
        utm_term=link.utm_term,
        utm_content=link.utm_content,
        rule_mobile_url=getattr(link, "rule_mobile_url", None),
        rule_desktop_url=getattr(link, "rule_desktop_url", None),
        geo_rules=getattr(link, "geo_rules", None),
        is_active=link.is_active,
        clicks=clicks,
        created_at=link.created_at,
        updated_at=link.updated_at,
    )


def _click_counts(db: Session, link_ids: list[UUID]) -> dict[UUID, int]:
    if not link_ids:
        return {}
    rows = (
        db.query(ShortLinkClick.short_link_id, func.count(ShortLinkClick.id))
        .filter(ShortLinkClick.short_link_id.in_(link_ids))
        .group_by(ShortLinkClick.short_link_id)
        .all()
    )
    return {row[0]: row[1] for row in rows}


def _track_click(db: Session, link: ShortLink, request: Request) -> None:
    ua = request.headers.get("user-agent")
    ip = request.client.host if request.client else None
    country = request.headers.get("cf-ipcountry") or request.headers.get("x-country-code")
    referrer = normalize_referrer(request.headers.get("referer"))
    db.add(
        ShortLinkClick(
            short_link_id=link.id,
            visitor_hash=hash_visitor(None, ua, ip),
            referrer=referrer,
            user_agent=ua,
            country=country[:2].upper() if country else None,
            device=detect_device(ua),
        )
    )
    db.commit()


def _reject_unsafe(*urls: str | None) -> None:
    if find_unsafe_urls([u for u in urls if u]):
        raise HTTPException(status_code=400, detail=UNSAFE_MESSAGE)


def _log_funnel(db: Session, event: str, source: str | None, request: Request) -> None:
    db.add(
        ShortenerEvent(
            event=event,
            source=source if source in SOURCES else None,
            visitor_hash=_sha256(_client_ip(request))[:32],
        )
    )


def _sha256(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()


def _client_ip(request: Request) -> str:
    hops = settings.TRUSTED_PROXY_HOPS
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded and hops > 0:
        parts = [p.strip() for p in forwarded.split(",") if p.strip()]
        # Each trusted proxy appends the address it saw; anything left of that is client-supplied.
        if len(parts) >= hops:
            return parts[-hops]
    return request.client.host if request.client else "unknown"


@router.post(
    "/public/short-links",
    response_model=PublicShortLinkOut,
    status_code=status.HTTP_201_CREATED,
)
def create_public_short_link(
    payload: PublicShortLinkCreate,
    request: Request,
    db: Session = Depends(get_db),
) -> PublicShortLinkOut:
    """Create a short link without an account.

    The creator receives a one-time claim token. Clicks are recorded from day one,
    but stats are only visible after signing up and claiming the link.
    """
    own_host = urlparse(settings.short_base_url).hostname
    dest_host = urlparse(payload.destination_url).hostname
    if own_host and dest_host and dest_host.lower() in {own_host.lower(), f"www.{own_host.lower()}"}:
        raise HTTPException(status_code=400, detail="You can't shorten a Bitlink URL.")

    if find_unsafe_urls([payload.destination_url]):
        raise HTTPException(status_code=400, detail=UNSAFE_MESSAGE)

    creator_hash = _sha256(_client_ip(request))
    since = datetime.now(timezone.utc) - timedelta(hours=1)
    recent = (
        db.query(func.count(ShortLink.id))
        .filter(ShortLink.creator_hash == creator_hash, ShortLink.created_at >= since)
        .scalar()
    )
    if recent >= settings.ANON_LINKS_PER_IP_HOUR:
        raise HTTPException(
            status_code=429,
            detail="Too many links created from your network. Create a free account to keep going.",
        )
    total_recent = (
        db.query(func.count(ShortLink.id))
        .filter(ShortLink.user_id.is_(None), ShortLink.created_at >= since)
        .scalar()
    )
    if total_recent >= settings.ANON_LINKS_GLOBAL_HOUR:
        raise HTTPException(
            status_code=429,
            detail="Free link creation is busy right now. Please try again later or create a free account.",
        )

    try:
        code = allocate_code(db, None)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    token = secrets.token_urlsafe(24)
    link = ShortLink(
        user_id=None,
        code=code,
        destination_url=payload.destination_url,
        claim_token_hash=_sha256(token),
        creator_hash=creator_hash,
        is_active=True,
    )
    db.add(link)
    _log_funnel(db, "link_created", payload.source, request)
    db.commit()
    return PublicShortLinkOut(
        code=code,
        short_url=_short_url(code),
        destination_url=link.destination_url,
        claim_token=token,
    )


@router.post("/public/shortener-events", status_code=status.HTTP_204_NO_CONTENT)
def track_shortener_event(
    payload: ShortenerEventIn,
    request: Request,
    db: Session = Depends(get_db),
) -> None:
    """Funnel analytics for the public shortener. Whitelisted events, no personal data."""
    if payload.event not in CLIENT_EVENTS:
        raise HTTPException(status_code=400, detail="Unknown event")
    visitor = _sha256(_client_ip(request))[:32]
    since = datetime.now(timezone.utc) - timedelta(hours=1)
    recent = (
        db.query(func.count(ShortenerEvent.id))
        .filter(ShortenerEvent.visitor_hash == visitor, ShortenerEvent.created_at >= since)
        .scalar()
    )
    if recent >= 120:
        return  # silently drop: keeps the funnel from being flooded
    _log_funnel(db, payload.event, payload.source, request)
    db.commit()


@router.post("/me/short-links/claim", response_model=ShortLinkClaimOut)
def claim_short_links(
    payload: ShortLinkClaimRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ShortLinkClaimOut:
    """Attach anonymously created short links (and their click history) to the account."""
    hashes = {_sha256(t.strip()) for t in payload.tokens if t.strip()}
    links = (
        db.query(ShortLink)
        .filter(ShortLink.user_id.is_(None), ShortLink.claim_token_hash.in_(hashes))
        .all()
    )
    for link in links:
        link.user_id = current_user.id
        link.claim_token_hash = None
        link.creator_hash = None
    if links:
        _log_funnel(db, "claimed", None, request)
    db.commit()
    return ShortLinkClaimOut(claimed=len(links))


@router.get("/me/short-links", response_model=list[ShortLinkOut])
def list_short_links(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[ShortLinkOut]:
    links = (
        db.query(ShortLink)
        .filter(ShortLink.user_id == current_user.id)
        .order_by(ShortLink.created_at.desc())
        .all()
    )
    counts = _click_counts(db, [l.id for l in links])
    return [_out(l, counts.get(l.id, 0)) for l in links]


@router.get("/me/short-links/check", response_model=ShortLinkCheckOut)
def check_code(
    code: str = Query(..., min_length=2, max_length=40),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ShortLinkCheckOut:
    _ = current_user
    normalized = normalize_code(code)
    if not CODE_RE.match(normalized) or normalized in RESERVED_CODES:
        return ShortLinkCheckOut(code=normalized, available=False)
    return ShortLinkCheckOut(code=normalized, available=code_available(db, normalized))


@router.post("/me/short-links", response_model=ShortLinkOut, status_code=status.HTTP_201_CREATED)
def create_short_link(
    payload: ShortLinkCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ShortLinkOut:
    _reject_unsafe(
        payload.destination_url,
        payload.rule_mobile_url,
        payload.rule_desktop_url,
        *(payload.geo_rules or {}).values(),
    )
    try:
        code = allocate_code(db, payload.code)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    link = ShortLink(
        user_id=current_user.id,
        code=code,
        title=payload.title,
        destination_url=payload.destination_url,
        utm_source=payload.utm_source,
        utm_medium=payload.utm_medium,
        utm_campaign=payload.utm_campaign,
        utm_term=payload.utm_term,
        utm_content=payload.utm_content,
        rule_mobile_url=payload.rule_mobile_url,
        rule_desktop_url=payload.rule_desktop_url,
        geo_rules=payload.geo_rules,
        is_active=payload.is_active,
    )
    db.add(link)
    db.commit()
    db.refresh(link)
    return _out(link, 0)


@router.patch("/me/short-links/{link_id}", response_model=ShortLinkOut)
def update_short_link(
    link_id: UUID,
    payload: ShortLinkUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ShortLinkOut:
    link = (
        db.query(ShortLink)
        .filter(ShortLink.id == link_id, ShortLink.user_id == current_user.id)
        .first()
    )
    if link is None:
        raise HTTPException(status_code=404, detail="Short link not found")

    data = payload.model_dump(exclude_unset=True)
    _reject_unsafe(
        data.get("destination_url"),
        data.get("rule_mobile_url"),
        data.get("rule_desktop_url"),
        *(data.get("geo_rules") or {}).values(),
    )

    if "code" in data and data["code"] and data["code"] != link.code:
        if not code_available(db, data["code"], exclude_id=link.id):
            raise HTTPException(status_code=400, detail="This code is already taken.")
        link.code = data["code"]

    if "destination_url" in data and data["destination_url"]:
        link.destination_url = data["destination_url"]

    if data.get("clear_title"):
        link.title = None
    elif "title" in data:
        title = data["title"]
        link.title = title.strip() if isinstance(title, str) and title.strip() else None

    if data.get("clear_utm"):
        link.utm_source = None
        link.utm_medium = None
        link.utm_campaign = None
        link.utm_term = None
        link.utm_content = None
    else:
        for field in ("utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"):
            if field in data:
                value = data[field]
                setattr(link, field, value.strip() if isinstance(value, str) and value.strip() else None)

    if data.get("clear_rule_mobile_url"):
        link.rule_mobile_url = None
    elif "rule_mobile_url" in data:
        link.rule_mobile_url = data["rule_mobile_url"]

    if data.get("clear_rule_desktop_url"):
        link.rule_desktop_url = None
    elif "rule_desktop_url" in data:
        link.rule_desktop_url = data["rule_desktop_url"]

    if data.get("clear_geo_rules"):
        link.geo_rules = None
    elif "geo_rules" in data:
        link.geo_rules = data["geo_rules"]

    if "is_active" in data and data["is_active"] is not None:
        link.is_active = data["is_active"]

    db.commit()
    db.refresh(link)
    counts = _click_counts(db, [link.id])
    return _out(link, counts.get(link.id, 0))


@router.delete("/me/short-links/{link_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_short_link(
    link_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    link = (
        db.query(ShortLink)
        .filter(ShortLink.id == link_id, ShortLink.user_id == current_user.id)
        .first()
    )
    if link is None:
        raise HTTPException(status_code=404, detail="Short link not found")
    db.delete(link)
    db.commit()


@router.get("/me/short-links/{link_id}/stats", response_model=ShortLinkStatsOut)
def short_link_stats(
    link_id: UUID,
    days: int = Query(default=30, ge=1, le=365),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ShortLinkStatsOut:
    """Click breakdown for one of the user's short links (country, device, referrer, daily)."""
    link = (
        db.query(ShortLink)
        .filter(ShortLink.id == link_id, ShortLink.user_id == current_user.id)
        .first()
    )
    if link is None:
        raise HTTPException(status_code=404, detail="Short link not found")

    now = datetime.now(timezone.utc)
    since = (now - timedelta(days=days - 1)).replace(hour=0, minute=0, second=0, microsecond=0)
    base = [ShortLinkClick.short_link_id == link.id, ShortLinkClick.created_at >= since]

    total = db.query(func.count(ShortLinkClick.id)).filter(*base).scalar() or 0

    day_col = cast(ShortLinkClick.created_at, Date)
    per_day = {
        str(d): n
        for d, n in db.query(day_col, func.count(ShortLinkClick.id)).filter(*base).group_by(day_col).all()
    }
    daily = []
    for i in range(days):
        d = (since + timedelta(days=i)).date().isoformat()
        daily.append(ShortLinkDailyClicks(date=d, clicks=per_day.get(d, 0)))

    def top(column, empty_label: str, limit: int = 8) -> list[ShortLinkStatCount]:
        rows = (
            db.query(column, func.count(ShortLinkClick.id))
            .filter(*base)
            .group_by(column)
            .order_by(func.count(ShortLinkClick.id).desc())
            .limit(limit)
            .all()
        )
        return [ShortLinkStatCount(label=(v or empty_label), count=n) for v, n in rows]

    return ShortLinkStatsOut(
        days=days,
        total=total,
        daily=daily,
        countries=top(ShortLinkClick.country, "Unknown"),
        devices=top(ShortLinkClick.device, "unknown"),
        referrers=top(ShortLinkClick.referrer, "Direct"),
    )


@router.get("/me/short-links/{link_id}/qr")
def short_link_qr(
    link_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    fmt: str = Query(default="png", pattern="^(png|svg)$"),
) -> FastAPIResponse:
    link = (
        db.query(ShortLink)
        .filter(ShortLink.id == link_id, ShortLink.user_id == current_user.id)
        .first()
    )
    if link is None:
        raise HTTPException(status_code=404, detail="Short link not found")
    # Encode the public short URL (bitlink.click/code), not the Railway host.
    content = generate_profile_qr(link.code, fmt=fmt, base_url=settings.short_base_url)
    media = "image/svg+xml" if fmt == "svg" else "image/png"
    return Response(content=content, media_type=media)


@router.get("/r/{code}", response_model=ShortLinkVisitOut)
def resolve_short_link(
    code: str,
    request: Request,
    db: Session = Depends(get_db),
) -> ShortLinkVisitOut:
    """Resolve a short link and record a click (JSON for Next.js server redirect)."""
    normalized = normalize_code(code)
    link = db.query(ShortLink).filter(ShortLink.code == normalized, ShortLink.is_active.is_(True)).first()
    if link is None:
        raise HTTPException(status_code=404, detail="Short link not found")

    ua = request.headers.get("user-agent")
    country_hdr = request.headers.get("cf-ipcountry") or request.headers.get("x-country-code")
    country = country_hdr[:2].upper() if country_hdr else None
    device = detect_device(ua)
    url = _final_url(link, device=device, country=country)
    _track_click(db, link, request)
    return ShortLinkVisitOut(code=link.code, url=url, title=link.title)


@router.get("/r/{code}/go")
def redirect_short_link(
    code: str,
    request: Request,
    db: Session = Depends(get_db),
) -> RedirectResponse:
    """HTTP 302 redirect with click tracking (useful for API-only sharing)."""
    result = resolve_short_link(code, request, db)
    return RedirectResponse(url=result.url, status_code=302)
