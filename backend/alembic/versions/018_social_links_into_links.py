"""one model for links and social icons

Social icons used to live in their own `social_links` table. They are now regular links with
`display = 'icon'` (shown in the icon row at the top of the page instead of as a button), so
both are added and edited from the same place. Existing social links are converted.

Revision ID: 018
Revises: 017
Create Date: 2026-11-17

"""

import uuid
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "018"
down_revision: Union[str, None] = "017"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

links_t = sa.table(
    "links",
    sa.column("id", sa.UUID()),
    sa.column("profile_id", sa.UUID()),
    sa.column("title", sa.String()),
    sa.column("url", sa.Text()),
    sa.column("link_type", sa.String()),
    sa.column("animation", sa.String()),
    sa.column("is_active", sa.Boolean()),
    sa.column("is_featured", sa.Boolean()),
    sa.column("position", sa.Integer()),
    sa.column("display", sa.String()),
)
social_t = sa.table(
    "social_links",
    sa.column("id", sa.UUID()),
    sa.column("profile_id", sa.UUID()),
    sa.column("platform", sa.String()),
    sa.column("url", sa.String()),
    sa.column("position", sa.Integer()),
)

_NAMES = {"x": "X", "tiktok": "TikTok", "youtube": "YouTube", "linkedin": "LinkedIn", "github": "GitHub"}


def _title(platform: str) -> str:
    p = (platform or "").strip()
    return _NAMES.get(p.lower()) or (p[:1].upper() + p[1:]) or "Link"


def upgrade() -> None:
    op.add_column(
        "links", sa.Column("display", sa.String(length=8), server_default="button", nullable=False)
    )
    op.create_index("ix_links_display", "links", ["display"])
    bind = op.get_bind()
    _socials_to_icon_links(bind)
    op.drop_table("social_links")


def _socials_to_icon_links(bind) -> None:
    for s in bind.execute(
        sa.select(social_t.c.profile_id, social_t.c.platform, social_t.c.url, social_t.c.position)
        .order_by(social_t.c.profile_id, social_t.c.position)
    ).all():
        bind.execute(
            links_t.insert().values(
                id=uuid.uuid4(),
                profile_id=s.profile_id,
                title=_title(s.platform)[:120],
                url=s.url,
                link_type="url",
                animation="none",
                is_active=True,
                is_featured=False,
                position=s.position,
                display="icon",
            )
        )


def _icon_links_to_socials(bind) -> None:
    for l in bind.execute(
        sa.select(links_t.c.profile_id, links_t.c.title, links_t.c.url, links_t.c.position)
        .where(links_t.c.display == "icon")
        .order_by(links_t.c.profile_id, links_t.c.position)
    ).all():
        bind.execute(
            social_t.insert().values(
                id=uuid.uuid4(),
                profile_id=l.profile_id,
                platform=l.title.lower()[:50],
                url=l.url[:500],
                position=l.position,
            )
        )


def downgrade() -> None:
    op.create_table(
        "social_links",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("profile_id", sa.UUID(), nullable=False),
        sa.Column("platform", sa.String(length=50), nullable=False),
        sa.Column("url", sa.String(length=500), nullable=False),
        sa.Column("position", sa.Integer(), nullable=False, server_default="0"),
        sa.ForeignKeyConstraint(["profile_id"], ["profiles.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_social_links_profile_id", "social_links", ["profile_id"])
    bind = op.get_bind()
    _icon_links_to_socials(bind)
    bind.execute(links_t.delete().where(links_t.c.display == "icon"))
    op.drop_index("ix_links_display", table_name="links")
    op.drop_column("links", "display")
