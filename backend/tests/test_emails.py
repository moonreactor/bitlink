from datetime import datetime, timedelta, timezone

import pytest

from app.models.analytics import PageView
from app.models.email_log import EmailLog
from app.models.link import Link
from app.models.profile import Profile
from app.models.user import User
from app.models.verification import IdentityAlert, VerificationRequest
from app.services import mailer
from app.services.email_templates import COPY, LANGUAGES, render
from app.services.lifecycle_emails import run_lifecycle
from tests.conftest import register


@pytest.fixture()
def outbox(monkeypatch):
    sent: list[dict] = []

    def fake_transport(payload, idempotency_key=None):
        sent.append({**payload, "idempotency_key": idempotency_key})
        return mailer.SendResult("sent", provider_id=f"id-{len(sent)}")

    monkeypatch.setattr(mailer, "transport", fake_transport)
    return sent


def _user(db, username: str) -> User:
    return db.query(User).join(Profile, Profile.user_id == User.id).filter(Profile.username == username).one()


def _age(db, username: str, days: int) -> User:
    user = _user(db, username)
    user.created_at = datetime.now(timezone.utc) - timedelta(days=days)
    user.profile.created_at = user.created_at
    db.commit()
    return user


def _superuser(client, db, username="boss"):
    headers = register(client, username)
    user = _user(db, username)
    user.is_superuser = True
    db.commit()
    return headers


def test_every_kind_renders_in_every_language():
    for kind in COPY:
        for lang in LANGUAGES:
            out = render(
                kind,
                lang,
                {"name": "Ana <b>", "missing": ["avatar"], "views": 3, "clicks": 1, "note": "x"},
                cta_url="https://example.com/x",
                unsubscribe_url="https://example.com/u",
            )
            assert out.subject and "{" not in out.subject
            if "{name}" in str(COPY[kind][lang]["body"]):
                assert "Ana &lt;b&gt;" in out.html  # values are escaped
            assert "https://example.com/x" in out.text


def test_welcome_email_in_profile_language(client, db, outbox):
    register(client, "maria", language="es")
    assert len(outbox) == 1
    assert outbox[0]["to"] == ["maria@mail.bitlink.dev"]
    assert outbox[0]["subject"].startswith("Bienvenido a Bitlink")
    assert "List-Unsubscribe" not in outbox[0].get("headers", {})
    log = db.query(EmailLog).one()
    assert (log.kind, log.language, log.status) == ("welcome", "es", "sent")


def test_password_reset_sends_link(client, db, outbox):
    register(client, "joao", language="pt")
    outbox.clear()
    client.post("/api/v1/auth/forgot-password", json={"email": "joao@mail.bitlink.dev"})
    assert outbox[0]["subject"] == "Redefina sua senha do Bitlink"
    assert "/reset-password?token=" in outbox[0]["html"]
    # Unknown emails send nothing.
    client.post("/api/v1/auth/forgot-password", json={"email": "nobody@mail.bitlink.dev"})
    assert len(outbox) == 1


def test_complete_profile_then_paced(client, db, outbox):
    register(client, "lucia")
    _age(db, "lucia", 2)
    outbox.clear()

    report = run_lifecycle(db)
    assert report.planned == {"complete_profile": 1}
    assert "A profile photo" in outbox[0]["html"]
    assert outbox[0]["headers"]["List-Unsubscribe-Post"] == "List-Unsubscribe=One-Click"

    # Running again right away sends nothing.
    assert run_lifecycle(db).planned == {}
    # Four days later the profile tip is not due yet (every 7 days).
    assert run_lifecycle(db, now=datetime.now(timezone.utc) + timedelta(days=4)).planned == {}
    assert run_lifecycle(db, now=datetime.now(timezone.utc) + timedelta(days=8)).planned == {
        "complete_profile": 1
    }


def test_new_accounts_wait_a_day(client, db, outbox):
    register(client, "fresh")
    outbox.clear()
    assert run_lifecycle(db).planned == {}


