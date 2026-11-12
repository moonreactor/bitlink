import uuid
from datetime import datetime

from sqlalchemy import DateTime, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base

# Funnel steps of the public shortener, in display order.
FUNNEL_EVENTS = (
    "view",  # widget scrolled into view (client)
    "submit",  # clicked Shorten with a URL (client)
    "choose_account",  # picked "create account & track" with a valid email (client)
    "choose_anonymous",  # picked "keep it anonymous" (client)
    "link_created",  # an anonymous short link was created (server)
    "copy",  # copied the short link (client)
    "claimed",  # signed up / logged in and claimed anonymous links (server)
)
CLIENT_EVENTS = {"view", "submit", "choose_account", "choose_anonymous", "copy"}
SOURCES = {"landing", "en", "es"}


class ShortenerEvent(Base):
    """Funnel event for the public URL shortener (no personal data)."""

    __tablename__ = "shortener_events"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    source: Mapped[str | None] = mapped_column(String(16), nullable=True, index=True)
    visitor_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False, index=True
    )
