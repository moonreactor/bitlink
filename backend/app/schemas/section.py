from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field, field_validator

from app.schemas.link import LinkOut

ALLOWED_SECTION_LAYOUTS = {"list", "grid"}
MAX_SECTIONS_PER_PROFILE = 50


def _validate_layout(v: str | None) -> str | None:
    if v is None:
        return v
    v = v.lower().strip()
    if v not in ALLOWED_SECTION_LAYOUTS:
        raise ValueError("layout must be list or grid")
    return v


class SectionCreate(BaseModel):
    title: str = Field(min_length=1, max_length=80)
    layout: str = "list"

    @field_validator("title")
    @classmethod
    def clean_title(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Section title cannot be empty")
        return v

    @field_validator("layout")
    @classmethod
    def validate_layout(cls, v: str) -> str:
        return _validate_layout(v) or "list"


class SectionUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=80)
    layout: str | None = None

    @field_validator("title")
    @classmethod
    def clean_title(cls, v: str | None) -> str | None:
        if v is None:
            return v
        v = v.strip()
        if not v:
            raise ValueError("Section title cannot be empty")
        return v

    @field_validator("layout")
    @classmethod
    def validate_layout(cls, v: str | None) -> str | None:
        return _validate_layout(v)


class SectionOut(BaseModel):
    id: UUID
    title: str
    layout: str
    position: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PublicSectionOut(BaseModel):
    id: UUID
    title: str
    layout: str


class LayoutBlock(BaseModel):
    type: Literal["link", "section"]
    id: UUID
    link_ids: list[UUID] = []


class LayoutRequest(BaseModel):
    blocks: list[LayoutBlock] = Field(max_length=1000)


class LayoutOut(BaseModel):
    sections: list[SectionOut]
    links: list[LinkOut]
