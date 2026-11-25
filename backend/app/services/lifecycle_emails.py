"""Periodic emails that nudge owners to finish and grow their page.

Every few hours each active user gets at most ONE of these, the first that applies:

1. identity_alert       new impersonation alerts they haven't seen (account email, ignores opt-out)
2. complete_profile     missing photo, bio or first link (account ≥ 1 day; every 7 days, max 3)
3. verification_invite  meets the verified-badge requirements and hasn't asked (every 30 days, max 2)
4. add_links            only 1–4 links (account ≥ 3 days; every 14 days, max 4)
5. weekly_summary       had visits in the last 7 days (weekly)

Tips (2–5) also keep a minimum gap between any two of them and respect the opt-out.
Pacing is read from ``email_logs``, so running the job twice never sends twice.
"""

from __future__ import annotations

import asyncio
import logging
import time
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.analytics import LinkClick, PageView
from app.models.email_log import EmailLog
from app.models.link import Link
from app.models.profile import Profile
from app.models.user import User
from app.models.verification import IdentityAlert, VerificationRequest
from app.services.email_templates import MARKETING_KINDS
from app.services.mailer import send_email

logger = logging.getLogger("bitlink.lifecycle")

RUN_EVERY_SECONDS = 6 * 60 * 60
# Resend's default limit is 2 requests/second.
SEND_PAUSE_SECONDS = 0.6

MIN_GAP_BETWEEN_TIPS = timedelta(days=3)
VERIFICATION_MIN_AGE = timedelta(days=7)
REJECTION_COOLDOWN = timedelta(days=14)


@dataclass(frozen=True)
class Rule:
    every: timedelta
    max_total: int | None = None
    min_account_age: timedelta = timedelta(0)


RULES: dict[str, Rule] = {
    "identity_alert": Rule(every=timedelta(days=1)),
    "complete_profile": Rule(every=timedelta(days=7), max_total=3, min_account_age=timedelta(days=1)),
    "verification_invite": Rule(every=timedelta(days=30), max_total=2, min_account_age=VERIFICATION_MIN_AGE),
    "add_links": Rule(every=timedelta(days=14), max_total=4, min_account_age=timedelta(days=3)),
    # A little under 7 days so a run that starts a bit early still catches the week.
    "weekly_summary": Rule(every=timedelta(days=6, hours=12), min_account_age=timedelta(days=7)),
}


@dataclass
class History:
    last: dict[str, datetime] = field(default_factory=dict)
    count: dict[str, int] = field(default_factory=dict)
    last_tip: datetime | None = None


@dataclass
class Planned:
    kind: str
    cta_path: str
    ctx: dict


def _aware(dt: datetime | None) -> datetime | None:
    if dt is None:
        return None
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


def _history(db: Session, user_ids: list) -> dict:
    rows = (
        db.query(EmailLog.user_id, EmailLog.kind, func.max(EmailLog.created_at), func.count(EmailLog.id))
        .filter(EmailLog.user_id.in_(user_ids), EmailLog.status.in_(("sent", "skipped")))
        .group_by(EmailLog.user_id, EmailLog.kind)
        .all()
    )
    out: dict = {}
    for user_id, kind, last, count in rows:
        h = out.setdefault(user_id, History())
        last = _aware(last)
        h.last[kind] = last
        h.count[kind] = count
        if kind in MARKETING_KINDS and (h.last_tip is None or last > h.last_tip):
            h.last_tip = last
    return out


def _due(kind: str, h: History, account_age: timedelta, now: datetime) -> bool:
    rule = RULES[kind]
    if account_age < rule.min_account_age:
        return False
    if rule.max_total is not None and h.count.get(kind, 0) >= rule.max_total:
        return False
    last = h.last.get(kind)
    return last is None or now - last >= rule.every


def _button_links(db: Session, profile: Profile) -> int:
    return (
        db.query(func.count(Link.id))
        .filter(Link.profile_id == profile.id, Link.display == "button", Link.is_active.is_(True))
        .scalar()
        or 0
    )


def _can_request_verification(db: Session, profile: Profile, now: datetime) -> bool:
    if profile.is_verified or profile.is_suspicious:
        return False
    if not (profile.avatar_url and (profile.bio or "").strip()):
        return False
    has_social = (
        db.query(Link.id).filter(Link.profile_id == profile.id, Link.display == "icon").first() is not None
    )
    if not has_social:
        return False
    latest = (
        db.query(VerificationRequest)
        .filter(VerificationRequest.profile_id == profile.id)
        .order_by(VerificationRequest.created_at.desc())
        .first()
    )
    if latest is None:
        return True
    if latest.status in ("pending", "approved"):
        return False
    reviewed = _aware(latest.reviewed_at) or _aware(latest.created_at)
    return now - reviewed >= REJECTION_COOLDOWN


