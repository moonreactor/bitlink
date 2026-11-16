"""The 016 migration turns free-text collections into sections without changing the page order."""

import importlib.util
import uuid
from datetime import datetime, timezone
from pathlib import Path

import sqlalchemy as sa

MIGRATION = Path(__file__).parent.parent / "alembic" / "versions" / "016_link_sections.py"


def _load():
    spec = importlib.util.spec_from_file_location("migration_016", MIGRATION)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _old_schema():
    engine = sa.create_engine("sqlite://")
    meta = sa.MetaData()
    sa.Table(
        "links",
        meta,
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("profile_id", sa.UUID(), nullable=False),
        sa.Column("position", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("collection", sa.String(80)),
        sa.Column("collection_layout", sa.String(16)),
        sa.Column("section_id", sa.UUID()),
    )
    sa.Table(
        "link_sections",
        meta,
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("profile_id", sa.UUID(), nullable=False),
        sa.Column("title", sa.String(80), nullable=False),
        sa.Column("layout", sa.String(16), nullable=False),
        sa.Column("position", sa.Integer(), nullable=False),
    )
    meta.create_all(engine)
    return engine, meta


def _add(conn, meta, profile, position, collection=None, layout="list"):
    link_id = uuid.uuid4()
    conn.execute(
        meta.tables["links"].insert().values(
            id=link_id,
            profile_id=profile,
            position=position,
            created_at=datetime.now(timezone.utc),
            collection=collection,
            collection_layout=layout,
        )
    )
    return link_id


def test_collections_become_sections_in_page_order():
    migration = _load()
    engine, meta = _old_schema()
    profile, other = uuid.uuid4(), uuid.uuid4()
    with engine.begin() as conn:
        loose_a = _add(conn, meta, profile, 0)
        m1 = _add(conn, meta, profile, 1, "Music", "grid")
        shop1 = _add(conn, meta, profile, 2, "Shop", "list")
        m2 = _add(conn, meta, profile, 3, "Music", "grid")
        loose_b = _add(conn, meta, profile, 4)
        untouched = _add(conn, meta, other, 0)

        migration._collections_to_sections(conn)

        sections = {
            r.title: r
            for r in conn.execute(sa.select(meta.tables["link_sections"])).all()
        }
        links = {r.id: r for r in conn.execute(sa.select(meta.tables["links"])).all()}

    assert set(sections) == {"Music", "Shop"}
    assert sections["Music"].layout == "grid" and sections["Shop"].layout == "list"
    assert all(s.profile_id == profile for s in sections.values())

    # Top level, in order of first appearance: loose_a, Music, Shop, loose_b
    assert links[loose_a].position == 0 and links[loose_a].section_id is None
    assert sections["Music"].position == 1
    assert sections["Shop"].position == 2
    assert links[loose_b].position == 3 and links[loose_b].section_id is None

    # Links keep their relative order inside each section.
    assert links[m1].section_id == links[m2].section_id == sections["Music"].id
    assert (links[m1].position, links[m2].position) == (0, 1)
    assert links[shop1].section_id == sections["Shop"].id and links[shop1].position == 0

    # Profiles without collections are not touched.
    assert links[untouched].position == 0 and links[untouched].section_id is None


def test_blank_collection_names_stay_loose_and_bad_layouts_fall_back():
    migration = _load()
    engine, meta = _old_schema()
    profile = uuid.uuid4()
    with engine.begin() as conn:
        blank = _add(conn, meta, profile, 0, "   ")
        odd = _add(conn, meta, profile, 1, "Odd", "carousel")
        migration._collections_to_sections(conn)
        sections = conn.execute(sa.select(meta.tables["link_sections"])).all()
        links = {r.id: r for r in conn.execute(sa.select(meta.tables["links"])).all()}

    assert [(s.title, s.layout) for s in sections] == [("Odd", "list")]
    assert links[blank].section_id is None
    assert links[odd].section_id == sections[0].id
