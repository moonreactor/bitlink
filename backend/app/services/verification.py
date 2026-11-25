import uuid
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.profile import DEFAULT_VERIFICATION_TYPE, Profile
from app.models.verification import VerificationEvent, VerificationRequest

# Badge colors per kind of account; kept in sync with frontend/src/lib/verification.ts.
BADGE_COLORS = {
    "creator": "#0ea5e9",
    "public_figure": "#8b5cf6",
    "brand": "#f59e0b",
    "organization": "#64748b",
}


def verification_fields(profile: Profile) -> dict:
    """Public details of the verified badge (all empty when the profile is not verified)."""
    if not profile.is_verified:
        return {"is_verified": False, "verification_type": None, "verified_at": None}
    return {
        "is_verified": True,
        "verification_type": profile.verification_type or DEFAULT_VERIFICATION_TYPE,
        "verified_at": profile.verified_at,
    }


def badge_color(profile: Profile) -> str | None:
    """Color of the badge drawn on QR codes, or None when the profile is not verified."""
    if not profile.is_verified:
        return None
    return BADGE_COLORS.get(profile.verification_type or "", BADGE_COLORS[DEFAULT_VERIFICATION_TYPE])


def _log(
    db: Session,
    profile: Profile,
    action: str,
    *,
    actor_id: uuid.UUID | None,
    note: str | None = None,
) -> None:
    db.add(
        VerificationEvent(
            profile_id=profile.id,
            action=action,
            verification_type=profile.verification_type,
            actor_id=actor_id,
            note=(note or "").strip()[:500] or None,
        )
    )


def _close_pending_requests(
    db: Session, profile: Profile, status: str, actor_id: uuid.UUID | None
) -> None:
    now = datetime.now(timezone.utc)
    for req in (
        db.query(VerificationRequest)
        .filter(VerificationRequest.profile_id == profile.id, VerificationRequest.status == "pending")
        .all()
    ):
        req.status = status
        req.reviewed_by_id = actor_id
        req.reviewed_at = now


def grant_verification(
    db: Session,
    profile: Profile,
    *,
    actor_id: uuid.UUID,
    verification_type: str | None = None,
    note: str | None = None,
) -> None:
    """Verify the profile (or change its kind) and record it. Pending requests count as approved."""
    kind = verification_type or profile.verification_type or DEFAULT_VERIFICATION_TYPE
    if profile.is_verified:
        if kind != profile.verification_type:
            profile.verification_type = kind
            _log(db, profile, "type_changed", actor_id=actor_id, note=note)
    else:
        profile.is_verified = True
        profile.verification_type = kind
        profile.verified_at = datetime.now(timezone.utc)
        profile.verified_by_id = actor_id
        _log(db, profile, "verified", actor_id=actor_id, note=note)
    if note is not None:
        profile.verification_note = note.strip() or None
    _close_pending_requests(db, profile, "approved", actor_id)


def revoke_verification(
    db: Session,
    profile: Profile,
    *,
    actor_id: uuid.UUID | None,
    note: str | None = None,
) -> bool:
    """Remove the badge. actor_id=None means a rule did it. Returns False if it was not verified."""
    if not profile.is_verified:
        return False
    _log(db, profile, "revoked" if actor_id else "auto_revoked", actor_id=actor_id, note=note)
    profile.is_verified = False
    profile.verification_type = None
    profile.verified_at = None
    profile.verified_by_id = None
    # The note explained this verification; the history keeps it.
    profile.verification_note = None
    return True


def revoke_for_review(db: Session, profile: Profile, reason: str) -> None:
    """Automatic revocation that also opens a request, so a superadmin can restore it in one click."""
    kind = profile.verification_type or DEFAULT_VERIFICATION_TYPE
    if not revoke_verification(db, profile, actor_id=None, note=reason):
        return
    db.add(
        VerificationRequest(
            profile_id=profile.id,
            verification_type=kind,
            source="auto",
            reason=reason,
            evidence_urls=[],
        )
    )
