from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field, field_validator

ALLOWED_ANIMATIONS = {
    "none",
    "float",
    "pulse",
    "wiggle",
    "bounce",
    "glow",
    "jelly",
    "rainbow",
    "sparkle",
}


class LinkCreate(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    url: str = Field(min_length=1, max_length=2000)
    thumbnail_url: str | None = None
    icon: str | None = Field(default=None, max_length=32)
    animation: str = "none"
    is_active: bool = True
    is_featured: bool = False
    visible_from: datetime | None = None
    visible_until: datetime | None = None
    lock_code: str | None = Field(default=None, max_length=64)

    @field_validator("animation")
    @classmethod
    def validate_animation(cls, v: str) -> str:
        v = (v or "none").lower()
        if v not in ALLOWED_ANIMATIONS:
            raise ValueError(f"Invalid animation. Allowed: {', '.join(sorted(ALLOWED_ANIMATIONS))}")
        return v


class LinkUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=120)
    url: str | None = Field(default=None, min_length=1, max_length=2000)
    thumbnail_url: str | None = None
    icon: str | None = Field(default=None, max_length=32)
    clear_icon: bool | None = None
    animation: str | None = None
    is_active: bool | None = None
    is_featured: bool | None = None
    visible_from: datetime | None = None
    visible_until: datetime | None = None
    lock_code: str | None = None
    clear_lock_code: bool | None = None
    clear_schedule: bool | None = None
    clear_thumbnail: bool | None = None

    @field_validator("animation")
    @classmethod
    def validate_animation(cls, v: str | None) -> str | None:
        if v is None:
            return v
        v = v.lower()
        if v not in ALLOWED_ANIMATIONS:
            raise ValueError(f"Invalid animation. Allowed: {', '.join(sorted(ALLOWED_ANIMATIONS))}")
        return v


class LinkReorderItem(BaseModel):
    id: UUID
    position: int


class LinkReorderRequest(BaseModel):
    items: list[LinkReorderItem]


class LinkOut(BaseModel):
    id: UUID
    title: str
    url: str
    thumbnail_url: str | None
    icon: str | None
    animation: str
    is_active: bool
    is_featured: bool
    position: int
    visible_from: datetime | None
    visible_until: datetime | None
    has_lock: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PublicLinkOut(BaseModel):
    id: UUID
    title: str
    url: str | None
    thumbnail_url: str | None
    icon: str | None
    animation: str
    is_featured: bool
    has_lock: bool
