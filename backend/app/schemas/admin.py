from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class AdminReferralSource(BaseModel):
    username: str
    cta_clicks: int = 0
    signups: int = 0


class AdminMetrics(BaseModel):
    total_users: int
    active_users: int
    superusers: int
    total_profiles: int
    total_links: int
    active_links: int
    total_views: int
    total_clicks: int
    total_subscribers: int
    new_users_7d: int
    new_users_30d: int
    views_7d: int
    clicks_7d: int
    cta_clicks_total: int = 0
    cta_clicks_7d: int = 0
    referred_signups_total: int = 0
    referred_signups_7d: int = 0
    daily: list["AdminDailyStat"]
    top_profiles: list["AdminTopProfile"]
    top_referral_sources: list[AdminReferralSource] = []


class AdminDailyStat(BaseModel):
    date: str
    users: int
    views: int
    clicks: int


class AdminTopProfile(BaseModel):
    user_id: UUID
    username: str
    display_name: str
    views: int
    clicks: int
    links_count: int


class AdminUserListItem(BaseModel):
    id: UUID
    email: EmailStr
    is_active: bool
    is_superuser: bool
    created_at: datetime
    username: str | None = None
    display_name: str | None = None
    referred_by_username: str | None = None
    is_suspicious: bool = False
    links_count: int = 0
    views_count: int = 0
    clicks_count: int = 0
    subscribers_count: int = 0


class AdminUserListResponse(BaseModel):
    items: list[AdminUserListItem]
    total: int
    page: int
    page_size: int


class AdminLinkItem(BaseModel):
    id: UUID
    title: str
    url: str
    is_active: bool
    is_featured: bool
    position: int
    created_at: datetime
    clicks_count: int = 0
    username: str | None = None
    user_id: UUID | None = None
    profile_id: UUID


class AdminVerificationEvent(BaseModel):
    id: UUID
    action: str
    verification_type: str | None = None
    # None when a rule did it (automatic revocation).
    actor_email: str | None = None
    note: str | None = None
    created_at: datetime


class AdminVerificationSignals(BaseModel):
    """Facts that help decide whether a profile deserves the badge."""

    account_age_days: int
    has_avatar: bool
    has_bio: bool
    verified_domain: str | None = None
    social_profiles: list[str] = Field(default_factory=list)
    links_count: int = 0
    views_count: int = 0
    clicks_count: int = 0
    subscribers_count: int = 0
    reports_total: int = 0
    reports_pending: int = 0
    is_suspicious: bool = False
    previously_revoked: int = 0


class AdminVerificationRequestItem(BaseModel):
    id: UUID
    profile_id: UUID
    user_id: UUID
    username: str
    display_name: str
    avatar_url: str | None = None
    is_verified: bool = False
    verification_type: str
    source: str
    reason: str | None = None
    evidence_urls: list[str] = Field(default_factory=list)
    status: str
    decision_note: str | None = None
    reviewed_by_email: str | None = None
    reviewed_at: datetime | None = None
    created_at: datetime
    signals: AdminVerificationSignals


class AdminVerificationRequestList(BaseModel):
    items: list[AdminVerificationRequestItem]
    total: int
    page: int
    page_size: int
    pending: int = 0
    approved: int = 0
    rejected: int = 0


class AdminVerificationDecision(BaseModel):
    status: Literal["approved", "rejected"]
    # Approve as a different kind than the one requested.
    verification_type: Literal["creator", "public_figure", "brand", "organization"] | None = None
    # Shown to the owner when rejected; stored as the internal note when approved.
    note: str | None = Field(default=None, max_length=500)


class AdminUserDetail(BaseModel):
    id: UUID
    email: EmailStr
    is_active: bool
    is_superuser: bool
    created_at: datetime
    username: str | None = None
    display_name: str | None = None
    bio: str | None = None
    avatar_url: str | None = None
    is_verified: bool = False
    verification_type: str | None = None
    verified_at: datetime | None = None
    verified_by_email: str | None = None
    verification_note: str | None = None
    verification_history: list[AdminVerificationEvent] = Field(default_factory=list)
    pending_verification_request_id: UUID | None = None
    is_suspicious: bool = False
    suspicious_at: datetime | None = None
    suspicious_note: str | None = None
    referred_by_username: str | None = None
    profile_id: UUID | None = None
    links_count: int = 0
    views_count: int = 0
    clicks_count: int = 0
    subscribers_count: int = 0
    links: list[AdminLinkItem] = Field(default_factory=list)


class AdminUserUpdate(BaseModel):
    is_active: bool | None = None
    is_superuser: bool | None = None
    is_verified: bool | None = None
    # Kind of verified account; also accepted alone to change the kind of an already verified profile.
    verification_type: Literal["creator", "public_figure", "brand", "organization"] | None = None
    # Internal note for superadmins, saved with the verification.
    verification_note: str | None = Field(default=None, max_length=500)
    is_suspicious: bool | None = None
    # Shown to the owner in the warning banner; only used when flagging.
    suspicious_note: str | None = Field(default=None, max_length=500)


class AdminLinkListResponse(BaseModel):
    items: list[AdminLinkItem]
    total: int
    page: int
    page_size: int


class ShortenerFunnelStep(BaseModel):
    event: str
    events: int
    visitors: int


class ShortenerFunnel(BaseModel):
    days: int
    steps: list[ShortenerFunnelStep]
    by_source: dict[str, list[ShortenerFunnelStep]]
