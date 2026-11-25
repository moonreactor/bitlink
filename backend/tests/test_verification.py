from PIL import Image

from app.models.profile import Profile
from app.models.short_link import ShortLinkClick
from app.models.user import User
from app.services.qr import _draw_verified_badge

from .conftest import register

PUBLIC = "/api/v1/public"


def _admin(client, db, name="boss"):
    headers = register(client, name)
    db.query(User).filter(User.email == f"{name}@example.com").update({"is_superuser": True})
    db.commit()
    return headers


def _user_id(db, username):
    return db.query(Profile).filter(Profile.username == username).one().user_id


def _patch_user(client, admin, user_id, **body):
    return client.patch(f"/api/v1/admin/users/{user_id}", json=body, headers=admin)


def test_verify_with_type_is_public(client, db):
    alice = register(client, "alice")
    client.patch("/api/v1/me/profile", json={"discoverable": True}, headers=alice)
    admin = _admin(client, db)
    uid = _user_id(db, "alice")

    res = _patch_user(client, admin, uid, is_verified=True, verification_type="brand")
    assert res.status_code == 200, res.text
    assert res.json()["verification_type"] == "brand"
    assert res.json()["verified_at"]

    profile = client.get(f"{PUBLIC}/alice").json()
    assert profile["is_verified"] is True
    assert profile["verification_type"] == "brand"
    assert profile["verified_at"]
    assert profile["verified_domain"] is None

    directory = client.get(f"{PUBLIC}/directory").json()
    assert directory[0]["verification_type"] == "brand"


def test_default_type_change_type_and_revoke(client, db):
    register(client, "alice")
    admin = _admin(client, db)
    uid = _user_id(db, "alice")

    first = _patch_user(client, admin, uid, is_verified=True).json()
    assert first["verification_type"] == "creator"

    # Changing the kind keeps the original verification date.
    second = _patch_user(client, admin, uid, verification_type="organization").json()
    assert second["verification_type"] == "organization"
    assert second["verified_at"] == first["verified_at"]

    revoked = _patch_user(client, admin, uid, is_verified=False).json()
    assert revoked["is_verified"] is False
    assert revoked["verification_type"] is None
    assert revoked["verified_at"] is None
    assert client.get(f"{PUBLIC}/alice").json()["verification_type"] is None


def test_type_alone_requires_a_verified_profile(client, db):
    register(client, "alice")
    admin = _admin(client, db)
    res = _patch_user(client, admin, _user_id(db, "alice"), verification_type="brand")
    assert res.status_code == 400


def test_short_link_preview_shows_verified_owner_without_counting_a_click(client, db):
    alice = register(client, "alice")
    admin = _admin(client, db)
    _patch_user(client, admin, _user_id(db, "alice"), is_verified=True, verification_type="public_figure")
    res = client.post(
        "/api/v1/me/short-links",
        json={"destination_url": "https://www.example.com/page", "code": "promo"},
        headers=alice,
    )
    assert res.status_code == 201, res.text

    data = client.get("/api/v1/r/promo/preview").json()
    assert data["host"] == "example.com"
    assert data["url"].startswith("https://www.example.com/page")
    assert data["owner"]["username"] == "alice"
    assert data["owner"]["is_verified"] is True
    assert data["owner"]["verification_type"] == "public_figure"
    assert db.query(ShortLinkClick).count() == 0


def test_short_link_preview_hides_flagged_owner(client, db):
    alice = register(client, "alice")
    admin = _admin(client, db)
    uid = _user_id(db, "alice")
    _patch_user(client, admin, uid, is_verified=True)
    _patch_user(client, admin, uid, is_suspicious=True)
    client.post(
        "/api/v1/me/short-links",
        json={"destination_url": "https://example.com", "code": "promo"},
        headers=alice,
    )
    assert client.get("/api/v1/r/promo/preview").json()["owner"] is None


def test_short_link_preview_unknown_code(client):
    assert client.get("/api/v1/r/nope/preview").status_code == 404


def test_qr_badge_is_drawn_in_the_corner():
    pad = Image.new("RGBA", (100, 100), (255, 255, 255, 255))
    _draw_verified_badge(pad, "#f59e0b")
    # Ring is white, inside is the badge color, top-left of the pad is untouched.
    assert pad.getpixel((70, 90))[:3] == (245, 158, 11)
    assert pad.getpixel((5, 5)) == (255, 255, 255, 255)


def test_svg_qr_gets_centered_badge_only_when_verified():
    from app.services.qr import generate_profile_qr

    plain = generate_profile_qr("alice", fmt="svg").decode()
    badged = generate_profile_qr("alice", fmt="svg", verified_color="#8b5cf6").decode()
    assert "<circle" not in plain
    assert 'fill="#8b5cf6"' in badged
    assert badged.endswith("</svg>")


def test_png_qr_without_logo_gets_centered_badge():
    import io

    from app.services.qr import generate_profile_qr

    img = Image.open(io.BytesIO(generate_profile_qr("alice", verified_color="#f59e0b")))
    w, h = img.size
    # Just below the top edge of the badge circle (above the white check mark).
    assert img.getpixel((w // 2, h // 2 - w // 18))[:3] == (245, 158, 11)
