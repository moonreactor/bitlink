"""referral attribution and create-CTA click tracking

Revision ID: 011
Revises: 010
Create Date: 2026-11-04

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "011"
down_revision: Union[str, None] = "010"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("referred_by_username", sa.String(length=30), nullable=True),
    )
    op.create_index("ix_users_referred_by_username", "users", ["referred_by_username"])

    op.create_table(
        "growth_cta_clicks",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("source_username", sa.String(length=30), nullable=False),
        sa.Column("source_profile_id", sa.UUID(), nullable=True),
        sa.Column("visitor_hash", sa.String(length=64), nullable=True),
        sa.Column("referrer", sa.String(length=500), nullable=True),
        sa.Column("user_agent", sa.String(length=500), nullable=True),
        sa.Column("country", sa.String(length=2), nullable=True),
        sa.Column("device", sa.String(length=32), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["source_profile_id"], ["profiles.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_growth_cta_clicks_source_username", "growth_cta_clicks", ["source_username"])
    op.create_index("ix_growth_cta_clicks_created_at", "growth_cta_clicks", ["created_at"])


def downgrade() -> None:
    op.drop_index("ix_growth_cta_clicks_created_at", table_name="growth_cta_clicks")
    op.drop_index("ix_growth_cta_clicks_source_username", table_name="growth_cta_clicks")
    op.drop_table("growth_cta_clicks")
    op.drop_index("ix_users_referred_by_username", table_name="users")
    op.drop_column("users", "referred_by_username")
