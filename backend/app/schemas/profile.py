import re
from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field, field_validator

from app.services.youtube import extract_youtube_video_id, normalize_youtube_url

USERNAME_RE = re.compile(r"^[a-z0-9_]{3,30}$")


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
    show_email_capture: bool
    background_music_url: str | None
    background_music_enabled: bool
    background_music_video_id: str | None = None
    has_profile_lock: bool
    redirect_link_id: UUID | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
