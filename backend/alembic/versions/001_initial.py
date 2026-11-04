"""initial schema

Revision ID: 001
Revises:
Create Date: 2026-11-03

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "profiles",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("username", sa.String(50), nullable=False),
        sa.Column("display_name", sa.String(100), nullable=False),
        sa.Column("bio", sa.Text(), nullable=True),
        sa.Column("avatar_url", sa.String(500), nullable=True),
        sa.Column("theme_json", postgresql.JSONB(), nullable=False, server_default=sa.text("'{}'::jsonb")),
        sa.Column("seo_title", sa.String(120), nullable=True),
        sa.Column("seo_description", sa.String(300), nullable=True),
        sa.Column("remove_branding", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("profile_password_hash", sa.String(255), nullable=True),
        sa.Column("redirect_link_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("show_email_capture", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.UniqueConstraint("user_id"),
    )
    op.create_index("ix_profiles_username", "profiles", ["username"], unique=True)

    op.create_table(
        "links",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("profile_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False),
        sa.Column("title", sa.String(120), nullable=False),
        sa.Column("url", sa.Text(), nullable=False),
        sa.Column("thumbnail_url", sa.String(500), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("is_featured", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("position", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("visible_from", sa.DateTime(timezone=True), nullable=True),
        sa.Column("visible_until", sa.DateTime(timezone=True), nullable=True),
        sa.Column("lock_code_hash", sa.String(255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_links_profile_id", "links", ["profile_id"])

    op.create_foreign_key(
        "fk_profiles_redirect_link_id",
        "profiles",
        "links",
        ["redirect_link_id"],
        ["id"],
        ondelete="SET NULL",
    )

    op.create_table(
        "social_links",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("profile_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False),
        sa.Column("platform", sa.String(50), nullable=False),
        sa.Column("url", sa.String(500), nullable=False),
        sa.Column("position", sa.Integer(), nullable=False, server_default="0"),
    )
    op.create_index("ix_social_links_profile_id", "social_links", ["profile_id"])

    op.create_table(
        "page_views",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("profile_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False),
        sa.Column("visitor_hash", sa.String(64), nullable=True),
        sa.Column("referrer", sa.Text(), nullable=True),
        sa.Column("user_agent", sa.Text(), nullable=True),
        sa.Column("country", sa.String(2), nullable=True),
        sa.Column("device", sa.String(50), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_page_views_profile_id", "page_views", ["profile_id"])
    op.create_index("ix_page_views_created_at", "page_views", ["created_at"])

    op.create_table(
        "link_clicks",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("link_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("links.id", ondelete="CASCADE"), nullable=False),
        sa.Column("profile_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False),
        sa.Column("visitor_hash", sa.String(64), nullable=True),
        sa.Column("referrer", sa.Text(), nullable=True),
        sa.Column("user_agent", sa.Text(), nullable=True),
        sa.Column("country", sa.String(2), nullable=True),
        sa.Column("device", sa.String(50), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_link_clicks_link_id", "link_clicks", ["link_id"])
    op.create_index("ix_link_clicks_profile_id", "link_clicks", ["profile_id"])
    op.create_index("ix_link_clicks_created_at", "link_clicks", ["created_at"])

    op.create_table(
        "subscribers",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("profile_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.UniqueConstraint("profile_id", "email", name="uq_subscriber_profile_email"),
    )
    op.create_index("ix_subscribers_profile_id", "subscribers", ["profile_id"])


def downgrade() -> None:
    op.drop_table("subscribers")
    op.drop_table("link_clicks")
    op.drop_table("page_views")
    op.drop_table("social_links")
    op.drop_constraint("fk_profiles_redirect_link_id", "profiles", type_="foreignkey")
    op.drop_table("links")
    op.drop_table("profiles")
    op.drop_table("users")
