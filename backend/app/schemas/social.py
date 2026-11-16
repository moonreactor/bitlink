from uuid import UUID

from pydantic import BaseModel


class SocialLinkOut(BaseModel):
    """An icon-style link as shown in the public icon row (derived from links with display=icon)."""

    id: UUID
    platform: str
    url: str
    position: int