def _complete(db, username: str, links: int = 1, social: bool = False):
    user = _user(db, username)
    p = user.profile
    p.avatar_url = "https://example.com/a.png"
    p.bio = "Hi"
    for i in range(links):
        db.add(Link(profile_id=p.id, title=f"L{i}", url="https://example.com", position=i))
    if social:
        db.add(Link(profile_id=p.id, title="IG", url="https://instagram.com/x", display="icon", position=99))
    db.commit()


def test_add_links_invite(client, db, outbox):
    register(client, "pablo", language="es")
    _complete(db, "pablo", links=2)
    _age(db, "pablo", 5)
    outbox.clear()
    assert run_lifecycle(db).planned == {"add_links": 1}
    assert "Tu página tiene 2 link(s)" in outbox[0]["html"]


def test_verification_invite_when_eligible(client, db, outbox):
    register(client, "vera")
    _complete(db, "vera", links=6, social=True)
    _age(db, "vera", 10)
    outbox.clear()
    assert run_lifecycle(db).planned == {"verification_invite": 1}

    # Not invited while a request is pending.
    db.query(EmailLog).delete()
    db.add(VerificationRequest(profile_id=_user(db, "vera").profile.id, verification_type="creator"))
    db.commit()
    assert "verification_invite" not in run_lifecycle(db).planned


def test_weekly_summary(client, db, outbox):
    register(client, "stats")
    _complete(db, "stats", links=6)
    _age(db, "stats", 30)
    db.add(PageView(profile_id=_user(db, "stats").profile.id))
    db.commit()
    outbox.clear()
    assert run_lifecycle(db).planned == {"weekly_summary": 1}
    assert outbox[0]["subject"] == "Your week on Bitlink: 1 visits"


def test_opt_out_stops_tips_but_not_security(client, db, outbox):
    headers = register(client, "quiet")
    _age(db, "quiet", 3)
    res = client.put("/api/v1/me/email-preferences", json={"marketing_emails": False}, headers=headers)
    assert res.json() == {"marketing_emails": False}
    outbox.clear()
    assert run_lifecycle(db).planned == {}

    user = _user(db, "quiet")
    user.profile.is_verified = True
    db.add(IdentityAlert(profile_id=user.profile.id, kind="blocked_username", subject="qu1et"))
    db.commit()
    assert run_lifecycle(db).planned == {"identity_alert": 1}
    assert run_lifecycle(db).planned == {}


def test_tips_keep_a_gap(client, db, outbox):
    register(client, "gap")
    _age(db, "gap", 2)
    run_lifecycle(db)
    # Profile completed afterwards → next tip (add links) still waits for the 3-day gap.
    _complete(db, "gap", links=1)
    _age(db, "gap", 5)
    assert run_lifecycle(db).planned == {}
    assert run_lifecycle(db, now=datetime.now(timezone.utc) + timedelta(days=4)).planned == {"add_links": 1}


def test_unsubscribe_link(client, db, outbox):
    register(client, "bye")
    user = _user(db, "bye")
    url = mailer.unsubscribe_url(user, "es").split("/api/v1", 1)[1]

    page = client.get(f"/api/v1{url}")
    assert "Darme de baja" in page.text
    db.refresh(user)
    assert user.marketing_emails is True  # GET never unsubscribes

    client.post(f"/api/v1{url}", data={"List-Unsubscribe": "One-Click"})
    db.refresh(user)
    assert user.marketing_emails is False

    bad = client.post(f"/api/v1/email/unsubscribe?u={user.id}&t=nope")
    assert "no es válido" not in bad.text and "not valid" in bad.text


def test_verification_decision_emails(client, db, outbox):
    admin = _superuser(client, db)
    owner = register(client, "kim", language="pt")
    _complete(db, "kim", social=True)
    _age(db, "kim", 10)
    req = VerificationRequest(profile_id=_user(db, "kim").profile.id, verification_type="creator")
    db.add(req)
    db.commit()
    outbox.clear()

    res = client.patch(
        f"/api/v1/admin/verification-requests/{req.id}",
        json={"status": "rejected", "note": "Falta perfil oficial"},
        headers=admin,
    )
    assert res.status_code == 200, res.text
    assert outbox[-1]["subject"] == "Sobre seu pedido de verificação"
    assert "Falta perfil oficial" in outbox[-1]["html"]
    assert owner


