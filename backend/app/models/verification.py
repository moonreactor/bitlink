import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base

# verified = badge granted; type_changed = kind of account changed while verified;
# revoked = removed by a superadmin; auto_revoked = removed by a rule (flagged, renamed…).
EVENT_ACTIONS = ("verified", "type_changed", "revoked", "auto_revoked")

# user = asked for by the owner; auto = opened by the system after an automatic revocation.
REQUEST_SOURCES = ("user", "auto")
REQUEST_STATUSES = ("pending", "approved", "rejected")


class VerificationEvent(Base):
    """Audit trail of a profile's verified badge: who granted, changed or removed it, and why."""

    __tablename__ = "verification_events"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    action: Mapped[str] = mapped_column(String(16), nullable=False)
    verification_type: Mapped[str | None] = mapped_column(String(20), nullable=True)
    # NULL when the system did it (automatic revocation).
    actor_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    note: Mapped[str | None] = mapped_column(String(500), nullable=True)
    # Set in Python (microseconds): several events can happen in one transaction and must keep order.
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=func.now(),
        nullable=False,
        index=True,
    )


class VerificationRequest(Base):
    """A profile waiting for a superadmin to grant (or deny) the verified badge."""

    __tablename__ = "verification_requests"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    verification_type: Mapped[str] = mapped_column(String(20), nullable=False)
    source: Mapped[str] = mapped_column(String(8), default="user", nullable=False)
    reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    evidence_urls: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    # What the automatic proof check found (see services/verification_proof.py); None until it ran.
    proof_results: Mapped[list | None] = mapped_column(JSONB, nullable=True)
    status: Mapped[str] = mapped_column(String(16), default="pending", nullable=False, index=True)
    # Shown to the owner when the request is rejected.
    decision_note: Mapped[str | None] = mapped_column(String(500), nullable=True)
    reviewed_by_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False, index=True
    )
