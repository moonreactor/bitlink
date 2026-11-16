from uuid import UUID

from app.models.link import Link
from app.models.short_link import ShortLink
from app.models.user import User

from .conftest import register

REPORTS = "/api/v1/public/reports"
ADMIN = "/api/v1/admin/reports"


def _admin(client, db, name="boss"):
    headers = register(client, name)
    db.query(User).filter(User.email == f"{name}@example.com").update({"is_superuser": True})
    db.commit()
    return headers


def _add_link(client, headers, url="https://evil.example/login"):
    res = client.post("/api/v1/me/links", json={"title": "Free gift", "url": url}, headers=headers)
    assert res.status_code in (200, 201), res.text
    return res.json()["id"]


def test_report_profile_and_admin_lists_it(client, db):
    register(client, "alice")
    admin = _admin(client, db)

    res = client.post(REPORTS, json={"username": "alice", "reason": "scam", "details": "fake giveaway"})
    assert res.status_code == 204

    data = client.get(ADMIN, headers=admin).json()
    assert data["total"] == 1 and data["pending"] == 1
    item = data["items"][0]
    assert item["target_type"] == "profile"
    assert item["username"] == "alice"
    assert item["status"] == "pending"
    assert item["details"] == "fake giveaway"


def test_report_link_and_disable_it(client, db):
    alice = register(client, "alice")
    link_id = _add_link(client, alice)
    admin = _admin(client, db)

    assert client.post(REPORTS, json={"username": "alice", "link_id": link_id, "reason": "phishing"}).status_code == 204
    item = client.get(ADMIN, headers=admin).json()["items"][0]
    assert item["target_type"] == "link" and item["target_active"] is True
    assert item["target_url"] == "https://evil.example/login"

    res = client.patch(
        f"{ADMIN}/{item['id']}",
        json={"status": "resolved", "resolution_note": "removed", "disable_target": True},
        headers=admin,
    )
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "resolved" and body["target_active"] is False
    assert body["resolved_by_email"] == "boss@example.com" and body["resolved_at"]
    assert db.query(Link).filter(Link.id == UUID(link_id)).one().is_active is False

    counts = client.get(ADMIN, headers=admin).json()
    assert (counts["pending"], counts["resolved"]) == (0, 1)
    assert client.get(ADMIN, params={"status": "pending"}, headers=admin).json()["items"] == []


def test_report_short_link_by_url_and_dismiss(client, db):
    alice = register(client, "alice")
    client.post("/api/v1/me/short-links", json={"destination_url": "https://bad.example", "code": "promo"}, headers=alice)
    admin = _admin(client, db)

    assert client.post(REPORTS, json={"short_code": "https://bitlink.click/Promo", "reason": "malware"}).status_code == 204
    item = client.get(ADMIN, headers=admin).json()["items"][0]
    assert item["target_type"] == "short_link" and item["target_label"] == "/promo"

    res = client.patch(f"{ADMIN}/{item['id']}", json={"status": "dismissed"}, headers=admin)
    assert res.json()["status"] == "dismissed"
    assert db.query(ShortLink).filter(ShortLink.code == "promo").one().is_active is True


def test_validation_and_unknown_targets(client):
    register(client, "alice")
    assert client.post(REPORTS, json={"reason": "scam"}).status_code == 422
    assert client.post(REPORTS, json={"username": "alice", "short_code": "x", "reason": "scam"}).status_code == 422
    assert client.post(REPORTS, json={"username": "alice", "reason": "nope"}).status_code == 422
    assert client.post(REPORTS, json={"username": "ghost", "reason": "scam"}).status_code == 404
    assert client.post(REPORTS, json={"short_code": "ghost", "reason": "scam"}).status_code == 404


def test_duplicate_reports_are_collapsed_and_rate_limited(client, db):
    register(client, "alice")
    admin = _admin(client, db)
    for _ in range(3):
        assert client.post(REPORTS, json={"username": "alice", "reason": "spam"}).status_code == 204
    assert client.get(ADMIN, headers=admin).json()["total"] == 1

    for i in range(12):
        register(client, f"user{i}")
    codes = [client.post(REPORTS, json={"username": f"user{i}", "reason": "spam"}).status_code for i in range(12)]
    assert codes.count(429) >= 1


def test_admin_endpoints_require_superuser(client):
    alice = register(client, "alice")
    assert client.get(ADMIN).status_code in (401, 403)
    assert client.get(ADMIN, headers=alice).status_code == 403
