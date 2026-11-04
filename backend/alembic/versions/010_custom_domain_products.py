"""custom domains and profile products

Revision ID: 010
Revises: 009
Create Date: 2026-11-04

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "010"
down_revision: Union[str, None] = "009"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("profiles", sa.Column("custom_domain", sa.String(length=255), nullable=True))
    op.add_column(
        "profiles",
        sa.Column("custom_domain_verified", sa.Boolean(), nullable=False, server_default=sa.text("false")),
    )
    op.add_column(
        "profiles",
        sa.Column("custom_domain_verify_token", sa.String(length=64), nullable=True),
    )
    op.create_index("ix_profiles_custom_domain", "profiles", ["custom_domain"], unique=True)

    op.create_table(
        "products",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("profile_id", sa.UUID(), nullable=False),
        sa.Column("title", sa.String(length=120), nullable=False),
        sa.Column("description", sa.String(length=500), nullable=True),
        sa.Column("price_label", sa.String(length=40), nullable=True),
        sa.Column("checkout_url", sa.Text(), nullable=False),
        sa.Column("thumbnail_url", sa.String(length=500), nullable=True),
        sa.Column("position", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["profile_id"], ["profiles.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_products_profile_id", "products", ["profile_id"])


def downgrade() -> None:
    op.drop_index("ix_products_profile_id", table_name="products")
    op.drop_table("products")
    op.drop_index("ix_profiles_custom_domain", table_name="profiles")
    op.drop_column("profiles", "custom_domain_verify_token")
    op.drop_column("profiles", "custom_domain_verified")
    op.drop_column("profiles", "custom_domain")
