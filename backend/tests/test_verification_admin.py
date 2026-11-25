from app.models.profile import Profile
from app.models.user import User
from app.models.verification import VerificationRequest

from .conftest import register

ADMIN = "/api/v1/admin"


def _admin(client, db, name="boss"):
    headers = register(client, name)
    db.query(User).filter(User.email == f"{name}@mail.bitlink.dev").update({"is_superuser": True})
    db.commit()
    return headers


def _profile(db, username):
    db.expire_all()
    return db.query(Profile).filter(Profile.username == username).one()


def _patch_user(client, admin, user_id, **body):
    return client.patch(f"{ADMIN}/users/{user_id}", json=body, headers=admin)


def _request(db, username, **extra):
    req = VerificationRequest(
        profile_id=_profile(db, username).id,
        verification_type=extra.pop("verification_type", "creator"),
        reason=extra.pop("reason", "I am me"),
        evidence_urls=extra.pop("evidence_urls", ["https://instagram.com/alice"]),
        **extra,
    )
    db.add(req)
    db.commit()
    return req.id


def test_history_records_who_did_what(client, db):
    register(client, "alice")
    admin = _admin(client, db)
    uid = _profile(db, "alice").user_id

    _patch_user(client, admin, uid, is_verified=True, verification_note="Known creator")
    _patch_user(client, admin, uid, verification_type="brand")
    detail = _patch_user(client, admin, uid, is_verified=False, verification_note="Expired").json()

    actions = [e["action"] for e in detail["verification_history"]]
    assert actions == ["revoked", "type_changed", "verified"]
    assert {e["actor_email"] for e in detail["verification_history"]} == {"boss@mail.bitlink.dev"}
    assert detail["verification_history"][2]["note"] == "Known creator"
    assert detail["verification_history"][0]["note"] == "Expired"
    assert detail["verification_note"] is None


def test_detail_shows_verifier_and_note(client, db):
    register(client, "alice")
    admin = _admin(client, db)
    uid = _profile(db, "alice").user_id
    detail = _patch_user(client, admin, uid, is_verified=True, verification_note="Met in person").json()
    assert detail["verified_by_email"] == "boss@mail.bitlink.dev"
    assert detail["verification_note"] == "Met in person"


def test_flagging_revokes_badge_and_blocks_verifying(client, db):
    register(client, "alice")
    admin = _admin(client, db)
    uid = _profile(db, "alice").user_id
    _patch_user(client, admin, uid, is_verified=True)

    detail = _patch_user(client, admin, uid, is_suspicious=True).json()
    assert detail["is_verified"] is False
    assert detail["verification_history"][0]["action"] == "auto_revoked"
    assert detail["verification_history"][0]["actor_email"] is None
    assert client.get("/api/v1/public/alice").json()["is_verified"] is False

    assert _patch_user(client, admin, uid, is_verified=True).status_code == 400


def test_renaming_sends_badge_back_to_review(client, db):
    alice = register(client, "alice")
    admin = _admin(client, db)
    uid = _profile(db, "alice").user_id
    _patch_user(client, admin, uid, is_verified=True, verification_type="brand")

    # Saving the same values (the settings form always sends them) keeps the badge.
    client.patch("/api/v1/me/profile", json={"username": "alice", "display_name": "Alice"}, headers=alice)
    assert _profile(db, "alice").is_verified is True

    client.patch("/api/v1/me/profile", json={"username": "alice2"}, headers=alice)
    assert _profile(db, "alice2").is_verified is False

    queue = client.get(f"{ADMIN}/verification-requests", params={"status": "pending"}, headers=admin).json()
    assert queue["pending"] == 1
    item = queue["items"][0]
    assert item["source"] == "auto"
    assert item["verification_type"] == "brand"
    assert "@alice to @alice2" in item["reason"]

    # One click restores it.
    res = client.patch(f"{ADMIN}/verification-requests/{item['id']}", json={"status": "approved"}, headers=admin)
    assert res.status_code == 200, res.text
    assert res.json()["status"] == "approved"
    assert client.get("/api/v1/public/alice2").json()["verification_type"] == "brand"


def test_display_name_change_also_goes_to_review(client, db):
    alice = register(client, "alice")
    admin = _admin(client, db)
    _patch_user(client, admin, _profile(db, "alice").user_id, is_verified=True)
    client.patch("/api/v1/me/profile", json={"display_name": "Someone Famous"}, headers=alice)
    assert _profile(db, "alice").is_verified is False
    assert db.query(VerificationRequest).count() == 1


def test_queue_lists_signals(client, db):
    alice = register(client, "alice")
    admin = _admin(client, db)
    client.patch("/api/v1/me/profile", json={"bio": "Hi"}, headers=alice)
    _request(db, "alice")

    item = client.get(f"{ADMIN}/verification-requests", params={"status": "pending"}, headers=admin).json()[
        "items"
    ][0]
    signals = item["signals"]
    assert item["username"] == "alice"
    assert item["evidence_urls"] == ["https://instagram.com/alice"]
    assert signals["has_bio"] is True
    assert signals["has_avatar"] is False
    assert signals["account_age_days"] == 0
    assert signals["reports_total"] == 0
    assert signals["previously_revoked"] == 0


def test_approve_with_other_type_and_reject_with_note(client, db):
    register(client, "alice")
    register(client, "bob")
    admin = _admin(client, db)
    a = _request(db, "alice", verification_type="creator")
    b = _request(db, "bob")

    res = client.patch(
        f"{ADMIN}/verification-requests/{a}",
        json={"status": "approved", "verification_type": "public_figure", "note": "Checked IG"},
        headers=admin,
    ).json()
    assert res["verification_type"] == "public_figure"
    assert res["reviewed_by_email"] == "boss@mail.bitlink.dev"
    alice = _profile(db, "alice")
    assert alice.verification_type == "public_figure"
    assert alice.verification_note == "Checked IG"

    res = client.patch(
        f"{ADMIN}/verification-requests/{b}",
        json={"status": "rejected", "note": "Add links to your socials"},
        headers=admin,
    ).json()
    assert res["status"] == "rejected"
    assert res["decision_note"] == "Add links to your socials"
    assert _profile(db, "bob").is_verified is False

    # Already reviewed.
    again = client.patch(f"{ADMIN}/verification-requests/{b}", json={"status": "approved"}, headers=admin)
    assert again.status_code == 400

    counts = client.get(f"{ADMIN}/verification-requests", headers=admin).json()
    assert (counts["pending"], counts["approved"], counts["rejected"]) == (0, 1, 1)


def test_verifying_from_user_page_approves_pending_request(client, db):
    register(client, "alice")
    admin = _admin(client, db)
    req = _request(db, "alice")
    detail = _patch_user(client, admin, _profile(db, "alice").user_id, is_verified=True).json()
    assert detail["pending_verification_request_id"] is None
    db.expire_all()
    assert db.get(VerificationRequest, req).status == "approved"


def test_queue_requires_superuser(client):
    alice = register(client, "alice")
    assert client.get(f"{ADMIN}/verification-requests", headers=alice).status_code == 403
