from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field, field_validator

from app.services.short_links import (
    normalize_destination,
    normalize_geo_rules,
    normalize_optional_url,
    validate_code_format,
)


class ShortLinkCreate(BaseModel):
    destination_url: str = Field(min_length=1, max_length=2000)
    code: str | None = Field(default=None, max_length=40)
    title: str | None = Field(default=None, max_length=120)
    utm_source: str | None = Field(default=None, max_length=120)
    utm_medium: str | None = Field(default=None, max_length=120)
    utm_campaign: str | None = Field(default=None, max_length=120)
    utm_term: str | None = Field(default=None, max_length=120)
    utm_content: str | None = Field(default=None, max_length=120)
    rule_mobile_url: str | None = Field(default=None, max_length=2000)
    rule_desktop_url: str | None = Field(default=None, max_length=2000)
    geo_rules: dict[str, str] | None = None
    is_active: bool = True

    @field_validator("destination_url")
    @classmethod
    def validate_destination(cls, v: str) -> str:
        return normalize_destination(v)

    @field_validator("rule_mobile_url", "rule_desktop_url")
    @classmethod
    def validate_rule_urls(cls, v: str | None) -> str | None:
        return normalize_optional_url(v)

    @field_validator("geo_rules")
    @classmethod
    def validate_geo(cls, v: dict[str, Any] | None) -> dict[str, str] | None:
        return normalize_geo_rules(v)

    @field_validator("code")
    @classmethod
    def validate_code(cls, v: str | None) -> str | None:
        if v is None or not v.strip():
            return None
        return validate_code_format(v)

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str | None) -> str | None:
        if v is None:
            return None
        v = v.strip()
        return v or None


class ShortLinkUpdate(BaseModel):
    destination_url: str | None = Field(default=None, max_length=2000)
    code: str | None = Field(default=None, max_length=40)
    title: str | None = Field(default=None, max_length=120)
    clear_title: bool | None = None
    utm_source: str | None = Field(default=None, max_length=120)
    utm_medium: str | None = Field(default=None, max_length=120)
    utm_campaign: str | None = Field(default=None, max_length=120)
    utm_term: str | None = Field(default=None, max_length=120)
    utm_content: str | None = Field(default=None, max_length=120)
    clear_utm: bool | None = None
    rule_mobile_url: str | None = Field(default=None, max_length=2000)
    rule_desktop_url: str | None = Field(default=None, max_length=2000)
    clear_rule_mobile_url: bool | None = None
    clear_rule_desktop_url: bool | None = None
    geo_rules: dict[str, str] | None = None
    clear_geo_rules: bool | None = None
    is_active: bool | None = None

    @field_validator("destination_url")
    @classmethod
    def validate_destination(cls, v: str | None) -> str | None:
        if v is None:
            return v
        return normalize_destination(v)

    @field_validator("rule_mobile_url", "rule_desktop_url")
    @classmethod
    def validate_rule_urls(cls, v: str | None) -> str | None:
        return normalize_optional_url(v)

    @field_validator("geo_rules")
    @classmethod
    def validate_geo(cls, v: dict[str, Any] | None) -> dict[str, str] | None:
        return normalize_geo_rules(v)

    @field_validator("code")
    @classmethod
    def validate_code(cls, v: str | None) -> str | None:
        if v is None:
            return v
        return validate_code_format(v)


class ShortLinkOut(BaseModel):
    id: UUID
    code: str
    title: str | None
    destination_url: str
    final_url: str
    short_url: str
    utm_source: str | None
    utm_medium: str | None
    utm_campaign: str | None
    utm_term: str | None
    utm_content: str | None
    rule_mobile_url: str | None = None
    rule_desktop_url: str | None = None
    geo_rules: dict[str, str] | None = None
    is_active: bool
    clicks: int = 0
    created_at: datetime
    updated_at: datetime


class ShortLinkVisitOut(BaseModel):
    code: str
    url: str
    title: str | None = None


class ShortLinkCheckOut(BaseModel):
    code: str
    available: bool


class PublicShortLinkCreate(BaseModel):
    """Anonymous creation: destination only (no custom code, UTMs or rules)."""

    destination_url: str = Field(min_length=1, max_length=2000)
    source: str | None = Field(default=None, max_length=16)

    @field_validator("destination_url")
    @classmethod
    def validate_destination(cls, v: str) -> str:
        return normalize_destination(v)


class ShortenerEventIn(BaseModel):
    event: str = Field(max_length=32)
    source: str | None = Field(default=None, max_length=16)


class PublicShortLinkOut(BaseModel):
    code: str
    short_url: str
    destination_url: str
    # Shown once; the client keeps it to claim the link after signing up.
    claim_token: str


class ShortLinkClaimRequest(BaseModel):
    tokens: list[str] = Field(min_length=1, max_length=50)


class ShortLinkClaimOut(BaseModel):
    claimed: int
