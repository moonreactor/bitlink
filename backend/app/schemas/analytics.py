from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class TrackMeta(BaseModel):
    referrer: str | None = None
    visitor_id: str | None = None


class ClickRequest(BaseModel):
    referrer: str | None = None
    visitor_id: str | None = None
    unlock_code: str | None = None


class ClickResponse(BaseModel):
    url: str
    unlocked: bool = True


class SubscribeRequest(BaseModel):
    email: EmailStr | None = None
    phone: str | None = None


class UnlockProfileRequest(BaseModel):
    password: str


class LinkStat(BaseModel):
    link_id: UUID
    title: str
    clicks: int


class DeviceStat(BaseModel):
    device: str
    count: int


class ReferrerStat(BaseModel):
    referrer: str
    count: int


class CountryStat(BaseModel):
    country: str
    count: int


class DailyStat(BaseModel):
    date: str
    views: int
    clicks: int


class AnalyticsSummary(BaseModel):
    total_views: int
    total_clicks: int
    links: list[LinkStat]
    devices: list[DeviceStat]
    referrers: list[ReferrerStat]
    countries: list[CountryStat]
    daily: list[DailyStat]
    from_date: datetime | None = None
    to_date: datetime | None = None


class SubscriberOut(BaseModel):
    id: UUID
    email: EmailStr | None = None
    phone: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
