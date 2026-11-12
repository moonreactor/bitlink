from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import Date, cast, func, or_
from sqlalchemy.orm import Session

from app.core.deps import get_current_superuser
from app.db.session import get_db
from app.models.analytics import LinkClick, PageView
from app.models.growth import GrowthCtaClick
from app.models.link import Link
from app.models.profile import Profile
from app.models.shortener_event import FUNNEL_EVENTS, SOURCES, ShortenerEvent
from app.models.subscriber import Subscriber
from app.models.user import User
from app.schemas.admin import (
    AdminDailyStat,
    AdminLinkItem,
    AdminLinkListResponse,
    AdminMetrics,
    AdminReferralSource,
    AdminTopProfile,
    AdminUserDetail,
    AdminUserListItem,
    AdminUserListResponse,
    AdminUserUpdate,
    ShortenerFunnel,
    ShortenerFunnelStep,
)

router = APIRouter(prefix="/admin", tags=["admin"])


def _build_user_detail(db: Session, user: User) -> AdminUserDetail:
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    links: list[AdminLinkItem] = []
    views_count = 0
    clicks_count = 0
    subscribers_count = 0
    links_count = 0

    if profile:
        click_map = {
            r[0]: r[1]
            for r in (
                db.query(LinkClick.link_id, func.count(LinkClick.id))
                .filter(LinkClick.profile_id == profile.id)
                .group_by(LinkClick.link_id)
                .all()
            )
        }
        link_rows = (
            db.query(Link)
            .filter(Link.profile_id == profile.id)
            .order_by(Link.position.asc(), Link.created_at.desc())
            .all()
        )
        links_count = len(link_rows)
        links = [
            AdminLinkItem(
                id=link.id,
                title=link.title,
                url=link.url,
                is_active=link.is_active,
                is_featured=link.is_featured,
                position=link.position,
                created_at=link.created_at,
                clicks_count=click_map.get(link.id, 0),
                username=profile.username,
                user_id=user.id,
                profile_id=profile.id,
            )
            for link in link_rows
        ]
        views_count = (
            db.query(func.count(PageView.id)).filter(PageView.profile_id == profile.id).scalar() or 0
        )
        clicks_count = (
            db.query(func.count(LinkClick.id)).filter(LinkClick.profile_id == profile.id).scalar()
            or 0
        )
        subscribers_count = (
            db.query(func.count(Subscriber.id)).filter(Subscriber.profile_id == profile.id).scalar()
            or 0
        )

    return AdminUserDetail(
        id=user.id,
        email=user.email,
        is_active=user.is_active,
        is_superuser=user.is_superuser,
        created_at=user.created_at,
        username=profile.username if profile else None,
        display_name=profile.display_name if profile else None,
        bio=profile.bio if profile else None,
        avatar_url=profile.avatar_url if profile else None,
        is_verified=bool(getattr(profile, "is_verified", False)) if profile else False,
        referred_by_username=getattr(user, "referred_by_username", None),
        profile_id=profile.id if profile else None,
        links_count=links_count,
        views_count=views_count,
        clicks_count=clicks_count,
        subscribers_count=subscribers_count,
        links=links,
    )


