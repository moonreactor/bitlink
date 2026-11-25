from app.models.profile import Profile
from app.models.verification import IdentityAlert

from .conftest import register

ALERTS = "/api/v1/me/verification/alerts"


def _verify(db, username, kind="creator"):
    db.expire_all()
    p = db.query(Profile).filter(Profile.username == username).one()
    p.is_verified = True
    p.verification_type = kind
    db.commit()


def _register_raw(client, username, display_name=None, email=None):
    return client.post(
        "/api/v1/auth/register",
        json={
            "email": email or f"{username}@example.com",
            "password": "password123",
            "username": username,
            "display_name": display_name or username.title(),
        },
    )


def test_blocked_signup_alerts_the_owner_once_a_day(client, db):
    lucia = register(client, "luciarios")
    _verify(db, "luciarios")
    assert _register_raw(client, "lucia_rios").status_code == 400
    assert _register_raw(client, "lucia_rios", email="again@example.com").status_code == 400
    assert _register_raw(client, "luciari0s").status_code == 400

    data = client.get(ALERTS, headers=lucia).json()
    assert data["unseen"] == 2
    assert [(a["kind"], a["subject"]) for a in data["items"]] == [
        ("blocked_username", "luciari0s"),
        ("blocked_username", "lucia_rios"),
    ]


def test_blocked_rename_alerts_and_keeps_profile_unchanged(client, db):
    acme = register(client, "acme", display_name="Acme Corp")
    _verify(db, "acme", "brand")
    bob = register(client, "bob")
    res = client.patch(
        "/api/v1/me/profile",
        json={"username": "bobby", "display_name": "ACME Corp"},
        headers=bob,
    )
    assert res.status_code == 400
    # Nothing of the refused update was saved, not even the allowed username.
    db.expire_all()
    assert db.query(Profile).filter(Profile.username == "bob").one().display_name == "Bob"

    items = client.get(ALERTS, headers=acme).json()["items"]
    assert items[0]["kind"] == "blocked_display_name"
    assert items[0]["subject"] == "ACME Corp"


def test_report_against_lookalike_alerts_the_owner(client, db):
    lucia = register(client, "luciarios")
    register(client, "lucia_rios")  # existed before Lucía was verified
    _verify(db, "luciarios")
    client.post("/api/v1/public/reports", json={"reason": "impersonation", "username": "lucia_rios"})

    item = client.get(ALERTS, headers=lucia).json()["items"][0]
    assert item["kind"] == "reported_lookalike"
    assert item["subject"] == "@lucia_rios"
    assert item["report_reason"] == "impersonation"


def test_report_against_unrelated_profile_alerts_nobody(client, db):
    register(client, "luciarios")
    _verify(db, "luciarios")
    register(client, "spammer")
    client.post("/api/v1/public/reports", json={"reason": "spam", "username": "spammer"})
    assert db.query(IdentityAlert).count() == 0


def test_mark_seen(client, db):
    lucia = register(client, "luciarios")
    _verify(db, "luciarios")
    _register_raw(client, "lucia_rios")
    data = client.post(f"{ALERTS}/seen", headers=lucia).json()
    assert data["unseen"] == 0
    assert data["items"][0]["seen"] is True


def test_alerts_are_private(client, db):
    register(client, "luciarios")
    _verify(db, "luciarios")
    _register_raw(client, "lucia_rios")
    bob = register(client, "bob")
    assert client.get(ALERTS, headers=bob).json() == {"items": [], "unseen": 0}
