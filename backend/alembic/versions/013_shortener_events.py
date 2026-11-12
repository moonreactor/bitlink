"""public shortener funnel events

Revision ID: 013
Revises: 012
Create Date: 2026-11-12

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "013"
down_revision: Union[str, None] = "012"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "shortener_events",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("event", sa.String(length=32), nullable=False),
        sa.Column("source", sa.String(length=16), nullable=True),
        sa.Column("visitor_hash", sa.String(length=64), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_shortener_events_event", "shortener_events", ["event"])
    op.create_index("ix_shortener_events_source", "shortener_events", ["source"])
    op.create_index("ix_shortener_events_created_at", "shortener_events", ["created_at"])


def downgrade() -> None:
    op.drop_index("ix_shortener_events_created_at", table_name="shortener_events")
    op.drop_index("ix_shortener_events_source", table_name="shortener_events")
    op.drop_index("ix_shortener_events_event", table_name="shortener_events")
    op.drop_table("shortener_events")
