"""add short links and short link clicks

Revision ID: 008
Revises: 007
Create Date: 2026-11-04

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "008"
down_revision: Union[str, None] = "007"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "short_links",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("code", sa.String(length=40), nullable=False),
        sa.Column("title", sa.String(length=120), nullable=True),
        sa.Column("destination_url", sa.Text(), nullable=False),
        sa.Column("utm_source", sa.String(length=120), nullable=True),
        sa.Column("utm_medium", sa.String(length=120), nullable=True),
        sa.Column("utm_campaign", sa.String(length=120), nullable=True),
        sa.Column("utm_term", sa.String(length=120), nullable=True),
        sa.Column("utm_content", sa.String(length=120), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("code"),
    )
    op.create_index("ix_short_links_user_id", "short_links", ["user_id"])
    op.create_index("ix_short_links_code", "short_links", ["code"])

    op.create_table(
        "short_link_clicks",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("short_link_id", sa.UUID(), nullable=False),
        sa.Column("visitor_hash", sa.String(length=64), nullable=True),
        sa.Column("referrer", sa.Text(), nullable=True),
        sa.Column("user_agent", sa.Text(), nullable=True),
        sa.Column("country", sa.String(length=2), nullable=True),
        sa.Column("device", sa.String(length=50), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["short_link_id"], ["short_links.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_short_link_clicks_short_link_id", "short_link_clicks", ["short_link_id"])
    op.create_index("ix_short_link_clicks_created_at", "short_link_clicks", ["created_at"])


def downgrade() -> None:
    op.drop_index("ix_short_link_clicks_created_at", table_name="short_link_clicks")
    op.drop_index("ix_short_link_clicks_short_link_id", table_name="short_link_clicks")
    op.drop_table("short_link_clicks")
    op.drop_index("ix_short_links_code", table_name="short_links")
    op.drop_index("ix_short_links_user_id", table_name="short_links")
    op.drop_table("short_links")
