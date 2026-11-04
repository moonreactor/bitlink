import re
from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field, field_validator

from app.services.youtube import extract_youtube_video_id, normalize_youtube_url

USERNAME_RE = re.compile(r"^[a-z0-9_]{3,30}$")
HEX_COLOR_RE = re.compile(r"^#[0-9A-Fa-f]{6}$")
GA_ID_RE = re.compile(r"^(G|UA)-[A-Z0-9-]+$", re.I)
META_PIXEL_RE = re.compile(r"^\d{5,20}$")


def _normalize_http_url(v: str | None, field: str) -> str | None:
    if v is None:
        return None
    v = v.strip()
    if not v:
        return None
    if not v.startswith(("http://", "https://")):
        v = f"https://{v}"
    return v


class ThemeSchema(BaseModel):
    preset: str = "midnight"
    background_color: str = "#0f172a"
    background_image: str | None = None
    button_color: str = "#ffffff"
    button_text_color: str = "#0f172a"
    button_style: str = "rounded"
    font_family: str = "Inter"
    text_color: str = "#f8fafc"
    social_icon_style: str = "mono"
    social_icon_color: str = "#f8fafc"


class ProfileUpdate(BaseModel):
    username: str | None = None
    display_name: str | None = Field(default=None, min_length=1, max_length=100)
    bio: str | None = Field(default=None, max_length=500)
    avatar_url: str | None = None
    theme_json: ThemeSchema | dict[str, Any] | None = None
    seo_title: str | None = Field(default=None, max_length=120)
    seo_description: str | None = Field(default=None, max_length=300)
    remove_branding: bool | None = None
    show_email_capture: bool | None = None
    show_phone_capture: bool | None = None
    tip_jar_enabled: bool | None = None
    tip_jar_url: str | None = Field(default=None, max_length=500)
    tip_jar_label: str | None = Field(default=None, max_length=80)
    clear_tip_jar_url: bool | None = None
    google_analytics_id: str | None = Field(default=None, max_length=32)
    meta_pixel_id: str | None = Field(default=None, max_length=32)
    clear_google_analytics_id: bool | None = None
    clear_meta_pixel_id: bool | None = None
    qr_fg_color: str | None = None
    qr_bg_color: str | None = None
    qr_logo_enabled: bool | None = None
    background_music_url: str | None = Field(default=None, max_length=500)
    background_music_enabled: bool | None = None
    clear_background_music: bool | None = None
    profile_password: str | None = None
    clear_profile_password: bool | None = None
    redirect_link_id: UUID | None = None
    clear_redirect: bool | None = None

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str | None) -> str | None:
        if v is None:
            return v
        v = v.lower().strip()
        if not USERNAME_RE.match(v):
            raise ValueError("Username must be 3-30 chars: lowercase letters, numbers, underscore")
        return v

    @field_validator("background_music_url")
    @classmethod
    def validate_music_url(cls, v: str | None) -> str | None:
        if v is None:
            return v
        v = v.strip()
        if not v:
            return None
        if not extract_youtube_video_id(v):
            raise ValueError("Must be a valid YouTube URL or video id")
        return normalize_youtube_url(v)

    @field_validator("google_analytics_id")
    @classmethod
    def validate_ga(cls, v: str | None) -> str | None:
        if v is None:
            return v
        v = v.strip()
        if not v:
            return None
        if not GA_ID_RE.match(v):
            raise ValueError("Google Analytics id must look like G-XXXXXXXX or UA-XXXXX-Y")
        return v.upper() if v.upper().startswith("G-") else v

    @field_validator("meta_pixel_id")
    @classmethod
    def validate_pixel(cls, v: str | None) -> str | None:
        if v is None:
            return v
        v = v.strip()
        if not v:
            return None
        if not META_PIXEL_RE.match(v):
            raise ValueError("Meta Pixel id must be numeric")
        return v

    @field_validator("qr_fg_color", "qr_bg_color")
    @classmethod
    def validate_hex(cls, v: str | None) -> str | None:
        if v is None:
            return v
        v = v.strip()
        if not HEX_COLOR_RE.match(v):
            raise ValueError("Color must be hex like #000000")
        return v.lower()

    @field_validator("tip_jar_url")
    @classmethod
    def validate_tip_url(cls, v: str | None) -> str | None:
        return _normalize_http_url(v, "tip_jar_url")

    @field_validator("tip_jar_label")
    @classmethod
    def validate_tip_label(cls, v: str | None) -> str | None:
        if v is None:
            return v
        v = v.strip()
        return v or "Tip me"


class ProfileOut(BaseModel):
    id: UUID
    username: str
    display_name: str
    bio: str | None
    avatar_url: str | None
    theme_json: dict[str, Any]
    seo_title: str | None
    seo_description: str | None
    remove_branding: bool
    is_verified: bool = False
    show_email_capture: bool
    show_phone_capture: bool = False
    tip_jar_enabled: bool = False
    tip_jar_url: str | None = None
    tip_jar_label: str = "Tip me"
    google_analytics_id: str | None = None
    meta_pixel_id: str | None = None
    qr_fg_color: str = "#000000"
    qr_bg_color: str = "#ffffff"
    qr_logo_enabled: bool = False
    background_music_url: str | None
    background_music_enabled: bool
    background_music_video_id: str | None = None
    has_profile_lock: bool
    redirect_link_id: UUID | None
    custom_domain: str | None = None
    custom_domain_verified: bool = False
    custom_domain_verify_token: str | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