def test_admin_dry_run_and_preview(client, db, outbox):
    admin = _superuser(client, db)
    register(client, "dry")
    _age(db, "dry", 2)
    outbox.clear()
    res = client.post("/api/v1/admin/emails/lifecycle/run", json={"dry_run": True}, headers=admin)
    assert res.status_code == 200
    assert res.json()["by_kind"].get("complete_profile", 0) >= 1
    assert outbox == []

    page = client.get("/api/v1/admin/emails/preview/weekly_summary?lang=es", headers=admin)
    assert "Tus últimos 7 días" in page.text
    assert client.get("/api/v1/admin/emails/preview/nope", headers=admin).status_code == 404


def _signed(secret_b64: str, body: bytes, msg_id="msg_1", ts=None):
    import base64
    import hashlib
    import hmac
    import time

    ts = str(int(time.time()) if ts is None else ts)
    sig = base64.b64encode(
        hmac.new(base64.b64decode(secret_b64), f"{msg_id}.{ts}.".encode() + body, hashlib.sha256).digest()
    ).decode()
    return {"svix-id": msg_id, "svix-timestamp": ts, "svix-signature": f"v1,{sig}", "content-type": "application/json"}


def test_admin_logs_and_stats(client, db, outbox):
    admin = _superuser(client, db)
    register(client, "ana", language="es")
    res = client.get("/api/v1/admin/emails/logs?q=ana", headers=admin)
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["total"] == 1
    item = data["items"][0]
    assert (item["username"], item["kind"], item["status"]) == ("ana", "welcome", "sent")
    assert item["subject"].startswith("Bienvenido")

    assert client.get("/api/v1/admin/emails/logs?kind=password_reset", headers=admin).json()["total"] == 0
    stats = client.get("/api/v1/admin/emails/stats?days=7", headers=admin).json()
    assert stats["totals"]["sent"] == 2  # boss + ana welcome
    assert {r["kind"] for r in stats["by_kind"]} == {"welcome"}

    # Not for regular users.
    user = register(client, "plain")
    assert client.get("/api/v1/admin/emails/logs", headers=user).status_code == 403


def test_resend_webhook_tracks_delivery(client, db, outbox, monkeypatch):
    import base64
    import json

    from app.core.config import settings

    secret = base64.b64encode(b"super-secret-key-bytes").decode()
    monkeypatch.setattr(settings, "RESEND_WEBHOOK_SECRET", f"whsec_{secret}")
    register(client, "track")
    log = db.query(EmailLog).one()
    url = "/api/v1/email/webhook/resend"

    def event(kind):
        return json.dumps({"type": f"email.{kind}", "data": {"email_id": log.provider_id}}).encode()

    body = event("delivered")
    assert client.post(url, content=body, headers={**_signed(secret, body), "svix-signature": "v1,bad"}).status_code == 401
    assert client.post(url, content=body, headers=_signed(secret, body, ts=1)).status_code == 401  # too old

    for kind in ("clicked", "delivered"):  # out of order: delivered must not downgrade clicked
        body = event(kind)
        assert client.post(url, content=body, headers=_signed(secret, body)).status_code == 200
    db.refresh(log)
    assert log.delivery_status == "clicked"
    assert log.delivered_at and log.opened_at and log.clicked_at

    body = event("complained")
    client.post(url, content=body, headers=_signed(secret, body))
    db.refresh(log)
    assert log.delivery_status == "complained"
    assert _user(db, "track").marketing_emails is False


def test_webhook_off_without_secret(client):
    assert client.post("/api/v1/email/webhook/resend", content=b"{}").status_code == 404


class _FakeHTTPError(Exception):
    pass


def _http_error(code, body, retry_after=None):
    import io
    import urllib.error
    from email.message import Message

    headers = Message()
    if retry_after is not None:
        headers["retry-after"] = str(retry_after)
    return urllib.error.HTTPError(mailer.RESEND_URL, code, "err", headers, io.BytesIO(body.encode()))


def _fake_urlopen(responses, seen):
    import io
    import json

    class _Res(io.BytesIO):
        def __enter__(self):
            return self

        def __exit__(self, *a):
            return False

    def urlopen(req, timeout=None):
        seen.append(req.headers.get("Idempotency-key"))
        item = responses.pop(0)
        if isinstance(item, Exception):
            raise item
        return _Res(json.dumps(item).encode())

    return urlopen


