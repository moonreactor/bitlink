from fastapi import APIRouter, Depends, HTTPException, Query, Response
from fastapi.responses import Response as FastAPIResponse
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.core.security import hash_password
from app.db.session import get_db
from app.models.profile import Profile
from app.models.user import User
from app.schemas.profile import ProfileOut, ProfileUpdate
from app.services.qr import generate_profile_qr
from app.services.youtube import extract_youtube_video_id

router = APIRouter(prefix="/me", tags=["profile"])


def _profile_out(profile: Profile) -> ProfileOut:
    return ProfileOut(
        id=profile.id,
        username=profile.username,
        display_name=profile.display_name,
        bio=profile.bio,
        avatar_url=profile.avatar_url,
        theme_json=profile.theme_json or {},
        seo_title=profile.seo_title,
        seo_description=profile.seo_description,
        remove_branding=profile.remove_branding,
        is_verified=bool(getattr(profile, "is_verified", False)),
        show_email_capture=profile.show_email_capture,
        show_phone_capture=bool(getattr(profile, "show_phone_capture", False)),
        tip_jar_enabled=bool(getattr(profile, "tip_jar_enabled", False)),
        tip_jar_url=getattr(profile, "tip_jar_url", None),
        tip_jar_label=getattr(profile, "tip_jar_label", None) or "Tip me",
        google_analytics_id=getattr(profile, "google_analytics_id", None),
        meta_pixel_id=getattr(profile, "meta_pixel_id", None),
        qr_fg_color=getattr(profile, "qr_fg_color", None) or "#000000",
        qr_bg_color=getattr(profile, "qr_bg_color", None) or "#ffffff",
        qr_logo_enabled=bool(getattr(profile, "qr_logo_enabled", False)),
        background_music_url=profile.background_music_url,
        background_music_enabled=profile.background_music_enabled,
        background_music_video_id=extract_youtube_video_id(profile.background_music_url),
        has_profile_lock=bool(profile.profile_password_hash),
        redirect_link_id=profile.redirect_link_id,
        custom_domain=getattr(profile, "custom_domain", None),
        custom_domain_verified=bool(getattr(profile, "custom_domain_verified", False)),
        custom_domain_verify_token=getattr(profile, "custom_domain_verify_token", None),
        created_at=profile.created_at,
        updated_at=profile.updated_at,
    )


def get_user_profile(db: Session, user: User) -> Profile:
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.get("/profile", response_model=ProfileOut)
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProfileOut:
    return _profile_out(get_user_profile(db, current_user))


@router.patch("/profile", response_model=ProfileOut)
def update_profile(
    payload: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProfileOut:
    profile = get_user_profile(db, current_user)
    data = payload.model_dump(exclude_unset=True)

    if "username" in data and data["username"] != profile.username:
        exists = (
            db.query(Profile)
            .filter(Profile.username == data["username"], Profile.id != profile.id)
            .first()
        )
        if exists:
            raise HTTPException(status_code=400, detail="Username already taken")
        profile.username = data["username"]

    for field in (
        "display_name",
        "bio",
        "avatar_url",
        "seo_title",
        "seo_description",
        "remove_branding",
        "show_email_capture",
        "show_phone_capture",
        "tip_jar_enabled",
        "tip_jar_url",
        "tip_jar_label",
        "google_analytics_id",
        "meta_pixel_id",
        "qr_fg_color",
        "qr_bg_color",
        "qr_logo_enabled",
        "background_music_url",
        "background_music_enabled",
    ):
        if field in data:
            setattr(profile, field, data[field])

    if data.get("clear_google_analytics_id"):
        profile.google_analytics_id = None
    if data.get("clear_meta_pixel_id"):
        profile.meta_pixel_id = None
    if data.get("clear_tip_jar_url"):
        profile.tip_jar_url = None
        profile.tip_jar_enabled = False

    if data.get("clear_background_music"):
        profile.background_music_url = None
        profile.background_music_enabled = False

    if "theme_json" in data and data["theme_json"] is not None:
        theme = data["theme_json"]
        if hasattr(theme, "model_dump"):
            theme = theme.model_dump()
        profile.theme_json = theme

    if data.get("clear_profile_password"):
        profile.profile_password_hash = None
    elif data.get("profile_password"):
        profile.profile_password_hash = hash_password(data["profile_password"])

    if data.get("clear_redirect"):
        profile.redirect_link_id = None
    elif "redirect_link_id" in data:
        profile.redirect_link_id = data["redirect_link_id"]

    db.commit()
    db.refresh(profile)
    return _profile_out(profile)


@router.get("/qr")
def get_qr(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    fmt: str = Query(default="png", pattern="^(png|svg)$"),
    fg: str | None = Query(default=None),
    bg: str | None = Query(default=None),
) -> FastAPIResponse:
    profile = get_user_profile(db, current_user)
    fill = fg or profile.qr_fg_color or "#000000"
    back = bg or profile.qr_bg_color or "#ffffff"
    logo = profile.avatar_url if profile.qr_logo_enabled else None
    content = generate_profile_qr(
        profile.username,
        fill_color=fill,
        back_color=back,
        logo_url=logo,
        fmt=fmt,
    )
    media = "image/svg+xml" if fmt == "svg" else "image/png"
    return Response(content=content, media_type=media)
