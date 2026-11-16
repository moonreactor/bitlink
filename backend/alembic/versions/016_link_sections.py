"""link sections (titled, orderable groups of links with list/grid layout)

Replaces the free-text `links.collection` / `links.collection_layout` columns with a real
`link_sections` table. Existing collections are converted to sections, keeping the page order.

Revision ID: 016
Revises: 015
Create Date: 2026-11-17

"""

import uuid
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "016"
down_revision: Union[str, None] = "015"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

links_t = sa.table(
    "links",
    sa.column("id", sa.UUID()),
    sa.column("profile_id", sa.UUID()),
    sa.column("position", sa.Integer()),
    sa.column("created_at", sa.DateTime(timezone=True)),
    sa.column("collection", sa.String()),
    sa.column("collection_layout", sa.String()),
    sa.column("section_id", sa.UUID()),
)
sections_t = sa.table(
    "link_sections",
    sa.column("id", sa.UUID()),
    sa.column("profile_id", sa.UUID()),
    sa.column("title", sa.String()),
    sa.column("layout", sa.String()),
    sa.column("position", sa.Integer()),
)


def upgrade() -> None:
    op.create_table(
        "link_sections",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("profile_id", sa.UUID(), nullable=False),
        sa.Column("title", sa.String(length=80), nullable=False),
        sa.Column("layout", sa.String(length=16), server_default="list", nullable=False),
        sa.Column("position", sa.Integer(), server_default="0", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["profile_id"], ["profiles.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_link_sections_profile_id", "link_sections", ["profile_id"])
    op.add_column("links", sa.Column("section_id", sa.UUID(), nullable=True))
    op.create_foreign_key(
        "fk_links_section_id", "links", "link_sections", ["section_id"], ["id"], ondelete="SET NULL"
    )
    op.create_index("ix_links_section_id", "links", ["section_id"])

    _collections_to_sections(op.get_bind())

    op.drop_column("links", "collection")
    op.drop_column("links", "collection_layout")


def _collections_to_sections(bind) -> None:
    """Group links by collection name, in order of first appearance (as the public page did)."""
    rows = bind.execute(
        sa.select(
            links_t.c.id,
            links_t.c.profile_id,
            links_t.c.collection,
            links_t.c.collection_layout,
        ).order_by(links_t.c.profile_id, links_t.c.position, links_t.c.created_at)
    ).all()

    by_profile: dict = {}
    for r in rows:
        by_profile.setdefault(r.profile_id, []).append(r)

    for profile_id, links in by_profile.items():
        if not any((l.collection or "").strip() for l in links):
            continue
        blocks: list[dict] = []
        section_block: dict[str, dict] = {}
        for l in links:
            name = (l.collection or "").strip()
            if not name:
                blocks.append({"kind": "link", "id": l.id})
                continue
            block = section_block.get(name)
            if block is None:
                block = {
                    "kind": "section",
                    "id": uuid.uuid4(),
                    "title": name[:80],
                    "layout": l.collection_layout if l.collection_layout in ("list", "grid") else "list",
                    "links": [],
                }
                section_block[name] = block
                blocks.append(block)
            block["links"].append(l.id)

        for index, block in enumerate(blocks):
            if block["kind"] == "link":
                bind.execute(
                    links_t.update().where(links_t.c.id == block["id"]).values(position=index)
                )
                continue
            bind.execute(
                sections_t.insert().values(
                    id=block["id"],
                    profile_id=profile_id,
                    title=block["title"],
                    layout=block["layout"],
                    position=index,
                )
            )
            for inner, link_id in enumerate(block["links"]):
                bind.execute(
                    links_t.update()
                    .where(links_t.c.id == link_id)
                    .values(section_id=block["id"], position=inner)
                )


def downgrade() -> None:
    op.add_column("links", sa.Column("collection", sa.String(length=80), nullable=True))
    op.add_column(
        "links", sa.Column("collection_layout", sa.String(length=16), server_default="list", nullable=False)
    )
    bind = op.get_bind()
    for s in bind.execute(sa.select(sections_t.c.id, sections_t.c.title, sections_t.c.layout)).all():
        bind.execute(
            links_t.update()
            .where(links_t.c.section_id == s.id)
            .values(collection=s.title, collection_layout=s.layout)
        )
    op.drop_index("ix_links_section_id", table_name="links")
    op.drop_constraint("fk_links_section_id", "links", type_="foreignkey")
    op.drop_column("links", "section_id")
    op.drop_index("ix_link_sections_profile_id", table_name="link_sections")
    op.drop_table("link_sections")
