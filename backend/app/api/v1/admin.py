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
from app.models.report import STATUSES as REPORT_STATUSES, Report
from app.models.short_link import ShortLink
from app.models.shortener_event import FUNNEL_EVENTS, SOURCES, ShortenerEvent
from app.models.subscriber import Subscriber
from app.models.user import User
from app.models.verification import REQUEST_STATUSES, VerificationEvent, VerificationRequest
from app.services.verification import grant_verification, revoke_verification
from app.schemas.report import AdminReportItem, AdminReportListResponse, AdminReportUpdate
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
    AdminVerificationDecision,
    AdminVerificationEvent,
    AdminVerificationRequestItem,
    AdminVerificationRequestList,
    AdminVerificationSignals,
    ShortenerFunnel,
    ShortenerFunnelStep,
)

router = APIRouter(prefix="/admin", tags=["admin"])


def _emails(db: Session, ids: set) -> dict:
    ids = {i for i in ids if i}
    if not ids:
        return {}
    return dict(db.query(User.id, User.email).filter(User.id.in_(ids)).all())


def _verification_history(db: Session, profile: Profile) -> list[AdminVerificationEvent]:
    events = (
        db.query(VerificationEvent)
        .filter(VerificationEvent.profile_id == profile.id)
        .order_by(VerificationEvent.created_at.desc())
        .limit(50)
        .all()
    )
    emails = _emails(db, {e.actor_id for e in events})
    return [
        AdminVerificationEvent(
            id=e.id,
            action=e.action,
            verification_type=e.verification_type,
            actor_email=emails.get(e.actor_id),
            note=e.note,
            created_at=e.created_at,
        )
        for e in events
    ]


def _verification_signals(db: Session, profile: Profile) -> AdminVerificationSignals:
    links = db.query(Link.display, Link.title).filter(Link.profile_id == profile.id).all()
    reports = dict(
        db.query(Report.status, func.count(Report.id))
        .filter(Report.profile_id == profile.id)
        .group_by(Report.status)
        .all()
    )
    created = profile.created_at
    if created.tzinfo is None:
        created = created.replace(tzinfo=timezone.utc)
    return AdminVerificationSignals(
        account_age_days=max(0, (datetime.now(timezone.utc) - created).days),
        has_avatar=bool(profile.avatar_url),
        has_bio=bool((profile.bio or "").strip()),
        verified_domain=(
            profile.custom_domain if profile.custom_domain and profile.custom_domain_verified else None
        ),
        social_profiles=[title for display, title in links if display == "icon"],
        links_count=sum(1 for display, _ in links if display != "icon"),
        views_count=db.query(func.count(PageView.id)).filter(PageView.profile_id == profile.id).scalar()
        or 0,
        clicks_count=db.query(func.count(LinkClick.id)).filter(LinkClick.profile_id == profile.id).scalar()
        or 0,
        subscribers_count=db.query(func.count(Subscriber.id))
        .filter(Subscriber.profile_id == profile.id)
        .scalar()
        or 0,
        reports_total=sum(reports.values()),
        reports_pending=reports.get("pending", 0),
        is_suspicious=bool(profile.is_suspicious),
        previously_revoked=db.query(func.count(VerificationEvent.id))
        .filter(
            VerificationEvent.profile_id == profile.id,
            VerificationEvent.action.in_(("revoked", "auto_revoked")),
        )
        .scalar()
        or 0,
    )


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
        verification_type=profile.verification_type if profile and profile.is_verified else None,
        verified_at=profile.verified_at if profile and profile.is_verified else None,
        verified_by_email=(
            _emails(db, {profile.verified_by_id}).get(profile.verified_by_id)
            if profile and profile.is_verified
            else None
        ),
        verification_note=profile.verification_note if profile else None,
        verification_history=_verification_history(db, profile) if profile else [],
        pending_verification_request_id=(
            db.query(VerificationRequest.id)
            .filter(
                VerificationRequest.profile_id == profile.id,
                VerificationRequest.status == "pending",
            )
            .scalar()
            if profile
            else None
        ),
        is_suspicious=bool(profile.is_suspicious) if profile else False,
        suspicious_at=profile.suspicious_at if profile else None,
        suspicious_note=profile.suspicious_note if profile else None,
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
            Profile.is_suspicious.label("is_suspicious"),
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
            is_suspicious=bool(is_suspicious),
            links_count=links_count,
            views_count=views_count,
            clicks_count=clicks_count,
            subscribers_count=subscribers_count,
        )
        for user, username, display_name, _profile_id, is_suspicious, links_count, views_count, clicks_count, subscribers_count in rows
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

    if (
        payload.is_verified is not None
        or payload.verification_type is not None
        or payload.verification_note is not None
    ):
        profile = db.query(Profile).filter(Profile.user_id == user.id).first()
        if profile is None:
            raise HTTPException(status_code=400, detail="User has no profile to verify")
        verify = profile.is_verified if payload.is_verified is None else payload.is_verified
        if verify:
            if payload.is_verified and profile.is_suspicious:
                raise HTTPException(
                    status_code=400, detail="Clear the suspicious flag before verifying this profile"
                )
            grant_verification(
                db,
                profile,
                actor_id=current_user.id,
                verification_type=payload.verification_type,
                note=payload.verification_note,
            )
        elif payload.is_verified is False:
            revoke_verification(db, profile, actor_id=current_user.id, note=payload.verification_note)
        else:
            raise HTTPException(status_code=400, detail="Profile is not verified")

    if payload.is_suspicious is not None:
        profile = db.query(Profile).filter(Profile.user_id == user.id).first()
        if profile is None:
            raise HTTPException(status_code=400, detail="User has no profile to flag")
        if payload.is_suspicious:
            # A flagged profile cannot keep the badge (no review request: it needs a fresh look).
            revoke_verification(db, profile, actor_id=None, note="Flagged as suspicious")
            profile.is_suspicious = True
            if profile.suspicious_at is None:
                profile.suspicious_at = datetime.now(timezone.utc)
            profile.suspicious_note = (payload.suspicious_note or "").strip() or None
        else:
            profile.is_suspicious = False
            profile.suspicious_at = None
            profile.suspicious_note = None

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


