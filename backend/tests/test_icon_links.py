"""Social icons are regular links with display=icon: same endpoints, own row on the public page."""

import importlib.util
import uuid
from pathlib import Path

import sqlalchemy as sa

from .conftest import register

LINKS = "/api/v1/me/links"
MIGRATION = Path(__file__).parent.parent / "alembic" / "versions" / "018_social_links_into_links.py"


def _create(client, headers, **body):
    res = client.post(LINKS, json=body, headers=headers)
    assert res.status_code == 201, res.text
    return res.json()


def test_icon_links_are_listed_separately_on_the_public_page(client):
    h = register(client, "alice")
    _create(client, h, title="Shop", url="https://shop.example")
    ig = _create(client, h, title="Instagram", url="https://instagram.com/alice", display="icon")
    _create(client, h, title="TikTok", url="https://tiktok.com/@alice", display="icon")
    assert ig["display"] == "icon"

    page = client.get("/api/v1/public/alice").json()
    assert [l["title"] for l in page["links"]] == ["Shop"]
    assert [(s["platform"], s["position"]) for s in page["social_links"]] == [("Instagram", 0), ("TikTok", 1)]
    assert page["social_links"][0]["url"] == "https://instagram.com/alice"


def test_icons_keep_their_own_order_and_do_not_shift_the_page_layout(client):
    h = register(client, "alice")
    a = _create(client, h, title="A", url="https://a.example")
    _create(client, h, title="Instagram", url="https://instagram.com/x", display="icon")
    b = _create(client, h, title="B", url="https://b.example")
    assert (a["position"], b["position"]) == (0, 1)

    # Saving the page layout (buttons only) leaves icons alone and still returns every link.
    res = client.put(
        "/api/v1/me/layout",
        json={"blocks": [{"type": "link", "id": b["id"]}, {"type": "link", "id": a["id"]}]},
        headers=h,
    )
    assert res.status_code == 200, res.text
    out = {l["title"]: l for l in res.json()["links"]}
    assert out["B"]["position"] == 0 and out["A"]["position"] == 1
    assert out["Instagram"]["display"] == "icon"


def test_switching_between_button_and_icon(client):
    h = register(client, "alice")
    link = _create(client, h, title="Spotify", url="https://open.spotify.com/artist/1", is_featured=True)
    res = client.patch(f"{LINKS}/{link['id']}", json={"display": "icon"}, headers=h)
    assert res.status_code == 200
    assert res.json()["display"] == "icon" and res.json()["is_featured"] is False
    page = client.get("/api/v1/public/alice").json()
    assert page["links"] == [] and len(page["social_links"]) == 1

    res = client.patch(f"{LINKS}/{link['id']}", json={"display": "button"}, headers=h)
    assert res.json()["display"] == "button"
    page = client.get("/api/v1/public/alice").json()
    assert len(page["links"]) == 1 and page["social_links"] == []


def test_icons_must_be_plain_links_outside_sections(client):
    h = register(client, "alice")
    assert client.post(LINKS, json={"title": "Hi", "link_type": "header", "display": "icon"}, headers=h).status_code == 422
    assert client.post(LINKS, json={"title": "x", "url": "https://x.example", "display": "nope"}, headers=h).status_code == 422
    section = client.post("/api/v1/me/sections", json={"title": "S"}, headers=h).json()
    icon = _create(client, h, title="X", url="https://x.com/a", display="icon", section_id=section["id"])
    assert icon["section_id"] is None
    res = client.patch(f"{LINKS}/{icon['id']}", json={"section_id": section["id"]}, headers=h)
    assert res.status_code == 400


def test_old_social_endpoint_is_gone(client):
    h = register(client, "alice")
    assert client.get("/api/v1/me/social-links", headers=h).status_code == 404


def test_migration_converts_social_links_to_icon_links():
    spec = importlib.util.spec_from_file_location("migration_018", MIGRATION)
    mig = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mig)

    engine = sa.create_engine("sqlite://")
    meta = sa.MetaData()
    sa.Table(
        "links",
        meta,
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("profile_id", sa.UUID(), nullable=False),
        sa.Column("title", sa.String()),
        sa.Column("url", sa.Text()),
        sa.Column("link_type", sa.String()),
        sa.Column("animation", sa.String()),
        sa.Column("is_active", sa.Boolean()),
        sa.Column("is_featured", sa.Boolean()),
        sa.Column("position", sa.Integer()),
        sa.Column("display", sa.String()),
    )
    social = sa.Table(
        "social_links",
        meta,
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("profile_id", sa.UUID(), nullable=False),
        sa.Column("platform", sa.String()),
        sa.Column("url", sa.String()),
        sa.Column("position", sa.Integer()),
    )
    meta.create_all(engine)
    pid = uuid.uuid4()
    with engine.begin() as conn:
        conn.execute(social.insert().values(id=uuid.uuid4(), profile_id=pid, platform="tiktok", url="https://tiktok.com/@a", position=1))
        conn.execute(social.insert().values(id=uuid.uuid4(), profile_id=pid, platform="instagram", url="https://instagram.com/a", position=0))
        mig._socials_to_icon_links(conn)
        rows = conn.execute(
            sa.text("select title, url, position, display, is_active from links order by position")
        ).all()
    assert [(r.title, r.position, r.display) for r in rows] == [("Instagram", 0, "icon"), ("TikTok", 1, "icon")]
    assert all(r.is_active for r in rows)

    with engine.begin() as conn:
        conn.execute(social.delete())
        mig._icon_links_to_socials(conn)
        back = conn.execute(sa.select(social.c.platform, social.c.position).order_by(social.c.position)).all()
    assert [tuple(r) for r in back] == [("instagram", 0), ("tiktok", 1)]
