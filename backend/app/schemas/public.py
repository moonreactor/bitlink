from datetime import datetime
from typing import Any

from pydantic import BaseModel

from app.schemas.link import PublicLinkOut
from app.schemas.product import PublicProductOut
from app.schemas.section import PublicSectionOut
from app.schemas.social import SocialLinkOut


class PublicProfileOut(BaseModel):
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
    is_locked: bool
    redirect_url: str | None
    background_music_enabled: bool = False
    background_music_video_id: str | None = None
    links: list[PublicLinkOut]
    sections: list[PublicSectionOut] = []
    social_links: list[SocialLinkOut]
    products: list[PublicProductOut] = []
    language: str | None = None
    discoverable: bool = False
    created_at: datetime | None = None
    updated_at: datetime | None = None


class PublicDirectoryItem(BaseModel):
    username: str
    display_name: str
    bio: str | None = None
    avatar_url: str | None = None
    language: str | None = None
    is_verified: bool = False
    updated_at: datetime


class PublicDomainResolveOut(BaseModel):
    username: str
    custom_domain: str