def _report_items(db: Session, reports: list[Report]) -> list[AdminReportItem]:
    profile_ids = {r.profile_id for r in reports if r.profile_id}
    link_ids = {r.link_id for r in reports if r.link_id}
    short_ids = {r.short_link_id for r in reports if r.short_link_id}
    resolver_ids = {r.resolved_by_id for r in reports if r.resolved_by_id}

    profiles = (
        {p.id: p for p in db.query(Profile).filter(Profile.id.in_(profile_ids)).all()}
        if profile_ids
        else {}
    )
    links = {l.id: l for l in db.query(Link).filter(Link.id.in_(link_ids)).all()} if link_ids else {}
    shorts = (
        {s.id: s for s in db.query(ShortLink).filter(ShortLink.id.in_(short_ids)).all()}
        if short_ids
        else {}
    )
    resolvers = (
        {u.id: u.email for u in db.query(User).filter(User.id.in_(resolver_ids)).all()}
        if resolver_ids
        else {}
    )

    def target_key(r: Report):
        return r.short_link_id or r.link_id or r.profile_id

    keys = {target_key(r) for r in reports if target_key(r)}
    counts: dict = {}
    if keys:
        for col in (Report.short_link_id, Report.link_id, Report.profile_id):
            for key, n in (
                db.query(col, func.count(Report.id)).filter(col.in_(keys)).group_by(col).all()
            ):
                counts[key] = counts.get(key, 0) + n

    out: list[AdminReportItem] = []
    for r in reports:
        profile = profiles.get(r.profile_id) if r.profile_id else None
        active: bool | None = None
        if r.target_type == "link":
            link = links.get(r.link_id) if r.link_id else None
            active = link.is_active if link else False
        elif r.target_type == "short_link":
            short = shorts.get(r.short_link_id) if r.short_link_id else None
            active = short.is_active if short else False
        out.append(
            AdminReportItem(
                id=r.id,
                target_type=r.target_type,
                target_label=r.target_label,
                target_url=r.target_url,
                username=profile.username if profile else None,
                owner_user_id=profile.user_id if profile else None,
                link_id=r.link_id,
                short_link_id=r.short_link_id,
                target_active=active,
                reason=r.reason,
                details=r.details,
                status=r.status,
                resolution_note=r.resolution_note,
                resolved_at=r.resolved_at,
                resolved_by_email=resolvers.get(r.resolved_by_id) if r.resolved_by_id else None,
                created_at=r.created_at,
                reports_for_target=counts.get(target_key(r), 1),
            )
        )
    return out


