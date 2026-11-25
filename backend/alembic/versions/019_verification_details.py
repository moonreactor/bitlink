"""verified badge details: kind of account and since when

Revision ID: 019
Revises: 018
Create Date: 2026-11-24

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "019"
down_revision: Union[str, None] = "018"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("profiles", sa.Column("verification_type", sa.String(length=20), nullable=True))
    op.add_column("profiles", sa.Column("verified_at", sa.DateTime(timezone=True), nullable=True))
    # Profiles verified before this migration: best guess for the date, default kind.
    op.execute(
        "UPDATE profiles SET verification_type = 'creator', verified_at = updated_at "
        "WHERE is_verified = true"
    )


def downgrade() -> None:
    op.drop_column("profiles", "verified_at")
    op.drop_column("profiles", "verification_type")
