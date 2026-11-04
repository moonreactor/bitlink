"""add link animation

Revision ID: 003
Revises: 002
Create Date: 2026-11-03

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "003"
down_revision: Union[str, None] = "002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "links",
        sa.Column("animation", sa.String(length=32), nullable=False, server_default="none"),
    )


def downgrade() -> None:
    op.drop_column("links", "animation")
