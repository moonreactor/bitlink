import pytest

from app.models.profile import Profile
from app.models.user import User
from app.services.identity import username_skeleton

from .conftest import register

DIRECTORY = "/api/v1/public/directory"


def _verify(db, username, kind="creator"):
    db.expire_all()
    p = db.query(Profile).filter(Profile.username == username).one()
    p.is_verified = True
    p.verification_type = kind
    db.commit()


def _register_raw(client, username, display_name=None):
    return client.post(
        "/api/v1/auth/register",
        json={
            "email": f"{username}@mail.bitlink.dev",
            "password": "password123",
            "username": username,
            "display_name": display_name or username.title(),
        },
    )


def test_directory_lists_verified_first(client, db):
    for name in ("alice", "bob", "carol"):
        h = register(client, name)
        client.patch("/api/v1/me/profile", json={"discoverable": True}, headers=h)
    _verify(db, "alice")  # least recently updated of the three
    names = [i["username"] for i in client.get(DIRECTORY).json()]
    assert names[0] == "alice"


@pytest.mark.parametrize(
    "lookalike",
    ["lucia_rios", "luciari0s", "real_luciarios", "luciariosoficial", "luciarios2", "luclarios", "lucia-rios"],
)
def test_lookalikes_share_the_skeleton(lookalike):
    assert username_skeleton(lookalike) == username_skeleton("luciarios")


@pytest.mark.parametrize("other", ["mariarios", "lucia", "riosl"])
def test_different_names_do_not(other):
    assert username_skeleton(other) != username_skeleton("luciarios")


def test_cannot_register_lookalike_of_verified(client, db):
    register(client, "luciarios")
    _verify(db, "luciarios")
    res = _register_raw(client, "lucia_rios")
    assert res.status_code == 400
    assert "verified account" in res.json()["detail"]
    assert _register_raw(client, "mariarios").status_code == 201


def test_lookalikes_of_unverified_are_allowed(client):
    register(client, "luciarios")
    assert _register_raw(client, "lucia_rios").status_code == 201


def test_cannot_rename_into_lookalike(client, db):
    register(client, "luciarios")
    _verify(db, "luciarios")
    bob = register(client, "bob")
    res = client.patch("/api/v1/me/profile", json={"username": "real_luciarios"}, headers=bob)
    assert res.status_code == 400


def test_verified_owner_can_still_rename_close_to_own_name(client, db):
    lucia = register(client, "luciarios")
    _verify(db, "luciarios")
    res = client.patch("/api/v1/me/profile", json={"username": "lucia_rios"}, headers=lucia)
    assert res.status_code == 200


def test_brand_display_name_is_protected_but_creator_name_is_not(client, db):
    register(client, "acme", display_name="Acmé Corp")
    _verify(db, "acme", "brand")
    register(client, "janedoe", display_name="Jane Doe")
    _verify(db, "janedoe", "creator")

    bob = register(client, "bob")
    res = client.patch("/api/v1/me/profile", json={"display_name": "ACME corp"}, headers=bob)
    assert res.status_code == 400
    assert client.patch("/api/v1/me/profile", json={"display_name": "Jane Doe"}, headers=bob).status_code == 200
    assert _register_raw(client, "acmefan", display_name="Acme Corp").status_code == 400


def test_impersonation_report_points_to_verified_account(client, db):
    # Existing look-alike from before the original got verified.
    register(client, "luciarios")
    register(client, "lucia_rios")
    _verify(db, "luciarios")
    res = client.post(
        "/api/v1/public/reports", json={"reason": "impersonation", "username": "lucia_rios"}
    )
    assert res.status_code == 204, res.text

    boss = register(client, "boss")
    db.query(User).filter(User.email == "boss@mail.bitlink.dev").update({"is_superuser": True})
    db.commit()
    item = client.get("/api/v1/admin/reports", headers=boss).json()["items"][0]
    assert item["reason"] == "impersonation"
    assert item["impersonates_username"] == "luciarios"
