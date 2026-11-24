from app.models.profile import DEFAULT_VERIFICATION_TYPE, Profile

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