@router.get("/metrics", response_model=AdminMetrics)
def platform_metrics(
    _: User = Depends(get_current_superuser),
    db: Session = Depends(get_db),
) -> AdminMetrics:
    now = datetime.now(timezone.utc)
    week_ago = now - timedelta(days=7)
    month_ago = now - timedelta(days=30)
    since = now - timedelta(days=29)

    total_users = db.query(func.count(User.id)).scalar() or 0
    active_users = db.query(func.count(User.id)).filter(User.is_active.is_(True)).scalar() or 0
    superusers = db.query(func.count(User.id)).filter(User.is_superuser.is_(True)).scalar() or 0
    total_profiles = db.query(func.count(Profile.id)).scalar() or 0
    total_links = db.query(func.count(Link.id)).scalar() or 0
    active_links = db.query(func.count(Link.id)).filter(Link.is_active.is_(True)).scalar() or 0
    total_views = db.query(func.count(PageView.id)).scalar() or 0
    total_clicks = db.query(func.count(LinkClick.id)).scalar() or 0
    total_subscribers = db.query(func.count(Subscriber.id)).scalar() or 0

    new_users_7d = (
        db.query(func.count(User.id)).filter(User.created_at >= week_ago).scalar() or 0
    )
    new_users_30d = (
        db.query(func.count(User.id)).filter(User.created_at >= month_ago).scalar() or 0
    )
    views_7d = (
        db.query(func.count(PageView.id)).filter(PageView.created_at >= week_ago).scalar() or 0
    )
    clicks_7d = (
        db.query(func.count(LinkClick.id)).filter(LinkClick.created_at >= week_ago).scalar() or 0
    )

    users_by_day = {
        str(r[0]): r[1]
        for r in (
            db.query(cast(User.created_at, Date).label("d"), func.count())
            .filter(User.created_at >= since)
            .group_by("d")
            .all()
        )
    }
    views_by_day = {
        str(r[0]): r[1]
        for r in (
            db.query(cast(PageView.created_at, Date).label("d"), func.count())
            .filter(PageView.created_at >= since)
            .group_by("d")
            .all()
        )
    }
    clicks_by_day = {
        str(r[0]): r[1]
        for r in (
            db.query(cast(LinkClick.created_at, Date).label("d"), func.count())
            .filter(LinkClick.created_at >= since)
            .group_by("d")
            .all()
        )
    }

    daily: list[AdminDailyStat] = []
    for i in range(30):
        day = (since + timedelta(days=i)).date()
        key = str(day)
        daily.append(
            AdminDailyStat(
                date=key,
                users=users_by_day.get(key, 0),
                views=views_by_day.get(key, 0),
                clicks=clicks_by_day.get(key, 0),
            )
        )

    view_counts = (
        db.query(PageView.profile_id, func.count(PageView.id).label("views"))
        .group_by(PageView.profile_id)
        .subquery()
    )
    click_counts = (
        db.query(LinkClick.profile_id, func.count(LinkClick.id).label("clicks"))
        .group_by(LinkClick.profile_id)
        .subquery()
    )
    link_counts = (
        db.query(Link.profile_id, func.count(Link.id).label("links"))
        .group_by(Link.profile_id)
        .subquery()
    )

    top_rows = (
        db.query(
            Profile.user_id,
            Profile.username,
            Profile.display_name,
            func.coalesce(view_counts.c.views, 0),
            func.coalesce(click_counts.c.clicks, 0),
            func.coalesce(link_counts.c.links, 0),
        )
        .outerjoin(view_counts, view_counts.c.profile_id == Profile.id)
        .outerjoin(click_counts, click_counts.c.profile_id == Profile.id)
        .outerjoin(link_counts, link_counts.c.profile_id == Profile.id)
        .order_by(func.coalesce(view_counts.c.views, 0).desc())
        .limit(10)
        .all()
    )
    top_profiles = [
        AdminTopProfile(
            user_id=r[0],
            username=r[1],
            display_name=r[2],
            views=r[3],
            clicks=r[4],
            links_count=r[5],
        )
        for r in top_rows
    ]

    cta_clicks_total = db.query(func.count(GrowthCtaClick.id)).scalar() or 0
    cta_clicks_7d = (
        db.query(func.count(GrowthCtaClick.id))
        .filter(GrowthCtaClick.created_at >= week_ago)
        .scalar()
        or 0
    )
    referred_signups_total = (
        db.query(func.count(User.id)).filter(User.referred_by_username.isnot(None)).scalar() or 0
    )
    referred_signups_7d = (
        db.query(func.count(User.id))
        .filter(User.referred_by_username.isnot(None), User.created_at >= week_ago)
        .scalar()
        or 0
    )

    cta_by_source = {
        r[0]: r[1]
        for r in (
            db.query(GrowthCtaClick.source_username, func.count(GrowthCtaClick.id))
            .group_by(GrowthCtaClick.source_username)
            .all()
        )
    }
    signups_by_source = {
        r[0]: r[1]
        for r in (
            db.query(User.referred_by_username, func.count(User.id))
            .filter(User.referred_by_username.isnot(None))
            .group_by(User.referred_by_username)
            .all()
        )
    }
    source_keys = set(cta_by_source) | set(signups_by_source)
    top_referral_sources = sorted(
        [
            AdminReferralSource(
                username=username,
                cta_clicks=cta_by_source.get(username, 0),
                signups=signups_by_source.get(username, 0),
            )
            for username in source_keys
        ],
        key=lambda s: (s.signups, s.cta_clicks),
        reverse=True,
    )[:15]

    return AdminMetrics(
        total_users=total_users,
        active_users=active_users,
        superusers=superusers,
        total_profiles=total_profiles,
        total_links=total_links,
        active_links=active_links,
        total_views=total_views,
        total_clicks=total_clicks,
        total_subscribers=total_subscribers,
        new_users_7d=new_users_7d,
        new_users_30d=new_users_30d,
        views_7d=views_7d,
        clicks_7d=clicks_7d,
        cta_clicks_total=cta_clicks_total,
        cta_clicks_7d=cta_clicks_7d,
        referred_signups_total=referred_signups_total,
        referred_signups_7d=referred_signups_7d,
        daily=daily,
        top_profiles=top_profiles,
        top_referral_sources=top_referral_sources,
    )


