import uuid

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class SocialLink(Base):
    __tablename__ = "social_links"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    platform: Mapped[str] = mapped_column(String(50), nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    position: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    profile = relationship("Profile", back_populates="social_links")
