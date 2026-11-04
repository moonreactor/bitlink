from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


def _normalize_url(v: str) -> str:
    raw = v.strip()
    if not raw:
        raise ValueError("URL is required.")
    if not raw.startswith(("http://", "https://")):
        raw = f"https://{raw}"
    return raw


class ProductCreate(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    description: str | None = Field(default=None, max_length=500)
    price_label: str | None = Field(default=None, max_length=40)
    checkout_url: str = Field(min_length=1, max_length=2000)
    thumbnail_url: str | None = Field(default=None, max_length=500)
    is_active: bool = True

    @field_validator("checkout_url")
    @classmethod
    def validate_checkout(cls, v: str) -> str:
        return _normalize_url(v)

    @field_validator("thumbnail_url")
    @classmethod
    def validate_thumb(cls, v: str | None) -> str | None:
        if v is None or not v.strip():
            return None
        return _normalize_url(v)

    @field_validator("title", "description", "price_label")
    @classmethod
    def strip_text(cls, v: str | None) -> str | None:
        if v is None:
            return None
        v = v.strip()
        return v or None


class ProductUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=120)
    description: str | None = Field(default=None, max_length=500)
    clear_description: bool | None = None
    price_label: str | None = Field(default=None, max_length=40)
    clear_price_label: bool | None = None
    checkout_url: str | None = Field(default=None, max_length=2000)
    thumbnail_url: str | None = Field(default=None, max_length=500)
    clear_thumbnail: bool | None = None
    is_active: bool | None = None

    @field_validator("checkout_url")
    @classmethod
    def validate_checkout(cls, v: str | None) -> str | None:
        if v is None:
            return v
        return _normalize_url(v)

    @field_validator("thumbnail_url")
    @classmethod
    def validate_thumb(cls, v: str | None) -> str | None:
        if v is None or not str(v).strip():
            return None
        return _normalize_url(v)


class ProductReorderItem(BaseModel):
    id: UUID
    position: int


class ProductReorderRequest(BaseModel):
    items: list[ProductReorderItem]


class ProductOut(BaseModel):
    id: UUID
    title: str
    description: str | None
    price_label: str | None
    checkout_url: str
    thumbnail_url: str | None
    position: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PublicProductOut(BaseModel):
    id: UUID
    title: str
    description: str | None
    price_label: str | None
    checkout_url: str
    thumbnail_url: str | None
