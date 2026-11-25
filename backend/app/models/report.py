import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base

TARGET_TYPES = ("profile", "link", "short_link")
REASONS = ("phishing", "malware", "scam", "spam", "adult", "illegal", "impersonation", "other")
# pending = nobody looked at it yet; resolved = reviewed and acted on; dismissed = reviewed, no action.
STATUSES = ("pending", "resolved", "dismissed")


class Report(Base):
    """Abuse report filed by a visitor against a profile, one of its links or a short link."""

    __tablename__ = "reports"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    target_type: Mapped[str] = mapped_column(String(16), nullable=False)
    # Targets may be deleted later; the snapshot columns keep the report readable.
    profile_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="SET NULL"), nullable=True, index=True
    )
    link_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("links.id", ondelete="SET NULL"), nullable=True, index=True
    )
    short_link_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("short_links.id", ondelete="SET NULL"), nullable=True, index=True
    )
    target_label: Mapped[str] = mapped_column(String(160), nullable=False)
    target_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    reason: Mapped[str] = mapped_column(String(16), nullable=False)
    details: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    # sha256 of the reporter IP: only used for rate limiting and de-duplication.
    reporter_hash: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    status: Mapped[str] = mapped_column(String(16), default="pending", nullable=False, index=True)
    resolution_note: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    resolved_by_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False, index=True
    )
