from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.v1.short_links import _client_ip, _sha256
from app.db.session import get_db
from app.models.link import Link
from app.models.profile import Profile
from app.models.report import Report
from app.models.short_link import ShortLink
from app.schemas.report import ReportCreate
from app.services.identity import alert_owner, impersonated_profile
from app.services.short_links import normalize_code

router = APIRouter(tags=["reports"])

MAX_REPORTS_PER_HOUR = 10


def _short_code(raw: str) -> str:
    """Accept a bare code or a full short URL (bitlink.click/code)."""
    value = raw.strip().split("?")[0].split("#")[0].rstrip("/")
    return normalize_code(value.rsplit("/", 1)[-1])


@router.post("/public/reports", status_code=status.HTTP_204_NO_CONTENT)
def create_report(payload: ReportCreate, request: Request, db: Session = Depends(get_db)) -> None:
    reporter_hash = _sha256(_client_ip(request))
    now = datetime.now(timezone.utc)

    recent = (
        db.query(func.count(Report.id))
        .filter(Report.reporter_hash == reporter_hash, Report.created_at >= now - timedelta(hours=1))
        .scalar()
        or 0
    )
    if recent >= MAX_REPORTS_PER_HOUR:
        raise HTTPException(status_code=429, detail="Too many reports. Please try again later.")

    report = Report(reason=payload.reason, reporter_hash=reporter_hash)
    report.details = (payload.details or "").strip() or None

    if payload.short_code:
        code = _short_code(payload.short_code)
        short = db.query(ShortLink).filter(ShortLink.code == code).first()
        if short is None:
            raise HTTPException(status_code=404, detail="Short link not found")
        report.target_type = "short_link"
        report.short_link_id = short.id
        report.target_label = f"/{short.code}"
        report.target_url = short.destination_url
        dup = Report.short_link_id == short.id
    else:
        profile = db.query(Profile).filter(Profile.username == (payload.username or "").lower()).first()
        if profile is None:
            raise HTTPException(status_code=404, detail="Profile not found")
        report.profile_id = profile.id
        if payload.link_id:
            link = (
                db.query(Link)
                .filter(Link.id == payload.link_id, Link.profile_id == profile.id)
                .first()
            )
            if link is None:
                raise HTTPException(status_code=404, detail="Link not found")
            report.target_type = "link"
            report.link_id = link.id
            report.target_label = f"@{profile.username} · {link.title}"[:160]
            report.target_url = link.url
            dup = Report.link_id == link.id
        else:
            report.target_type = "profile"
            report.target_label = f"@{profile.username}"
            dup = (Report.target_type == "profile") & (Report.profile_id == profile.id)

    # The same person reporting the same target twice in a day is a no-op (still 204).
    already = (
        db.query(Report.id)
        .filter(dup, Report.reporter_hash == reporter_hash, Report.created_at >= now - timedelta(days=1))
        .first()
    )
    if already:
        return

    db.add(report)
    db.flush()
    # Reported profile looks like a verified account: let its owner know.
    if report.profile_id:
        reported = db.get(Profile, report.profile_id)
        if owner := impersonated_profile(db, reported):
            alert_owner(
                db,
                owner,
                "reported_lookalike",
                f"@{reported.username}",
                report_id=report.id,
                report_reason=report.reason,
            )
    db.commit()
