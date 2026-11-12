"""anonymous short links (claimable with a token)

Revision ID: 012
Revises: 011
Create Date: 2026-11-12

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "012"
down_revision: Union[str, None] = "011"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column("short_links", "user_id", existing_type=sa.UUID(), nullable=True)
    op.add_column("short_links", sa.Column("claim_token_hash", sa.String(length=64), nullable=True))
    op.add_column("short_links", sa.Column("creator_hash", sa.String(length=64), nullable=True))
    op.create_index("ix_short_links_claim_token_hash", "short_links", ["claim_token_hash"])
    op.create_index("ix_short_links_creator_hash", "short_links", ["creator_hash"])


def downgrade() -> None:
    op.drop_index("ix_short_links_creator_hash", table_name="short_links")
    op.drop_index("ix_short_links_claim_token_hash", table_name="short_links")
    op.drop_column("short_links", "creator_hash")
    op.drop_column("short_links", "claim_token_hash")
    # Anonymous (unclaimed) links have no owner and cannot satisfy NOT NULL.
    op.execute("DELETE FROM short_links WHERE user_id IS NULL")
    op.alter_column("short_links", "user_id", existing_type=sa.UUID(), nullable=False)
