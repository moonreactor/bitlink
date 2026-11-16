import uuid

from .conftest import register

LINKS = "/api/v1/me/links"
SECTIONS = "/api/v1/me/sections"
LAYOUT = "/api/v1/me/layout"


def make_link(client, headers, title, **extra):
    res = client.post(LINKS, json={"title": title, "url": f"https://example.com/{title}", **extra}, headers=headers)
    assert res.status_code == 201, res.text
    return res.json()


def make_section(client, headers, title, layout="list"):
    res = client.post(SECTIONS, json={"title": title, "layout": layout}, headers=headers)
    assert res.status_code == 201, res.text
    return res.json()


def public(client, username="alice"):
    res = client.get(f"/api/v1/public/{username}")
    assert res.status_code == 200, res.text
    return res.json()


def public_titles(client):
    return [l["title"] for l in public(client)["links"]]


def block(type_, id_, link_ids=None):
    return {"type": type_, "id": id_, **({"link_ids": link_ids} if link_ids is not None else {})}


def test_create_section_defaults_and_validation(client):
    h = register(client, "alice")
    s = make_section(client, h, "  Music  ", "grid")
    assert s["title"] == "Music" and s["layout"] == "grid"
    assert client.post(SECTIONS, json={"title": "x", "layout": "carousel"}, headers=h).status_code == 422
    assert client.post(SECTIONS, json={"title": "   "}, headers=h).status_code == 422
    assert client.post(SECTIONS, json={"title": "x" * 81}, headers=h).status_code == 422
    assert client.post(SECTIONS, json={"title": "x"}).status_code == 401


def test_section_limit(client):
    h = register(client, "alice")
    for i in range(50):
        make_section(client, h, f"S{i}")
    assert client.post(SECTIONS, json={"title": "one more"}, headers=h).status_code == 400


def test_update_section_title_and_layout(client):
    h = register(client, "alice")
    s = make_section(client, h, "Music")
    res = client.patch(f"{SECTIONS}/{s['id']}", json={"title": "Shop", "layout": "grid"}, headers=h)
    assert res.status_code == 200
    assert (res.json()["title"], res.json()["layout"]) == ("Shop", "grid")
    assert client.patch(f"{SECTIONS}/{s['id']}", json={"layout": "nope"}, headers=h).status_code == 422
    assert client.patch(f"{SECTIONS}/{uuid.uuid4()}", json={"title": "x"}, headers=h).status_code == 404


def test_sections_are_private_to_their_owner(client):
    a = register(client, "alice")
    b = register(client, "bob")
    s = make_section(client, a, "Mine")
    assert client.patch(f"{SECTIONS}/{s['id']}", json={"title": "x"}, headers=b).status_code == 404
    assert client.delete(f"{SECTIONS}/{s['id']}", headers=b).status_code == 404
    assert client.get(SECTIONS, headers=b).json() == []
    # ...and cannot put a link into someone else's section.
    res = client.post(LINKS, json={"title": "l", "url": "https://e.com", "section_id": s["id"]}, headers=b)
    assert res.status_code == 404


def test_new_items_go_to_the_end_of_the_page(client):
    h = register(client, "alice")
    make_link(client, h, "one")
    make_section(client, h, "Sec")
    make_link(client, h, "two")
    secs = client.get(SECTIONS, headers=h).json()
    links = {l["title"]: l for l in client.get(LINKS, headers=h).json()}
    assert links["one"]["position"] < secs[0]["position"] < links["two"]["position"]


def test_link_created_inside_a_section(client):
    h = register(client, "alice")
    s = make_section(client, h, "Music")
    a = make_link(client, h, "a", section_id=s["id"])
    b = make_link(client, h, "b", section_id=s["id"])
    assert a["section_id"] == s["id"] and b["position"] > a["position"]


def test_move_link_in_and_out_of_a_section(client):
    h = register(client, "alice")
    s = make_section(client, h, "Music")
    link = make_link(client, h, "a")
    moved = client.patch(f"{LINKS}/{link['id']}", json={"section_id": s["id"]}, headers=h).json()
    assert moved["section_id"] == s["id"]
    out = client.patch(f"{LINKS}/{link['id']}", json={"section_id": None}, headers=h).json()
    assert out["section_id"] is None


def test_updating_other_fields_keeps_the_section(client):
    h = register(client, "alice")
    s = make_section(client, h, "Music")
    link = make_link(client, h, "a", section_id=s["id"])
    res = client.patch(f"{LINKS}/{link['id']}", json={"title": "renamed"}, headers=h).json()
    assert res["section_id"] == s["id"]


def test_layout_reorders_sections_and_loose_links(client):
    h = register(client, "alice")
    loose = make_link(client, h, "loose")
    s1 = make_section(client, h, "First")
    s2 = make_section(client, h, "Second")
    a = make_link(client, h, "a", section_id=s1["id"])
    b = make_link(client, h, "b", section_id=s1["id"])
    c = make_link(client, h, "c", section_id=s2["id"])

    res = client.put(
        LAYOUT,
        json={
            "blocks": [
                block("section", s2["id"], [c["id"]]),
                block("link", loose["id"]),
                block("section", s1["id"], [b["id"], a["id"]]),
            ]
        },
        headers=h,
    )
    assert res.status_code == 200, res.text
    assert [s["title"] for s in res.json()["sections"]] == ["Second", "First"]
    assert public_titles(client) == ["c", "loose", "b", "a"]
    assert [s["title"] for s in public(client)["sections"]] == ["Second", "First"]


