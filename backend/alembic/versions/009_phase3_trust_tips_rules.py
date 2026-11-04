"""phase 3: verified badge, tip jar, short link rules

Revision ID: 009
Revises: 008
Create Date: 2026-11-04

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "009"
down_revision: Union[str, None] = "008"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "profiles",
        sa.Column("is_verified", sa.Boolean(), nullable=False, server_default=sa.text("false")),
    )
    op.add_column(
        "profiles",
        sa.Column("tip_jar_enabled", sa.Boolean(), nullable=False, server_default=sa.text("false")),
    )
    op.add_column("profiles", sa.Column("tip_jar_url", sa.String(length=500), nullable=True))
    op.add_column(
        "profiles",
        sa.Column("tip_jar_label", sa.String(length=80), nullable=False, server_default="Tip me"),
    )

    op.add_column("short_links", sa.Column("rule_mobile_url", sa.Text(), nullable=True))
    op.add_column("short_links", sa.Column("rule_desktop_url", sa.Text(), nullable=True))
    op.add_column(
        "short_links",
        sa.Column("geo_rules", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("short_links", "geo_rules")
    op.drop_column("short_links", "rule_desktop_url")
    op.drop_column("short_links", "rule_mobile_url")
    op.drop_column("profiles", "tip_jar_label")
    op.drop_column("profiles", "tip_jar_url")
    op.drop_column("profiles", "tip_jar_enabled")
    op.drop_column("profiles", "is_verified")
