import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

# Kind of verified account; drives the badge color and the schema.org type (Person vs Organization).
VERIFICATION_TYPES = ("creator", "public_figure", "brand", "organization")
DEFAULT_VERIFICATION_TYPE = "creator"

DEFAULT_THEME: dict[str, Any] = {
    "preset": "midnight",
    "background_color": "#0f172a",
    "background_image": None,
    "button_color": "#ffffff",
    "button_text_color": "#0f172a",
    "button_style": "rounded",
    "font_family": "Inter",
    "text_color": "#f8fafc",
    "social_icon_style": "mono",
    "social_icon_color": "#f8fafc",
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
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    # Set together with is_verified by a superadmin; cleared when the badge is removed.
    verification_type: Mapped[str | None] = mapped_column(String(20), nullable=True)
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    verified_by_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    # Internal note for superadmins (why it was verified); never shown publicly.
    verification_note: Mapped[str | None] = mapped_column(String(500), nullable=True)
    tip_jar_enabled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    tip_jar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    tip_jar_label: Mapped[str] = mapped_column(String(80), default="Tip me", nullable=False)
    show_email_capture: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    show_phone_capture: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    google_analytics_id: Mapped[str | None] = mapped_column(String(32), nullable=True)
    meta_pixel_id: Mapped[str | None] = mapped_column(String(32), nullable=True)
    qr_fg_color: Mapped[str] = mapped_column(String(7), default="#000000", nullable=False)
    qr_bg_color: Mapped[str] = mapped_column(String(7), default="#ffffff", nullable=False)
    qr_logo_enabled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    custom_domain: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    custom_domain_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    custom_domain_verify_token: Mapped[str | None] = mapped_column(String(64), nullable=True)
    background_music_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    background_music_enabled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    language: Mapped[str | None] = mapped_column(String(2), nullable=True)
    discoverable: Mapped[bool] = mapped_column(
        Boolean, default=False, server_default="false", nullable=False, index=True
    )
    # Set by a superadmin; the owner sees a policy warning banner in the dashboard.
    is_suspicious: Mapped[bool] = mapped_column(
        Boolean, default=False, server_default="false", nullable=False, index=True
    )
    suspicious_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    suspicious_note: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    user = relationship("User", back_populates="profile", foreign_keys=[user_id])
    links = relationship(
        "Link",
        back_populates="profile",
        cascade="all, delete-orphan",
        foreign_keys="Link.profile_id",
        order_by="Link.position",
    )
    sections = relationship(
        "LinkSection",
        back_populates="profile",
        cascade="all, delete-orphan",
        order_by="LinkSection.position",
    )
    subscribers = relationship("Subscriber", back_populates="profile", cascade="all, delete-orphan")
    products = relationship(
        "Product",
        back_populates="profile",
        cascade="all, delete-orphan",
        order_by="Product.position",
    )
