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
    assert outbox[0]["to"] == ["maria@example.com"]
    assert outbox[0]["subject"].startswith("Bienvenido a Bitlink")
    assert "List-Unsubscribe" not in outbox[0].get("headers", {})
    log = db.query(EmailLog).one()
    assert (log.kind, log.language, log.status) == ("welcome", "es", "sent")


def test_password_reset_sends_link(client, db, outbox):
    register(client, "joao", language="pt")
    outbox.clear()
    client.post("/api/v1/auth/forgot-password", json={"email": "joao@example.com"})
    assert outbox[0]["subject"] == "Redefina sua senha do Bitlink"
    assert "/reset-password?token=" in outbox[0]["html"]
    # Unknown emails send nothing.
    client.post("/api/v1/auth/forgot-password", json={"email": "nobody@example.com"})
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
