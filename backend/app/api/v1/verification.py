"""The owner's side of the verified badge: requirements, proof code and asking for review."""

from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.v1.profile import get_user_profile
from app.core.deps import get_current_user
from app.db.session import SessionLocal, get_db
from app.models.link import Link
from app.models.profile import Profile
from app.models.user import User
from app.models.verification import IdentityAlert, VerificationRequest
from app.schemas.verification import (
    IdentityAlertList,
    IdentityAlertOut,
    MyVerificationOut,
    MyVerificationRequest,
    VerificationRequestCreate,
    VerificationRequirement,
)
from app.services.verification_proof import proof_code, run_proof_checks

router = APIRouter(prefix="/me/verification", tags=["verification"])

MIN_ACCOUNT_AGE = timedelta(days=7)
REJECTION_COOLDOWN = timedelta(days=14)


def _aware(dt: datetime) -> datetime:
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


def requirements(db: Session, profile: Profile) -> list[VerificationRequirement]:
    has_social = (
        db.query(Link.id).filter(Link.profile_id == profile.id, Link.display == "icon").first()
        is not None
    )
    age = datetime.now(timezone.utc) - _aware(profile.created_at)
    return [
        VerificationRequirement(key="avatar", met=bool(profile.avatar_url)),
        VerificationRequirement(key="bio", met=bool((profile.bio or "").strip())),
        VerificationRequirement(key="social_profile", met=has_social),
        VerificationRequirement(key="account_age", met=age >= MIN_ACCOUNT_AGE),
        VerificationRequirement(key="not_flagged", met=not profile.is_suspicious),
        VerificationRequirement(
            key="custom_domain",
            met=bool(profile.custom_domain and profile.custom_domain_verified),
            required=False,
        ),
    ]


def _latest(db: Session, profile: Profile) -> VerificationRequest | None:
    return (
        db.query(VerificationRequest)
        .filter(VerificationRequest.profile_id == profile.id)
        .order_by(VerificationRequest.created_at.desc())
        .first()
    )


def _status(db: Session, profile: Profile) -> MyVerificationOut:
    reqs = requirements(db, profile)
    latest = _latest(db, profile)
    cooldown_until = None
    blocked = None
    if profile.is_verified:
        blocked = "verified"
    elif profile.is_suspicious:
        blocked = "flagged"
    elif latest is not None and latest.status == "pending":
        blocked = "pending"
    elif latest is not None and latest.status == "rejected" and latest.reviewed_at:
        until = _aware(latest.reviewed_at) + REJECTION_COOLDOWN
        if until > datetime.now(timezone.utc):
            blocked, cooldown_until = "cooldown", until
    if blocked is None and not all(r.met for r in reqs if r.required):
        blocked = "requirements"

    return MyVerificationOut(
        is_verified=bool(profile.is_verified),
        verification_type=profile.verification_type if profile.is_verified else None,
        verified_at=profile.verified_at if profile.is_verified else None,
        proof_code=proof_code(profile.id),
        requirements=reqs,
        can_request=blocked is None,
        blocked_reason=blocked,
        cooldown_until=cooldown_until,
        latest_request=(
            MyVerificationRequest(
                id=str(latest.id),
                status=latest.status,
                source=latest.source,
                verification_type=latest.verification_type,
                created_at=latest.created_at,
                reviewed_at=latest.reviewed_at,
                decision_note=latest.decision_note if latest.status == "rejected" else None,
                proof_results=latest.proof_results,
            )
            if latest
            else None
        ),
    )


def check_request_proof(request_id: UUID) -> None:
    """Background job: look for the profile's code on the evidence links and its domains."""
    db = SessionLocal()
    try:
        req = db.get(VerificationRequest, request_id)
        if req is None:
            return
        profile = db.get(Profile, req.profile_id)
        domain = profile.custom_domain if profile.custom_domain_verified else None
        req.proof_results = run_proof_checks(proof_code(profile.id), list(req.evidence_urls), domain)
        db.commit()
    finally:
        db.close()


@router.get("", response_model=MyVerificationOut)
def my_verification(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MyVerificationOut:
    return _status(db, get_user_profile(db, current_user))


@router.post("/request", response_model=MyVerificationOut, status_code=status.HTTP_201_CREATED)
def request_verification(
    payload: VerificationRequestCreate,
    background: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MyVerificationOut:
    profile = get_user_profile(db, current_user)
    current = _status(db, profile)
    if not current.can_request:
        messages = {
            "verified": "Your profile is already verified.",
            "flagged": "Profiles under review for policy reasons cannot ask for verification.",
            "pending": "You already have a request under review.",
            "cooldown": "You can ask again 14 days after a rejected request.",
            "requirements": "Complete the requirements before asking for verification.",
        }
        raise HTTPException(status_code=400, detail=messages[current.blocked_reason or "requirements"])

    req = VerificationRequest(
        profile_id=profile.id,
        verification_type=payload.verification_type,
        source="user",
        reason=payload.reason,
        evidence_urls=payload.evidence_urls,
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    background.add_task(check_request_proof, req.id)
    return _status(db, profile)


def _alerts(db: Session, profile: Profile) -> IdentityAlertList:
    rows = (
        db.query(IdentityAlert)
        .filter(IdentityAlert.profile_id == profile.id)
        .order_by(IdentityAlert.created_at.desc())
        .limit(30)
        .all()
    )
    unseen = (
        db.query(func.count(IdentityAlert.id))
        .filter(IdentityAlert.profile_id == profile.id, IdentityAlert.seen_at.is_(None))
        .scalar()
        or 0
    )
    return IdentityAlertList(
        items=[
            IdentityAlertOut(
                id=str(a.id),
                kind=a.kind,
                subject=a.subject,
                report_reason=a.report_reason,
                seen=a.seen_at is not None,
                created_at=a.created_at,
            )
            for a in rows
        ],
        unseen=unseen,
    )


@router.get("/alerts", response_model=IdentityAlertList)
def my_identity_alerts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> IdentityAlertList:
    """Attempts to take a name like yours, and reports against profiles that look like yours."""
    return _alerts(db, get_user_profile(db, current_user))


@router.post("/alerts/seen", response_model=IdentityAlertList)
def mark_identity_alerts_seen(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> IdentityAlertList:
    profile = get_user_profile(db, current_user)
    db.query(IdentityAlert).filter(
        IdentityAlert.profile_id == profile.id, IdentityAlert.seen_at.is_(None)
    ).update({IdentityAlert.seen_at: datetime.now(timezone.utc)}, synchronize_session=False)
    db.commit()
    return _alerts(db, profile)
