import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

DEFAULT_THEME: dict[str, Any] = {
    "preset": "midnight",
    "background_color": "#0f172a",
    "background_image": None,
    "button_color": "#ffffff",
    "button_text_color": "#0f172a",
    "button_style": "rounded",
    "font_family": "Inter",
    "text_color": "#f8fafc",
}


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    display_name: Mapped[str] = mapped_column(String(100), nullable=False)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    theme_json: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    seo_title: Mapped[str | None] = mapped_column(String(120), nullable=True)
    seo_description: Mapped[str | None] = mapped_column(String(300), nullable=True)
    remove_branding: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    profile_password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    redirect_link_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("links.id", ondelete="SET NULL", use_alter=True), nullable=True
    )
    show_email_capture: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    background_music_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    background_music_enabled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    user = relationship("User", back_populates="profile")
    links = relationship(
        "Link",
        back_populates="profile",
        cascade="all, delete-orphan",
        foreign_keys="Link.profile_id",
        order_by="Link.position",
    )
    social_links = relationship(
        "SocialLink",
        back_populates="profile",
        cascade="all, delete-orphan",
        order_by="SocialLink.position",
    )
    subscribers = relationship("Subscriber", back_populates="profile", cascade="all, delete-orphan")