def test_layout_can_move_links_between_sections(client):
    h = register(client, "alice")
    s1 = make_section(client, h, "One")
    s2 = make_section(client, h, "Two")
    a = make_link(client, h, "a", section_id=s1["id"])
    res = client.put(
        LAYOUT,
        json={"blocks": [block("section", s1["id"], []), block("section", s2["id"], [a["id"]])]},
        headers=h,
    )
    assert res.status_code == 200
    moved = next(l for l in res.json()["links"] if l["id"] == a["id"])
    assert moved["section_id"] == s2["id"]


def test_layout_can_take_a_link_out_of_a_section(client):
    h = register(client, "alice")
    s = make_section(client, h, "One")
    a = make_link(client, h, "a", section_id=s["id"])
    res = client.put(LAYOUT, json={"blocks": [block("link", a["id"]), block("section", s["id"], [])]}, headers=h)
    assert next(l for l in res.json()["links"] if l["id"] == a["id"])["section_id"] is None


def test_layout_rejects_bad_input(client):
    a_h = register(client, "alice")
    b_h = register(client, "bob")
    mine = make_link(client, a_h, "mine")
    theirs = make_link(client, b_h, "theirs")
    section = make_section(client, a_h, "S")

    # someone else's link / unknown ids
    assert client.put(LAYOUT, json={"blocks": [block("link", theirs["id"])]}, headers=a_h).status_code == 400
    assert client.put(LAYOUT, json={"blocks": [block("section", str(uuid.uuid4()), [])]}, headers=a_h).status_code == 400
    # duplicates
    dup = {"blocks": [block("link", mine["id"]), block("section", section["id"], [mine["id"]])]}
    assert client.put(LAYOUT, json=dup, headers=a_h).status_code == 400
    twice = {"blocks": [block("section", section["id"], []), block("section", section["id"], [])]}
    assert client.put(LAYOUT, json=twice, headers=a_h).status_code == 400
    # malformed
    assert client.put(LAYOUT, json={"blocks": [{"type": "x", "id": mine["id"]}]}, headers=a_h).status_code == 422
    assert client.put(LAYOUT, json={"blocks": []}).status_code == 401


def test_partial_layout_never_loses_items(client):
    h = register(client, "alice")
    a = make_link(client, h, "a")
    b = make_link(client, h, "b")
    c = make_link(client, h, "c")
    res = client.put(LAYOUT, json={"blocks": [block("link", c["id"])]}, headers=h)
    assert res.status_code == 200
    assert len(res.json()["links"]) == 3
    assert public_titles(client) == ["c", "a", "b"]
    assert {a["id"], b["id"]} <= {l["id"] for l in res.json()["links"]}


def test_delete_section_keeps_its_links_in_place(client):
    h = register(client, "alice")
    first = make_link(client, h, "first")
    s = make_section(client, h, "Sec")
    make_link(client, h, "a", section_id=s["id"])
    make_link(client, h, "b", section_id=s["id"])
    make_link(client, h, "last")

    assert client.delete(f"{SECTIONS}/{s['id']}", headers=h).status_code == 204
    assert client.get(SECTIONS, headers=h).json() == []
    assert public_titles(client) == ["first", "a", "b", "last"]
    assert all(l["section_id"] is None for l in public(client)["links"])
    assert first["id"]


def test_public_page_exposes_sections_in_order(client):
    h = register(client, "alice")
    s = make_section(client, h, "Music", "grid")
    make_link(client, h, "a", section_id=s["id"])
    make_link(client, h, "loose")
    data = public(client)
    assert data["sections"] == [{"id": s["id"], "title": "Music", "layout": "grid"}]
    assert [(l["title"], l["section_id"]) for l in data["links"]] == [("a", s["id"]), ("loose", None)]


def test_empty_or_fully_hidden_sections_are_not_public(client):
    h = register(client, "alice")
    empty = make_section(client, h, "Empty")
    hidden = make_section(client, h, "Hidden")
    link = make_link(client, h, "x", section_id=hidden["id"])
    client.patch(f"{LINKS}/{link['id']}", json={"is_active": False}, headers=h)
    data = public(client)
    assert data["sections"] == [] and data["links"] == []
    assert empty["id"]


def test_featured_loose_links_still_float_to_the_top(client):
    h = register(client, "alice")
    s = make_section(client, h, "S")
    make_link(client, h, "in", section_id=s["id"])
    make_link(client, h, "star", is_featured=True)
    assert public_titles(client) == ["star", "in"]


def test_featured_link_stays_inside_its_section(client):
    h = register(client, "alice")
    s = make_section(client, h, "S")
    make_link(client, h, "plain", section_id=s["id"])
    make_link(client, h, "star", section_id=s["id"], is_featured=True)
    data = public(client)
    assert [l["title"] for l in data["links"]] == ["star", "plain"]
    assert {l["section_id"] for l in data["links"]} == {s["id"]}
