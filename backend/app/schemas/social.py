from uuid import UUID

from pydantic import BaseModel, Field


class SocialLinkItem(BaseModel):
    platform: str = Field(min_length=1, max_length=50)
    url: str = Field(min_length=1, max_length=500)
    position: int = 0


class SocialLinksReplace(BaseModel):
    items: list[SocialLinkItem]


class SocialLinkOut(BaseModel):
    id: UUID
    platform: str
    url: str
    position: int

    model_config = {"from_attributes": True}
