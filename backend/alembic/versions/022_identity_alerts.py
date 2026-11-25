"""impersonation alerts for verified owners

Revision ID: 022
Revises: 021
Create Date: 2026-11-24

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "022"
down_revision: Union[str, None] = "021"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "identity_alerts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "profile_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("profiles.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("kind", sa.String(length=24), nullable=False),
        sa.Column("subject", sa.String(length=120), nullable=False),
        sa.Column(
            "report_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("reports.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("report_reason", sa.String(length=16), nullable=True),
        sa.Column("seen_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_identity_alerts_profile_id", "identity_alerts", ["profile_id"])
    op.create_index("ix_identity_alerts_created_at", "identity_alerts", ["created_at"])


def downgrade() -> None:
    op.drop_table("identity_alerts")
