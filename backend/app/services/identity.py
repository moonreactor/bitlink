"""Keep people from passing themselves off as a verified account.

A username "looks like" a verified one when both reduce to the same skeleton: lowercase, no
underscores, digits and letters that read alike folded together (0→o, 1→l, rn→m…), common
impostor words around it removed ("real", "official", "oficial"…) and trailing digits dropped.
So a verified @luciarios protects lucia_rios, luciari0s, real_luciarios, luciariosoficial and
luciarios2 — but not mariarios.

Display names are protected only for brands, organizations and public figures (people share
names, companies and famous names should not), with an exact, case- and accent-insensitive match.
"""

from __future__ import annotations

import re
import unicodedata
import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models.profile import Profile
from app.models.verification import IdentityAlert

_PREFIXES = ("real", "the", "official", "oficial", "its", "soy", "iam")
_SUFFIXES = ("official", "oficial", "real", "hq", "tv", "app", "page", "team")
# Letter pairs that read as one letter.
_MULTI = (("rn", "m"), ("vv", "w"), ("cl", "d"))
_SINGLE = str.maketrans({"0": "o", "1": "l", "i": "l", "3": "e", "4": "a", "5": "s", "7": "t", "8": "b", "9": "g"})
# Skeletons this short would block too many names.
MIN_SKELETON = 4
PROTECTED_NAME_TYPES = ("brand", "organization", "public_figure")


def username_skeleton(username: str) -> str:
    s = username.lower().replace("_", "").replace("-", "").replace(".", "")
    changed = True
    while changed:
        changed = False
        for p in _PREFIXES:
            if s.startswith(p) and len(s) - len(p) >= MIN_SKELETON:
                s, changed = s[len(p) :], True
        for x in _SUFFIXES:
            if s.endswith(x) and len(s) - len(x) >= MIN_SKELETON:
                s, changed = s[: -len(x)], True
    s = re.sub(r"\d+$", "", s) or s
    # Single characters first, so "i"→"l" can then form "cl"→"d" the same way on both sides.
    s = s.translate(_SINGLE)
    for a, b in _MULTI:
        s = s.replace(a, b)
    return s


def name_key(name: str) -> str:
    folded = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]", "", folded.lower())


def lookalike_verified_username(
    db: Session, username: str, exclude_profile_id: uuid.UUID | None = None
) -> Profile | None:
    """The verified profile this username could be mistaken for, if any."""
    skeleton = username_skeleton(username)
    if len(skeleton) < MIN_SKELETON:
        return None
    query = db.query(Profile).filter(Profile.is_verified.is_(True))
    if exclude_profile_id is not None:
        query = query.filter(Profile.id != exclude_profile_id)
    # The verified set is small; if it grows, store the skeleton in an indexed column instead.
    for profile in query.all():
        if username_skeleton(profile.username) == skeleton:
            return profile
    return None


def protected_display_name_owner(
    db: Session, display_name: str, exclude_profile_id: uuid.UUID | None = None
) -> Profile | None:
    """The verified brand/organization/public figure that already uses this display name."""
    key = name_key(display_name)
    if len(key) < 3:
        return None
    query = db.query(Profile).filter(
        Profile.is_verified.is_(True), Profile.verification_type.in_(PROTECTED_NAME_TYPES)
    )
    if exclude_profile_id is not None:
        query = query.filter(Profile.id != exclude_profile_id)
    for profile in query.all():
        if name_key(profile.display_name) == key:
            return profile
    return None


def impersonated_profile(db: Session, profile: Profile) -> Profile | None:
    """For reports and the admin: the verified account this profile seems to copy."""
    if profile.is_verified:
        return None
    return lookalike_verified_username(db, profile.username, profile.id) or protected_display_name_owner(
        db, profile.display_name, profile.id
    )


# Same attempt, same owner: one alert a day is enough (someone retrying should not flood it).
ALERT_DEDUP_WINDOW = timedelta(days=1)
MAX_ALERTS_PER_DAY = 20


def alert_owner(
    db: Session,
    owner: Profile,
    kind: str,
    subject: str,
    *,
    report_id: uuid.UUID | None = None,
    report_reason: str | None = None,
) -> None:
    """Record an impersonation alert for a verified owner (deduplicated, capped per day).

    Adds to the session; the caller commits (also when it is about to reject the request).
    """
    since = datetime.now(timezone.utc) - ALERT_DEDUP_WINDOW
    recent = db.query(IdentityAlert).filter(
        IdentityAlert.profile_id == owner.id, IdentityAlert.created_at >= since
    )
    if recent.count() >= MAX_ALERTS_PER_DAY:
        return
    if (
        report_id is None
        and recent.filter(IdentityAlert.kind == kind, IdentityAlert.subject == subject[:120]).first()
    ):
        return
    db.add(
        IdentityAlert(
            profile_id=owner.id,
            kind=kind,
            subject=subject[:120],
            report_id=report_id,
            report_reason=report_reason,
        )
    )
