"""abuse reports

Revision ID: 015
Revises: 014
Create Date: 2026-11-16

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "015"
down_revision: Union[str, None] = "014"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "reports",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("target_type", sa.String(16), nullable=False),
        sa.Column(
            "profile_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("profiles.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "link_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("links.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "short_link_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("short_links.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("target_label", sa.String(160), nullable=False),
        sa.Column("target_url", sa.Text(), nullable=True),
        sa.Column("reason", sa.String(16), nullable=False),
        sa.Column("details", sa.String(1000), nullable=True),
        sa.Column("reporter_hash", sa.String(64), nullable=True),
        sa.Column("status", sa.String(16), nullable=False, server_default="pending"),
        sa.Column("resolution_note", sa.String(1000), nullable=True),
        sa.Column("resolved_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "resolved_by_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
    )
    for col in ("profile_id", "link_id", "short_link_id", "reporter_hash", "status", "created_at"):
        op.create_index(f"ix_reports_{col}", "reports", [col])


def downgrade() -> None:
    op.drop_table("reports")