def plan_for(db: Session, user: User, h: History, now: datetime) -> Planned | None:
    """The one email this user should get now, if any."""
    profile = user.profile
    if profile is None or not user.is_active:
        return None
    age = now - _aware(user.created_at)

    # 1. Impersonation alerts (security): unseen ones newer than the last alert email.
    if profile.is_verified and _due("identity_alert", h, age, now):
        since = h.last.get("identity_alert")
        q = db.query(IdentityAlert).filter(
            IdentityAlert.profile_id == profile.id, IdentityAlert.seen_at.is_(None)
        )
        if since is not None:
            q = q.filter(IdentityAlert.created_at > since)
        alerts = q.order_by(IdentityAlert.created_at.desc()).all()
        if alerts:
            return Planned(
                "identity_alert",
                "/dashboard/settings#verification",
                {"alert_count": len(alerts), "subject": alerts[0].subject},
            )

    if not user.marketing_emails or profile.is_suspicious:
        return None
    if h.last_tip is not None and now - h.last_tip < MIN_GAP_BETWEEN_TIPS:
        return None

    links = _button_links(db, profile)

    # 2. Finish the page.
    missing = [
        key
        for key, ok in (
            ("avatar", bool(profile.avatar_url)),
            ("bio", bool((profile.bio or "").strip())),
            ("links", links > 0),
        )
        if not ok
    ]
    if missing and _due("complete_profile", h, age, now):
        return Planned("complete_profile", "/dashboard", {"missing": missing})

    # 3. Verified badge.
    if _due("verification_invite", h, age, now) and _can_request_verification(db, profile, now):
        return Planned("verification_invite", "/dashboard/settings#verification", {})

    # 4. More links.
    if 1 <= links <= 4 and _due("add_links", h, age, now):
        return Planned("add_links", "/dashboard/links", {"link_count": links})

    # 5. Weekly summary.
    if _due("weekly_summary", h, age, now):
        week_ago = now - timedelta(days=7)
        views = (
            db.query(func.count(PageView.id))
            .filter(PageView.profile_id == profile.id, PageView.created_at >= week_ago)
            .scalar()
            or 0
        )
        if views > 0:
            rows = (
                db.query(LinkClick.link_id, func.count(LinkClick.id))
                .filter(LinkClick.profile_id == profile.id, LinkClick.created_at >= week_ago)
                .group_by(LinkClick.link_id)
                .order_by(func.count(LinkClick.id).desc())
                .all()
            )
            clicks = sum(n for _, n in rows)
            top = db.get(Link, rows[0][0]) if rows else None
            top_title = top.title if top else ""
            return Planned(
                "weekly_summary",
                "/dashboard",
                {"views": views, "clicks": clicks, "top_link": top_title},
            )
    return None


@dataclass
class RunReport:
    checked: int = 0
    planned: dict[str, int] = field(default_factory=dict)
    sent: int = 0
    failed: int = 0
    capped: bool = False


def run_lifecycle(
    db: Session,
    *,
    dry_run: bool = False,
    limit: int | None = None,
    now: datetime | None = None,
    pause: float = 0.0,
) -> RunReport:
    """Decide and (unless ``dry_run``) send this round of lifecycle emails."""
    now = now or datetime.now(timezone.utc)
    cap = limit if limit is not None else settings.LIFECYCLE_MAX_PER_RUN
    report = RunReport()
    batch_size = 200
    offset = 0
    while True:
        users = (
            db.query(User)
            .filter(User.is_active.is_(True))
            .order_by(User.created_at, User.id)
            .offset(offset)
            .limit(batch_size)
            .all()
        )
        if not users:
            break
        offset += batch_size
        history = _history(db, [u.id for u in users])
        for user in users:
            report.checked += 1
            plan = plan_for(db, user, history.get(user.id, History()), now)
            if plan is None:
                continue
            if sum(report.planned.values()) >= cap:
                report.capped = True
                return report
            if dry_run:
                report.planned[plan.kind] = report.planned.get(plan.kind, 0) + 1
                continue
            log = send_email(
                db,
                user,
                plan.kind,
                cta_path=plan.cta_path,
                ctx=plan.ctx,
                # Same user + kind + day never goes out twice, even if two workers race.
                idempotency_key=f"{plan.kind}:{user.id}:{now.date().isoformat()}",
            )
            db.commit()
            if log is None:
                continue
            report.planned[plan.kind] = report.planned.get(plan.kind, 0) + 1
            if log.status == "failed":
                report.failed += 1
            else:
                report.sent += 1
            if pause:
                time.sleep(pause)
    return report


def _run_once() -> None:
    if not settings.LIFECYCLE_EMAILS_ENABLED or not settings.RESEND_API_KEY:
        return
    db = SessionLocal()
    try:
        report = run_lifecycle(db, pause=SEND_PAUSE_SECONDS)
        if report.sent or report.failed:
            logger.info(
                "Lifecycle emails: %s sent, %s failed, by kind %s%s",
                report.sent,
                report.failed,
                report.planned,
                " (capped)" if report.capped else "",
            )
    except Exception:  # noqa: BLE001 - never crash the API because of emails
        logger.exception("Lifecycle email run failed")
        db.rollback()
    finally:
        db.close()


async def lifecycle_loop() -> None:
    """Background task started with the API: a few minutes after boot, then every 6 hours."""
    await asyncio.sleep(5 * 60)
    while True:
        await asyncio.to_thread(_run_once)
        await asyncio.sleep(RUN_EVERY_SECONDS)


if __name__ == "__main__":  # manual run: python -m app.services.lifecycle_emails
    _run_once()
