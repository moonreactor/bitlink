"""results of the automatic proof check on verification requests

Revision ID: 021
Revises: 020
Create Date: 2026-11-24

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "021"
down_revision: Union[str, None] = "020"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "verification_requests", sa.Column("proof_results", postgresql.JSONB(), nullable=True)
    )


def downgrade() -> None:
    op.drop_column("verification_requests", "proof_results")
