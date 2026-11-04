from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field, field_validator, model_validator

from app.services.embeds import prepare_link_url

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

ALLOWED_LINK_TYPES = {"url", "youtube", "spotify", "header", "contact"}
ALLOWED_COLLECTION_LAYOUTS = {"list", "grid"}


class LinkCreate(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    url: str | None = Field(default=None, max_length=2000)
    link_type: str = "url"
    collection: str | None = Field(default=None, max_length=80)
    collection_layout: str = "list"
    thumbnail_url: str | None = None
    icon: str | None = Field(default=None, max_length=32)
    animation: str = "none"
    is_active: bool = True
    is_featured: bool = False
    visible_from: datetime | None = None
    visible_until: datetime | None = None
    lock_code: str | None = Field(default=None, max_length=64)

    @field_validator("link_type")
    @classmethod
    def validate_link_type(cls, v: str) -> str:
        v = (v or "url").lower().strip()
        if v not in ALLOWED_LINK_TYPES:
            raise ValueError(f"Invalid link type. Allowed: {', '.join(sorted(ALLOWED_LINK_TYPES))}")
        return v

    @field_validator("collection_layout")
    @classmethod
    def validate_layout(cls, v: str) -> str:
        v = (v or "list").lower().strip()
        if v not in ALLOWED_COLLECTION_LAYOUTS:
            raise ValueError("collection_layout must be list or grid")
        return v

    @field_validator("collection")
    @classmethod
    def validate_collection(cls, v: str | None) -> str | None:
        if v is None:
            return None
        v = v.strip()
        return v or None

    @field_validator("animation")
    @classmethod
    def validate_animation(cls, v: str) -> str:
        v = (v or "none").lower()
        if v not in ALLOWED_ANIMATIONS:
            raise ValueError(f"Invalid animation. Allowed: {', '.join(sorted(ALLOWED_ANIMATIONS))}")
        return v

    @model_validator(mode="after")
    def normalize_url(self) -> "LinkCreate":
        self.url = prepare_link_url(self.link_type, self.url, self.title)
        if self.link_type == "header":
            self.is_featured = False
            self.lock_code = None
        return self


class LinkUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=120)
    url: str | None = Field(default=None, max_length=2000)
    link_type: str | None = None
    collection: str | None = None
    clear_collection: bool | None = None
    collection_layout: str | None = None
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

    @field_validator("link_type")
    @classmethod
    def validate_link_type(cls, v: str | None) -> str | None:
        if v is None:
            return v
        v = v.lower().strip()
        if v not in ALLOWED_LINK_TYPES:
            raise ValueError(f"Invalid link type. Allowed: {', '.join(sorted(ALLOWED_LINK_TYPES))}")
        return v

    @field_validator("collection_layout")
    @classmethod
    def validate_layout(cls, v: str | None) -> str | None:
        if v is None:
            return v
        v = v.lower().strip()
        if v not in ALLOWED_COLLECTION_LAYOUTS:
            raise ValueError("collection_layout must be list or grid")
        return v

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
    link_type: str
    collection: str | None
    collection_layout: str
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
    link_type: str = "url"
    collection: str | None = None
    collection_layout: str = "list"
    thumbnail_url: str | None
    icon: str | None
    animation: str
    is_featured: bool
    has_lock: bool
    embed: dict[str, str] | None = None