@router.get("/users", response_model=AdminUserListResponse)
def list_users(
    q: str | None = Query(default=None, max_length=100),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    _: User = Depends(get_current_superuser),
    db: Session = Depends(get_db),
) -> AdminUserListResponse:
    view_counts = (
        db.query(PageView.profile_id, func.count(PageView.id).label("views"))
        .group_by(PageView.profile_id)
        .subquery()
    )
    click_counts = (
        db.query(LinkClick.profile_id, func.count(LinkClick.id).label("clicks"))
        .group_by(LinkClick.profile_id)
        .subquery()
    )
    link_counts = (
        db.query(Link.profile_id, func.count(Link.id).label("links"))
        .group_by(Link.profile_id)
        .subquery()
    )
    sub_counts = (
        db.query(Subscriber.profile_id, func.count(Subscriber.id).label("subs"))
        .group_by(Subscriber.profile_id)
        .subquery()
    )

    base = (
        db.query(
            User,
            Profile.username,
            Profile.display_name,
            Profile.id.label("profile_id"),
            func.coalesce(link_counts.c.links, 0).label("links_count"),
            func.coalesce(view_counts.c.views, 0).label("views_count"),
            func.coalesce(click_counts.c.clicks, 0).label("clicks_count"),
            func.coalesce(sub_counts.c.subs, 0).label("subscribers_count"),
        )
        .outerjoin(Profile, Profile.user_id == User.id)
        .outerjoin(link_counts, link_counts.c.profile_id == Profile.id)
        .outerjoin(view_counts, view_counts.c.profile_id == Profile.id)
        .outerjoin(click_counts, click_counts.c.profile_id == Profile.id)
        .outerjoin(sub_counts, sub_counts.c.profile_id == Profile.id)
    )

    if q:
        term = f"%{q.strip().lower()}%"
        base = base.filter(
            or_(
                func.lower(User.email).like(term),
                func.lower(Profile.username).like(term),
                func.lower(Profile.display_name).like(term),
            )
        )

    total = base.count()
    rows = (
        base.order_by(User.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    items = [
        AdminUserListItem(
            id=user.id,
            email=user.email,
            is_active=user.is_active,
            is_superuser=user.is_superuser,
            created_at=user.created_at,
            username=username,
            display_name=display_name,
            referred_by_username=getattr(user, "referred_by_username", None),
            links_count=links_count,
            views_count=views_count,
            clicks_count=clicks_count,
            subscribers_count=subscribers_count,
        )
        for user, username, display_name, _profile_id, links_count, views_count, clicks_count, subscribers_count in rows
    ]

    return AdminUserListResponse(items=items, total=total, page=page, page_size=page_size)


@router.get("/users/{user_id}", response_model=AdminUserDetail)
def get_user(
    user_id: UUID,
    _: User = Depends(get_current_superuser),
    db: Session = Depends(get_db),
) -> AdminUserDetail:
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return _build_user_detail(db, user)


@router.patch("/users/{user_id}", response_model=AdminUserDetail)
def update_user(
    user_id: UUID,
    payload: AdminUserUpdate,
    current_user: User = Depends(get_current_superuser),
    db: Session = Depends(get_db),
) -> AdminUserDetail:
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    if user.id == current_user.id:
        if payload.is_active is False:
            raise HTTPException(status_code=400, detail="You cannot deactivate yourself")
        if payload.is_superuser is False:
            raise HTTPException(status_code=400, detail="You cannot remove your own superuser role")

    if payload.is_active is not None:
        user.is_active = payload.is_active
    if payload.is_superuser is not None:
        user.is_superuser = payload.is_superuser

    if payload.is_verified is not None:
        profile = db.query(Profile).filter(Profile.user_id == user.id).first()
        if profile is None:
            raise HTTPException(status_code=400, detail="User has no profile to verify")
        profile.is_verified = payload.is_verified

    db.commit()
    db.refresh(user)
    return _build_user_detail(db, user)


@router.get("/links", response_model=AdminLinkListResponse)
def list_links(
    q: str | None = Query(default=None, max_length=100),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    _: User = Depends(get_current_superuser),
    db: Session = Depends(get_db),
) -> AdminLinkListResponse:
    click_counts = (
        db.query(LinkClick.link_id, func.count(LinkClick.id).label("clicks"))
        .group_by(LinkClick.link_id)
        .subquery()
    )

    base = (
        db.query(
            Link,
            Profile.username,
            Profile.user_id,
            func.coalesce(click_counts.c.clicks, 0).label("clicks_count"),
        )
        .join(Profile, Profile.id == Link.profile_id)
        .outerjoin(click_counts, click_counts.c.link_id == Link.id)
    )

    if q:
        term = f"%{q.strip().lower()}%"
        base = base.filter(
            or_(
                func.lower(Link.title).like(term),
                func.lower(Link.url).like(term),
                func.lower(Profile.username).like(term),
            )
        )

    total = base.count()
    rows = (
        base.order_by(Link.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    items = [
        AdminLinkItem(
            id=link.id,
            title=link.title,
            url=link.url,
            is_active=link.is_active,
            is_featured=link.is_featured,
            position=link.position,
            created_at=link.created_at,
            clicks_count=clicks_count,
            username=username,
            user_id=user_id,
            profile_id=link.profile_id,
        )
        for link, username, user_id, clicks_count in rows
    ]

    return AdminLinkListResponse(items=items, total=total, page=page, page_size=page_size)


@router.get("/shortener-funnel", response_model=ShortenerFunnel)
def shortener_funnel(
    days: int = Query(default=30, ge=1, le=365),
    _: User = Depends(get_current_superuser),
    db: Session = Depends(get_db),
) -> ShortenerFunnel:
    since = datetime.now(timezone.utc) - timedelta(days=days)
    rows = (
        db.query(
            ShortenerEvent.source,
            ShortenerEvent.event,
            func.count(ShortenerEvent.id),
            func.count(func.distinct(ShortenerEvent.visitor_hash)),
        )
        .filter(ShortenerEvent.created_at >= since)
        .group_by(ShortenerEvent.source, ShortenerEvent.event)
        .all()
    )
    per_source: dict[str, dict[str, tuple[int, int]]] = {}
    for source, event, events, visitors in rows:
        per_source.setdefault(source or "unknown", {})[event] = (events, visitors)

    def steps_for(sources: list[str]) -> list[ShortenerFunnelStep]:
        out = []
        for ev in FUNNEL_EVENTS:
            events = sum(per_source.get(s, {}).get(ev, (0, 0))[0] for s in sources)
            visitors = sum(per_source.get(s, {}).get(ev, (0, 0))[1] for s in sources)
            out.append(ShortenerFunnelStep(event=ev, events=events, visitors=visitors))
        return out

    overall_rows = (
        db.query(
            ShortenerEvent.event,
            func.count(ShortenerEvent.id),
            func.count(func.distinct(ShortenerEvent.visitor_hash)),
        )
        .filter(ShortenerEvent.created_at >= since)
        .group_by(ShortenerEvent.event)
        .all()
    )
    overall = {ev: (n, v) for ev, n, v in overall_rows}
    return ShortenerFunnel(
        days=days,
        steps=[
            ShortenerFunnelStep(event=ev, events=overall.get(ev, (0, 0))[0], visitors=overall.get(ev, (0, 0))[1])
            for ev in FUNNEL_EVENTS
        ],
        by_source={s: steps_for([s]) for s in sorted(SOURCES)},
    )
