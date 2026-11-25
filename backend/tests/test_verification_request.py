from datetime import datetime, timedelta, timezone

import pytest

from app.models.profile import Profile
from app.models.user import User
from app.models.verification import VerificationRequest
from app.services import verification_proof
from app.services.safe_fetch import UnsafeUrl, check_public_host
from app.services.verification_proof import proof_code

from .conftest import register

ME = "/api/v1/me/verification"


@pytest.fixture(autouse=True)
def _no_network(monkeypatch):
    """Proof checks never leave the test: pages contain the code only on example.com/proof."""

    def fake_page(url, code):
        return (url.endswith("example.com/proof"), None)

    monkeypatch.setattr(verification_proof, "page_contains", fake_page)
    monkeypatch.setattr(verification_proof, "fetch_txt_records", lambda name: [])


def _profile(db, username="alice"):
    db.expire_all()
    return db.query(Profile).filter(Profile.username == username).one()


def _ready(client, db, headers, username="alice"):
    """Meet every required item: avatar, bio, a social icon and 7 days of age."""
    client.patch(
        "/api/v1/me/profile",
        json={"avatar_url": "https://example.com/a.png", "bio": "Singer"},
        headers=headers,
    )
    res = client.post(
        "/api/v1/me/links",
        json={"title": "Instagram", "url": "https://instagram.com/alice", "display": "icon"},
        headers=headers,
    )
    assert res.status_code in (200, 201), res.text
    p = _profile(db, username)
    p.created_at = datetime.now(timezone.utc) - timedelta(days=8)
    db.commit()


def _ask(client, headers, **extra):
    body = {
        "verification_type": "creator",
        "reason": "I am Alice",
        "evidence_urls": ["https://instagram.com/alice", "https://example.com/proof"],
        **extra,
    }
    return client.post(f"{ME}/request", json=body, headers=headers)


def test_new_account_sees_requirements_and_cannot_ask(client):
    alice = register(client, "alice")
    data = client.get(ME, headers=alice).json()
    assert data["can_request"] is False
    assert data["blocked_reason"] == "requirements"
    assert data["proof_code"].startswith("bitlink-")
    met = {r["key"]: r["met"] for r in data["requirements"]}
    assert met == {
        "avatar": False,
        "bio": False,
        "social_profile": False,
        "account_age": False,
        "not_flagged": True,
        "custom_domain": False,
    }
    assert _ask(client, alice).status_code == 400


def test_request_goes_to_queue_with_proof_results(client, db):
    alice = register(client, "alice")
    _ready(client, db, alice)
    assert client.get(ME, headers=alice).json()["can_request"] is True

    res = _ask(client, alice)
    assert res.status_code == 201, res.text
    data = client.get(ME, headers=alice).json()
    assert data["blocked_reason"] == "pending"
    latest = data["latest_request"]
    assert latest["status"] == "pending"
    found = {r["target"]: r["found"] for r in latest["proof_results"]}
    assert found == {
        "https://instagram.com/alice": False,
        "https://example.com/proof": True,
        # example.com is the user's own site: its TXT records are checked too.
        "example.com": False,
    }

    # One pending request at a time.
    assert _ask(client, alice).status_code == 400


def test_rejection_shows_note_and_cooldown(client, db):
    alice = register(client, "alice")
    _ready(client, db, alice)
    _ask(client, alice)
    boss = register(client, "boss")
    db.query(User).filter(User.email == "boss@mail.bitlink.dev").update({"is_superuser": True})
    db.commit()
    req_id = db.query(VerificationRequest).one().id
    client.patch(
        f"/api/v1/admin/verification-requests/{req_id}",
        json={"status": "rejected", "note": "Put the code in your Instagram bio"},
        headers=boss,
    )

    data = client.get(ME, headers=alice).json()
    assert data["blocked_reason"] == "cooldown"
    assert data["cooldown_until"]
    assert data["latest_request"]["decision_note"] == "Put the code in your Instagram bio"
    assert _ask(client, alice).status_code == 400

    db.expire_all()
    req = db.get(VerificationRequest, req_id)
    req.reviewed_at = datetime.now(timezone.utc) - timedelta(days=15)
    db.commit()
    assert client.get(ME, headers=alice).json()["can_request"] is True


def test_admin_sees_code_and_can_recheck(client, db, monkeypatch):
    alice = register(client, "alice")
    _ready(client, db, alice)
    _ask(client, alice, evidence_urls=["https://instagram.com/alice"])
    boss = register(client, "boss")
    db.query(User).filter(User.email == "boss@mail.bitlink.dev").update({"is_superuser": True})
    db.commit()

    item = client.get("/api/v1/admin/verification-requests", headers=boss).json()["items"][0]
    assert item["proof_code"] == proof_code(_profile(db).id)
    assert item["proof_results"][0]["found"] is False

    # The owner adds the code afterwards; the admin checks again.
    monkeypatch.setattr(verification_proof, "page_contains", lambda url, code: (True, None))
    res = client.post(f"/api/v1/admin/verification-requests/{item['id']}/check", headers=boss)
    assert res.status_code == 200, res.text
    assert res.json()["proof_results"][0]["found"] is True


def test_verified_profile_cannot_ask_again(client, db):
    alice = register(client, "alice")
    p = _profile(db)
    p.is_verified = True
    p.verification_type = "creator"
    db.commit()
    assert client.get(ME, headers=alice).json()["blocked_reason"] == "verified"


def test_evidence_links_are_validated(client, db):
    alice = register(client, "alice")
    _ready(client, db, alice)
    assert _ask(client, alice, evidence_urls=[]).status_code == 422
    assert _ask(client, alice, evidence_urls=["javascript:alert(1)"]).status_code == 422
    assert _ask(client, alice, evidence_urls=[f"https://e.com/{i}" for i in range(6)]).status_code == 422


def test_proof_code_is_stable_and_per_profile():
    import uuid

    a, b = uuid.uuid4(), uuid.uuid4()
    assert proof_code(a) == proof_code(a)
    assert proof_code(a) != proof_code(b)


@pytest.mark.parametrize(
    "url",
    [
        "http://localhost/admin",
        "http://127.0.0.1/",
        "http://10.0.0.5/",
        "http://169.254.169.254/latest/meta-data/",
        "http://[::1]/",
        "https://example.com:8080/",
        "file:///etc/passwd",
    ],
)
def test_proof_fetch_refuses_private_targets(url):
    with pytest.raises(UnsafeUrl):
        check_public_host(url)


def test_shared_hosts_are_not_dns_checked(monkeypatch):
    looked_up = []
    monkeypatch.setattr(verification_proof, "page_contains", lambda url, code: (False, None))
    monkeypatch.setattr(verification_proof, "fetch_txt_records", lambda name: looked_up.append(name) or [])
    verification_proof.run_proof_checks(
        "bitlink-x", ["https://www.instagram.com/a", "https://alice.dev/about"], "links.alice.dev"
    )
    assert set(looked_up) == {
        "links.alice.dev",
        "_bitlink-challenge.links.alice.dev",
        "alice.dev",
        "_bitlink-challenge.alice.dev",
    }
