from datetime import datetime
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
