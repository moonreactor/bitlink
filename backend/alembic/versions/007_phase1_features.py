"""phase 1: link types, collections, leads phone, pixels, qr style

Revision ID: 007
Revises: 006
Create Date: 2026-11-04

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "007"
down_revision: Union[str, None] = "006"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "links",
        sa.Column("link_type", sa.String(length=32), nullable=False, server_default="url"),
    )
    op.add_column("links", sa.Column("collection", sa.String(length=80), nullable=True))
    op.add_column(
        "links",
        sa.Column("collection_layout", sa.String(length=16), nullable=False, server_default="list"),
    )

    op.add_column(
        "profiles",
        sa.Column("show_phone_capture", sa.Boolean(), nullable=False, server_default=sa.text("false")),
    )
    op.add_column("profiles", sa.Column("google_analytics_id", sa.String(length=32), nullable=True))
    op.add_column("profiles", sa.Column("meta_pixel_id", sa.String(length=32), nullable=True))
    op.add_column(
        "profiles",
        sa.Column("qr_fg_color", sa.String(length=7), nullable=False, server_default="#000000"),
    )
    op.add_column(
        "profiles",
        sa.Column("qr_bg_color", sa.String(length=7), nullable=False, server_default="#ffffff"),
    )
    op.add_column(
        "profiles",
        sa.Column("qr_logo_enabled", sa.Boolean(), nullable=False, server_default=sa.text("false")),
    )

    op.add_column("subscribers", sa.Column("phone", sa.String(length=32), nullable=True))
    op.alter_column("subscribers", "email", existing_type=sa.String(length=255), nullable=True)
    op.drop_constraint("uq_subscriber_profile_email", "subscribers", type_="unique")
    op.create_index(
        "uq_subscriber_profile_email",
        "subscribers",
        ["profile_id", "email"],
        unique=True,
        postgresql_where=sa.text("email IS NOT NULL"),
    )
    op.create_index(
        "uq_subscriber_profile_phone",
        "subscribers",
        ["profile_id", "phone"],
        unique=True,
        postgresql_where=sa.text("phone IS NOT NULL"),
    )
    op.create_check_constraint(
        "ck_subscriber_email_or_phone",
        "subscribers",
        "email IS NOT NULL OR phone IS NOT NULL",
    )


def downgrade() -> None:
    op.drop_constraint("ck_subscriber_email_or_phone", "subscribers", type_="check")
    op.drop_index("uq_subscriber_profile_phone", table_name="subscribers")
    op.drop_index("uq_subscriber_profile_email", table_name="subscribers")
    op.execute("DELETE FROM subscribers WHERE email IS NULL")
    op.create_unique_constraint(
        "uq_subscriber_profile_email", "subscribers", ["profile_id", "email"]
    )
    op.alter_column("subscribers", "email", existing_type=sa.String(length=255), nullable=False)
    op.drop_column("subscribers", "phone")

    op.drop_column("profiles", "qr_logo_enabled")
    op.drop_column("profiles", "qr_bg_color")
    op.drop_column("profiles", "qr_fg_color")
    op.drop_column("profiles", "meta_pixel_id")
    op.drop_column("profiles", "google_analytics_id")
    op.drop_column("profiles", "show_phone_capture")

    op.drop_column("links", "collection_layout")
    op.drop_column("links", "collection")
    op.drop_column("links", "link_type")