def test_resend_429_is_retried_with_same_idempotency_key(monkeypatch):
    seen: list = []
    monkeypatch.setattr(mailer.time, "sleep", lambda s: None)
    monkeypatch.setattr(
        mailer.urllib.request,
        "urlopen",
        _fake_urlopen([_http_error(429, '{"name":"rate_limit_exceeded"}', retry_after=1), {"id": "abc"}], seen),
    )
    result = mailer._post_resend({"to": ["a@b.co"], "subject": "x"}, None)
    assert (result.status, result.provider_id) == ("sent", "abc")
    assert len(seen) == 2 and seen[0] == seen[1] and seen[0]


def test_bad_recipient_is_rejected_not_retried(monkeypatch):
    seen: list = []
    monkeypatch.setattr(mailer.time, "sleep", lambda s: None)
    monkeypatch.setattr(
        mailer.urllib.request,
        "urlopen",
        _fake_urlopen([_http_error(422, '{"message":"Invalid `to` field."}')], seen),
    )
    assert mailer._post_resend({"to": ["a@mail.bitlink.dev"], "subject": "x"}, "k").status == "rejected"
    assert len(seen) == 1


def test_throttle_spaces_requests(monkeypatch):
    from app.core.config import settings

    monkeypatch.setattr(settings, "RESEND_MAX_PER_SECOND", 4)
    slept: list = []
    monkeypatch.setattr(mailer.time, "sleep", lambda s: slept.append(s))
    mailer._throttle()
    mailer._throttle()
    assert slept and 0.2 < slept[-1] <= 0.25


def test_rejected_address_is_not_retried_by_lifecycle(client, db, monkeypatch):
    calls = []
    monkeypatch.setattr(
        mailer, "transport", lambda p, k=None: calls.append(p) or mailer.SendResult("rejected", error="422")
    )
    register(client, "ghost")
    assert len(calls) == 1  # welcome → Resend refused the address
    _age(db, "ghost", 2)
    run_lifecycle(db)
    run_lifecycle(db, now=datetime.now(timezone.utc) + timedelta(days=30))
    assert len(calls) == 1  # tips never try it again


def test_webhook_ignores_other_domains(client, db, outbox, monkeypatch):
    import base64
    import json

    from app.core.config import settings

    secret = base64.b64encode(b"k").decode()
    monkeypatch.setattr(settings, "RESEND_WEBHOOK_SECRET", f"whsec_{secret}")
    register(client, "other")
    log = db.query(EmailLog).one()
    body = json.dumps(
        {"type": "email.bounced", "data": {"email_id": log.provider_id, "from": "Shop <hi@othershop.com>"}}
    ).encode()
    res = client.post("/api/v1/email/webhook/resend", content=body, headers=_signed(secret, body))
    assert res.json().get("ignored") is True
    db.refresh(log)
    assert log.delivery_status is None


@pytest.mark.parametrize(
    "email",
    ["a@example.com", "a@EXAMPLE.org", "a@mail.example.net", "a@foo.test", "a@x.invalid", "a@test.com", "a@box.localhost"],
)
def test_signup_refuses_test_domains(client, email):
    res = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "password123", "username": "tester1", "display_name": "T"},
    )
    assert res.status_code == 422
    # .test/.invalid/.localhost are already refused by email-validator; the rest by our rule.
    assert "test addresses" in res.text or "special-use or reserved" in res.text


def test_real_domains_allowed():
    from app.services.email_domains import is_undeliverable

    assert not is_undeliverable("ana@gmail.com")
    assert not is_undeliverable("ana@examples.com")
    assert not is_undeliverable("ana@latest.com")


def test_never_sends_to_existing_test_address(client, db, outbox):
    register(client, "legacy")
    user = _user(db, "legacy")
    user.email = "legacy@example.com"  # account created before the rule
    db.commit()
    outbox.clear()
    log = mailer.send_email(db, user, "password_reset", cta_url="https://x")
    db.commit()
    assert outbox == []
    assert log.status == "rejected"
