from app.models.profile import Profile

from .conftest import register

DIRECTORY = "/api/v1/public/directory"


def _patch(client, headers, **body):
    res = client.patch("/api/v1/me/profile", json=body, headers=headers)
    assert res.status_code == 200, res.text
    return res.json()


def test_profiles_are_not_listed_by_default(client):
    register(client, "alice")
    assert client.get(DIRECTORY).json() == []


def test_only_opted_in_profiles_are_listed(client):
    alice = register(client, "alice")
    register(client, "bob")
    _patch(client, alice, discoverable=True)

    items = client.get(DIRECTORY).json()
    assert [i["username"] for i in items] == ["alice"]
    # Only public fields are exposed.
    assert set(items[0]) == {
        "username",
        "display_name",
        "bio",
        "avatar_url",
        "language",
        "is_verified",
        "verification_type",
        "updated_at",
    }


def test_locked_profiles_are_never_listed(client):
    alice = register(client, "alice")
    _patch(client, alice, discoverable=True, profile_password="secret-pass")
    assert client.get(DIRECTORY).json() == []

    _patch(client, alice, clear_profile_password=True)
    assert [i["username"] for i in client.get(DIRECTORY).json()] == ["alice"]


def test_opting_out_removes_the_profile(client):
    alice = register(client, "alice")
    _patch(client, alice, discoverable=True)
    _patch(client, alice, discoverable=False)
    assert client.get(DIRECTORY).json() == []


def test_filter_by_language(client):
    alice = register(client, "alice", language="es")
    bob = register(client, "bob", language="pt")
    _patch(client, alice, discoverable=True)
    _patch(client, bob, discoverable=True)

    assert [i["username"] for i in client.get(DIRECTORY, params={"lang": "es"}).json()] == ["alice"]
    assert [i["username"] for i in client.get(DIRECTORY, params={"lang": "pt"}).json()] == ["bob"]
    assert client.get(DIRECTORY, params={"lang": "fr"}).status_code == 422


def test_limit_is_respected_and_validated(client):
    for name in ("alice", "bob", "carol"):
        _patch(client, register(client, name), discoverable=True)

    assert len(client.get(DIRECTORY, params={"limit": 2}).json()) == 2
    assert client.get(DIRECTORY, params={"limit": 0}).status_code == 422
    assert client.get(DIRECTORY, params={"limit": 5001}).status_code == 422


def test_directory_is_not_shadowed_by_username_route(client):
    # `/public/directory` must hit the list endpoint, not `/public/{username}`.
    assert client.get(DIRECTORY).status_code == 200


def test_directory_is_a_reserved_username(client):
    res = client.post(
        "/api/v1/auth/register",
        json={
            "email": "d@example.com",
            "password": "password123",
            "username": "directory",
            "display_name": "Directory",
        },
    )
    assert res.status_code == 422


def test_public_profile_exposes_language_and_dates(client, db):
    register(client, "alice", language="es")
    data = client.get("/api/v1/public/alice").json()
    assert data["language"] == "es"
    assert data["discoverable"] is False
    assert data["created_at"] and data["updated_at"]
    assert db.query(Profile).count() == 1
