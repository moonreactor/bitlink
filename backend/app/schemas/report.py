from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field, model_validator

ReasonLiteral = Literal["phishing", "malware", "scam", "spam", "adult", "illegal", "other"]
StatusLiteral = Literal["pending", "resolved", "dismissed"]


class ReportCreate(BaseModel):
    reason: ReasonLiteral
    details: str | None = Field(default=None, max_length=1000)
    # Exactly one target: a profile (optionally one of its links) or a short link code.
    username: str | None = Field(default=None, max_length=60)
    link_id: UUID | None = None
    short_code: str | None = Field(default=None, max_length=200)

    @model_validator(mode="after")
    def _one_target(self) -> "ReportCreate":
        if bool(self.username) == bool(self.short_code):
            raise ValueError("Provide either username or short_code")
        if self.link_id and not self.username:
            raise ValueError("link_id requires username")
        return self


class AdminReportItem(BaseModel):
    id: UUID
    target_type: str
    target_label: str
    target_url: str | None = None
    username: str | None = None
    owner_user_id: UUID | None = None
    link_id: UUID | None = None
    short_link_id: UUID | None = None
    # Whether the reported link / short link still exists and is live.
    target_active: bool | None = None
    reason: str
    details: str | None = None
    status: str
    resolution_note: str | None = None
    resolved_at: datetime | None = None
    resolved_by_email: str | None = None
    created_at: datetime
    # Other reports against the same target (including this one).
    reports_for_target: int = 1


class AdminReportListResponse(BaseModel):
    items: list[AdminReportItem]
    total: int
    page: int
    page_size: int
    pending: int = 0
    resolved: int = 0
    dismissed: int = 0


class AdminReportUpdate(BaseModel):
    status: StatusLiteral
    resolution_note: str | None = Field(default=None, max_length=1000)
    # Also switch the reported link / short link off.
    disable_target: bool = False
