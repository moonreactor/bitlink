"""profile flagged as suspicious by a superadmin

Revision ID: 017
Revises: 016
Create Date: 2026-11-16

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "017"
down_revision: Union[str, None] = "016"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "profiles",
        sa.Column("is_suspicious", sa.Boolean(), server_default=sa.false(), nullable=False),
    )
    op.add_column("profiles", sa.Column("suspicious_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("profiles", sa.Column("suspicious_note", sa.String(length=500), nullable=True))
    op.create_index("ix_profiles_is_suspicious", "profiles", ["is_suspicious"])


def downgrade() -> None:
    op.drop_index("ix_profiles_is_suspicious", table_name="profiles")
    op.drop_column("profiles", "suspicious_note")
    op.drop_column("profiles", "suspicious_at")
    op.drop_column("profiles", "is_suspicious")