@router.get("/reports", response_model=AdminReportListResponse)
def list_reports(
    status_filter: str | None = Query(default=None, alias="status"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    _: User = Depends(get_current_superuser),
    db: Session = Depends(get_db),
) -> AdminReportListResponse:
    if status_filter and status_filter not in REPORT_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")

    query = db.query(Report)
    if status_filter:
        query = query.filter(Report.status == status_filter)
    total = query.count()
    rows = (
        query.order_by(Report.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    )
    by_status = dict(db.query(Report.status, func.count(Report.id)).group_by(Report.status).all())
    return AdminReportListResponse(
        items=_report_items(db, rows),
        total=total,
        page=page,
        page_size=page_size,
        pending=by_status.get("pending", 0),
        resolved=by_status.get("resolved", 0),
        dismissed=by_status.get("dismissed", 0),
    )


@router.patch("/reports/{report_id}", response_model=AdminReportItem)
def update_report(
    report_id: UUID,
    payload: AdminReportUpdate,
    current_user: User = Depends(get_current_superuser),
    db: Session = Depends(get_db),
) -> AdminReportItem:
    report = db.get(Report, report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")

    if payload.disable_target:
        if report.link_id:
            link = db.get(Link, report.link_id)
            if link:
                link.is_active = False
        elif report.short_link_id:
            short = db.get(ShortLink, report.short_link_id)
            if short:
                short.is_active = False
        else:
            raise HTTPException(
                status_code=400,
                detail="Only links and short links can be disabled here; manage profiles from Users.",
            )

    report.status = payload.status
    report.resolution_note = (payload.resolution_note or "").strip() or None
    if payload.status == "pending":
        report.resolved_at = None
        report.resolved_by_id = None
    else:
        report.resolved_at = datetime.now(timezone.utc)
        report.resolved_by_id = current_user.id
    db.commit()
    db.refresh(report)
    return _report_items(db, [report])[0]


def _request_items(db: Session, rows: list[VerificationRequest]) -> list[AdminVerificationRequestItem]:
    profiles = {
        p.id: p
        for p in db.query(Profile).filter(Profile.id.in_({r.profile_id for r in rows})).all()
    } if rows else {}
    reviewers = _emails(db, {r.reviewed_by_id for r in rows})
    out = []
    for r in rows:
        p = profiles[r.profile_id]
        out.append(
            AdminVerificationRequestItem(
                id=r.id,
                profile_id=p.id,
                user_id=p.user_id,
                username=p.username,
                display_name=p.display_name,
                avatar_url=p.avatar_url,
                is_verified=bool(p.is_verified),
                verification_type=r.verification_type,
                source=r.source,
                reason=r.reason,
                evidence_urls=list(r.evidence_urls or []),
                status=r.status,
                decision_note=r.decision_note,
                reviewed_by_email=reviewers.get(r.reviewed_by_id),
                reviewed_at=r.reviewed_at,
                created_at=r.created_at,
                signals=_verification_signals(db, p),
            )
        )
    return out


@router.get("/verification-requests", response_model=AdminVerificationRequestList)
def list_verification_requests(
    status_filter: str | None = Query(default=None, alias="status"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    _: User = Depends(get_current_superuser),
    db: Session = Depends(get_db),
) -> AdminVerificationRequestList:
    if status_filter and status_filter not in REQUEST_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")
    query = db.query(VerificationRequest)
    if status_filter:
        query = query.filter(VerificationRequest.status == status_filter)
    total = query.count()
    # Oldest first while pending (a queue); newest first for the history tabs.
    order = (
        VerificationRequest.created_at.asc()
        if status_filter == "pending"
        else VerificationRequest.created_at.desc()
    )
    rows = query.order_by(order).offset((page - 1) * page_size).limit(page_size).all()
    by_status = dict(
        db.query(VerificationRequest.status, func.count(VerificationRequest.id))
        .group_by(VerificationRequest.status)
        .all()
    )
    return AdminVerificationRequestList(
        items=_request_items(db, rows),
        total=total,
        page=page,
        page_size=page_size,
        pending=by_status.get("pending", 0),
        approved=by_status.get("approved", 0),
        rejected=by_status.get("rejected", 0),
    )


@router.patch("/verification-requests/{request_id}", response_model=AdminVerificationRequestItem)
def decide_verification_request(
    request_id: UUID,
    payload: AdminVerificationDecision,
    current_user: User = Depends(get_current_superuser),
    db: Session = Depends(get_db),
) -> AdminVerificationRequestItem:
    req = db.get(VerificationRequest, request_id)
    if req is None:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != "pending":
        raise HTTPException(status_code=400, detail="This request was already reviewed")
    profile = db.get(Profile, req.profile_id)

    if payload.status == "approved":
        if profile.is_suspicious:
            raise HTTPException(
                status_code=400, detail="Clear the suspicious flag before verifying this profile"
            )
        req.verification_type = payload.verification_type or req.verification_type
        # Closes this request (and any other pending one) as approved.
        grant_verification(
            db,
            profile,
            actor_id=current_user.id,
            verification_type=req.verification_type,
            note=payload.note,
        )
    else:
        req.status = "rejected"
        req.decision_note = (payload.note or "").strip() or None
        req.reviewed_by_id = current_user.id
        req.reviewed_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(req)
    return _request_items(db, [req])[0]
