import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base

# sent = accepted by Resend; failed = temporary problem (retried next run for lifecycle emails);
# rejected = Resend refused the address itself (never retried); skipped = no RESEND_API_KEY, only logged.
EMAIL_STATUSES = ("sent", "failed", "rejected", "skipped")
# What happened after Resend accepted it (from its webhook); later states don't go backwards.
DELIVERY_STATUSES = ("delivered", "delayed", "opened", "clicked", "bounced", "complained", "failed")


class EmailLog(Base):
    """One row per email we tried to send; also what lifecycle emails use to pace themselves."""

    __tablename__ = "email_logs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    kind: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    language: Mapped[str] = mapped_column(String(2), nullable=False, default="en")
    status: Mapped[str] = mapped_column(String(12), nullable=False)
    provider_id: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    error: Mapped[str | None] = mapped_column(String(300), nullable=True)
    subject: Mapped[str | None] = mapped_column(String(200), nullable=True)
    delivery_status: Mapped[str | None] = mapped_column(String(16), nullable=True, index=True)
    delivered_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    opened_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    clicked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    bounced_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=func.now(),
        nullable=False,
        index=True,
    )
