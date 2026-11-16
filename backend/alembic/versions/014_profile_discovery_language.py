"""profile language + opt-in discovery

Revision ID: 014
Revises: 013
Create Date: 2026-11-16

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "014"
down_revision: Union[str, None] = "013"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("profiles", sa.Column("language", sa.String(length=2), nullable=True))
    op.add_column(
        "profiles",
        sa.Column("discoverable", sa.Boolean(), server_default=sa.false(), nullable=False),
    )
    op.create_index("ix_profiles_discoverable", "profiles", ["discoverable"])


def downgrade() -> None:
    op.drop_index("ix_profiles_discoverable", table_name="profiles")
    op.drop_column("profiles", "discoverable")
    op.drop_column("profiles", "language")
