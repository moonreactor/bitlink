"""verified badge audit trail, admin note and verification requests queue

Revision ID: 020
Revises: 019
Create Date: 2026-11-24

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "020"
down_revision: Union[str, None] = "019"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "profiles",
        sa.Column(
            "verified_by_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        ),
    )
    op.add_column("profiles", sa.Column("verification_note", sa.String(length=500), nullable=True))

    op.create_table(
        "verification_events",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "profile_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("profiles.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("action", sa.String(length=16), nullable=False),
        sa.Column("verification_type", sa.String(length=20), nullable=True),
        sa.Column(
            "actor_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("note", sa.String(length=500), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_verification_events_profile_id", "verification_events", ["profile_id"])
    op.create_index("ix_verification_events_created_at", "verification_events", ["created_at"])

    op.create_table(
        "verification_requests",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "profile_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("profiles.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("verification_type", sa.String(length=20), nullable=False),
        sa.Column("source", sa.String(length=8), server_default="user", nullable=False),
        sa.Column("reason", sa.Text(), nullable=True),
        sa.Column("evidence_urls", postgresql.JSONB(), server_default="[]", nullable=False),
        sa.Column("status", sa.String(length=16), server_default="pending", nullable=False),
        sa.Column("decision_note", sa.String(length=500), nullable=True),
        sa.Column(
            "reviewed_by_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("reviewed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_verification_requests_profile_id", "verification_requests", ["profile_id"])
    op.create_index("ix_verification_requests_status", "verification_requests", ["status"])
    op.create_index("ix_verification_requests_created_at", "verification_requests", ["created_at"])


def downgrade() -> None:
    op.drop_table("verification_requests")
    op.drop_table("verification_events")
    op.drop_column("profiles", "verification_note")
    op.drop_column("profiles", "verified_by_id")
