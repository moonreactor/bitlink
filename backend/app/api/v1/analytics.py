from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Query
from sqlalchemy import Date, and_, cast, func
from sqlalchemy.orm import Session

from app.api.v1.profile import get_user_profile
from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.analytics import LinkClick, PageView
from app.models.link import Link
from app.models.subscriber import Subscriber
from app.models.user import User
from app.schemas.analytics import (
    AnalyticsSummary,
    CountryStat,
    DailyStat,
    DeviceStat,
    LinkStat,
    ReferrerStat,
    SubscriberOut,
)
from app.services.analytics import parse_date_param

router = APIRouter(prefix="/me", tags=["analytics"])


@router.get("/analytics/summary", response_model=AnalyticsSummary)
def analytics_summary(
    from_date: str | None = Query(default=None, alias="from"),
    to_date: str | None = Query(default=None, alias="to"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> AnalyticsSummary:
    profile = get_user_profile(db, current_user)
    start = parse_date_param(from_date)
    end = parse_date_param(to_date)

    view_q = db.query(PageView).filter(PageView.profile_id == profile.id)
    click_q = db.query(LinkClick).filter(LinkClick.profile_id == profile.id)
    if start:
        view_q = view_q.filter(PageView.created_at >= start)
        click_q = click_q.filter(LinkClick.created_at >= start)
    if end:
        view_q = view_q.filter(PageView.created_at <= end)
        click_q = click_q.filter(LinkClick.created_at <= end)

    total_views = view_q.count()
    total_clicks = click_q.count()

    join_conds = [LinkClick.link_id == Link.id]
    if start:
        join_conds.append(LinkClick.created_at >= start)
    if end:
        join_conds.append(LinkClick.created_at <= end)

    link_rows = (
        db.query(Link.id, Link.title, func.count(LinkClick.id))
        .outerjoin(LinkClick, and_(*join_conds))
        .filter(Link.profile_id == profile.id)
        .group_by(Link.id, Link.title)
        .order_by(func.count(LinkClick.id).desc())
        .all()
    )
    links = [LinkStat(link_id=r[0], title=r[1], clicks=r[2]) for r in link_rows]

    device_rows = (
        db.query(func.coalesce(PageView.device, "unknown"), func.count())
        .filter(PageView.profile_id == profile.id)
    )
    if start:
        device_rows = device_rows.filter(PageView.created_at >= start)
    if end:
        device_rows = device_rows.filter(PageView.created_at <= end)
    devices = [
        DeviceStat(device=r[0], count=r[1])
        for r in device_rows.group_by(PageView.device).order_by(func.count().desc()).all()
    ]

    ref_rows = (
        db.query(func.coalesce(PageView.referrer, "direct"), func.count())
        .filter(PageView.profile_id == profile.id)
    )
    if start:
        ref_rows = ref_rows.filter(PageView.created_at >= start)
    if end:
        ref_rows = ref_rows.filter(PageView.created_at <= end)
    referrers = [
        ReferrerStat(referrer=r[0], count=r[1])
        for r in ref_rows.group_by(PageView.referrer).order_by(func.count().desc()).limit(10).all()
    ]

    country_rows = (
        db.query(func.coalesce(PageView.country, "??"), func.count())
        .filter(PageView.profile_id == profile.id)
    )
    if start:
        country_rows = country_rows.filter(PageView.created_at >= start)
    if end:
        country_rows = country_rows.filter(PageView.created_at <= end)
    countries = [
        CountryStat(country=r[0], count=r[1])
        for r in country_rows.group_by(PageView.country).order_by(func.count().desc()).limit(10).all()
    ]

    # Daily breakdown
    view_daily = (
        db.query(cast(PageView.created_at, Date).label("d"), func.count())
        .filter(PageView.profile_id == profile.id)
    )
    click_daily = (
        db.query(cast(LinkClick.created_at, Date).label("d"), func.count())
        .filter(LinkClick.profile_id == profile.id)
    )
    if start:
        view_daily = view_daily.filter(PageView.created_at >= start)
        click_daily = click_daily.filter(LinkClick.created_at >= start)
    if end:
        view_daily = view_daily.filter(PageView.created_at <= end)
        click_daily = click_daily.filter(LinkClick.created_at <= end)

    views_by_day = {str(r[0]): r[1] for r in view_daily.group_by("d").all()}
    clicks_by_day = {str(r[0]): r[1] for r in click_daily.group_by("d").all()}
    all_days = sorted(set(views_by_day) | set(clicks_by_day))
    daily = [
        DailyStat(date=d, views=views_by_day.get(d, 0), clicks=clicks_by_day.get(d, 0))
        for d in all_days
    ]

    return AnalyticsSummary(
        total_views=total_views,
        total_clicks=total_clicks,
        links=links,
        devices=devices,
        referrers=referrers,
        countries=countries,
        daily=daily,
        from_date=start,
        to_date=end or datetime.now(timezone.utc),
    )


@router.get("/subscribers", response_model=list[SubscriberOut])
def list_subscribers(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[Subscriber]:
    profile = get_user_profile(db, current_user)
    return (
        db.query(Subscriber)
        .filter(Subscriber.profile_id == profile.id)
        .order_by(Subscriber.created_at.desc())
        .all()
    )
