"""Email preferences, unsubscribe links and the superadmin email tools."""

import html
from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, Form, HTTPException, Query
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.deps import get_current_superuser, get_current_user
from app.db.session import get_db
from app.models.email_log import EmailLog
from app.models.user import User
from app.services.email_templates import EMAIL_KINDS, LANGUAGES, pick_language, render
from app.services.lifecycle_emails import run_lifecycle
from app.services.mailer import send_email, valid_unsubscribe_token, web_url

router = APIRouter(tags=["emails"])


class EmailPreferences(BaseModel):
    marketing_emails: bool


@router.get("/me/email-preferences", response_model=EmailPreferences)
def get_preferences(current_user: User = Depends(get_current_user)) -> EmailPreferences:
    return EmailPreferences(marketing_emails=current_user.marketing_emails)


@router.put("/me/email-preferences", response_model=EmailPreferences)
def set_preferences(
    payload: EmailPreferences,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> EmailPreferences:
    current_user.marketing_emails = payload.marketing_emails
    db.commit()
    return EmailPreferences(marketing_emails=current_user.marketing_emails)


# ---------------------------------------------------------------- unsubscribe (no login)

_UNSUB_COPY = {
    "en": {
        "title": "Unsubscribe",
        "ask": "Stop receiving tips, reminders and weekly summaries from Bitlink? You'll still get emails about your account (like password resets).",
        "button": "Unsubscribe",
        "done": "Done — you won't get tips or summaries anymore. You can turn them back on in Settings.",
        "invalid": "This unsubscribe link is not valid.",
        "back": "Go to Bitlink",
    },
    "es": {
        "title": "Darse de baja",
        "ask": "¿Dejar de recibir consejos, recordatorios y resúmenes semanales de Bitlink? Seguirás recibiendo emails sobre tu cuenta (como restablecer la contraseña).",
        "button": "Darme de baja",
        "done": "Listo: ya no recibirás consejos ni resúmenes. Puedes volver a activarlos en Configuración.",
        "invalid": "Este link para darse de baja no es válido.",
        "back": "Ir a Bitlink",
    },
    "pt": {
        "title": "Cancelar inscrição",
        "ask": "Parar de receber dicas, lembretes e resumos semanais do Bitlink? Você continuará recebendo emails sobre sua conta (como redefinir a senha).",
        "button": "Cancelar inscrição",
        "done": "Pronto — você não receberá mais dicas nem resumos. Dá para reativar em Configurações.",
        "invalid": "Este link de cancelamento não é válido.",
        "back": "Ir para o Bitlink",
    },
}


def _page(lang: str, message: str, form: str = "") -> HTMLResponse:
    c = _UNSUB_COPY[lang]
    return HTMLResponse(
        f"""<!doctype html><html lang="{lang}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>{html.escape(c['title'])} · Bitlink</title></head>
<body style="margin:0;background:#f6f5fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<main style="max-width:460px;margin:64px auto;padding:32px 24px;background:#fff;border-radius:18px;border:1px solid #ece9f7">
<div style="font-size:22px;font-weight:800;color:#5b21b6;margin-bottom:16px">bitlink</div>
<h1 style="font-size:22px;margin:0 0 12px;color:#111827">{html.escape(c['title'])}</h1>
<p style="font-size:16px;line-height:1.55;color:#374151">{html.escape(message)}</p>{form}
<p style="margin-top:24px"><a href="{html.escape(web_url('/'))}" style="color:#6d28d9">{html.escape(c['back'])}</a></p>
</main></body></html>"""
    )


def _user_from_token(db: Session, u: str, t: str) -> User | None:
    try:
        user_id = UUID(u)
    except ValueError:
        return None
    if not valid_unsubscribe_token(user_id, t):
        return None
    return db.get(User, user_id)


@router.get("/email/unsubscribe", response_class=HTMLResponse, include_in_schema=False)
def unsubscribe_page(
    u: str = Query(""), t: str = Query(""), l: str = Query("en"), db: Session = Depends(get_db)
) -> HTMLResponse:
    # GET only shows a button: link scanners in mail servers open URLs and must not unsubscribe.
    lang = pick_language(l)
    c = _UNSUB_COPY[lang]
    if _user_from_token(db, u, t) is None:
        return _page(lang, c["invalid"])
    form = (
        '<form method="post"><input type="hidden" name="u" value="{u}"><input type="hidden" name="t" value="{t}">'
        '<input type="hidden" name="l" value="{l}"><button type="submit" style="margin-top:8px;padding:12px 24px;'
        'border:0;border-radius:999px;background:#6d28d9;color:#fff;font-size:15px;font-weight:700;cursor:pointer">'
        "{label}</button></form>"
    ).format(u=html.escape(u), t=html.escape(t), l=lang, label=html.escape(c["button"]))
    return _page(lang, c["ask"], form)


@router.post("/email/unsubscribe", response_class=HTMLResponse, include_in_schema=False)
def unsubscribe(
    u: str = Query(""),
    t: str = Query(""),
    l: str = Query("en"),
    form_u: str | None = Form(None, alias="u"),
    form_t: str | None = Form(None, alias="t"),
    form_l: str | None = Form(None, alias="l"),
    db: Session = Depends(get_db),
) -> HTMLResponse:
    """Our form and RFC 8058 one-click (mail clients POST to the List-Unsubscribe URL)."""
    lang = pick_language(form_l or l)
    user = _user_from_token(db, form_u or u, form_t or t)
    if user is None:
        return _page(lang, _UNSUB_COPY[lang]["invalid"])
    user.marketing_emails = False
    db.commit()
    return _page(lang, _UNSUB_COPY[lang]["done"])


# ---------------------------------------------------------------- superadmin

admin = APIRouter(prefix="/admin/emails", tags=["admin"])


class EmailKindStats(BaseModel):
    kind: str
    sent: int
    failed: int
    skipped: int


class EmailStats(BaseModel):
    configured: bool
    lifecycle_enabled: bool
    sender: str
    last_30_days: list[EmailKindStats]
    unsubscribed_users: int


@admin.get("/stats", response_model=EmailStats)
def email_stats(_: User = Depends(get_current_superuser), db: Session = Depends(get_db)) -> EmailStats:
    since = datetime.now(timezone.utc) - timedelta(days=30)
    rows = (
        db.query(EmailLog.kind, EmailLog.status, func.count(EmailLog.id))
        .filter(EmailLog.created_at >= since)
        .group_by(EmailLog.kind, EmailLog.status)
        .all()
    )
    by_kind: dict[str, dict[str, int]] = {}
    for kind, status_, n in rows:
        by_kind.setdefault(kind, {"sent": 0, "failed": 0, "skipped": 0})[status_] = n
    return EmailStats(
        configured=bool(settings.RESEND_API_KEY),
        lifecycle_enabled=settings.LIFECYCLE_EMAILS_ENABLED,
        sender=settings.EMAIL_FROM,
        last_30_days=[EmailKindStats(kind=k, **v) for k, v in sorted(by_kind.items())],
        unsubscribed_users=db.query(func.count(User.id)).filter(User.marketing_emails.is_(False)).scalar() or 0,
    )


class LifecycleRunRequest(BaseModel):
    dry_run: bool = True
    limit: int | None = Field(default=None, ge=1, le=1000)


class LifecycleRunResult(BaseModel):
    dry_run: bool
    checked: int
    by_kind: dict[str, int]
    sent: int
    failed: int
    capped: bool


@admin.post("/lifecycle/run", response_model=LifecycleRunResult)
def run_lifecycle_now(
    payload: LifecycleRunRequest,
    _: User = Depends(get_current_superuser),
    db: Session = Depends(get_db),
) -> LifecycleRunResult:
    """Dry run (default) shows who would get what; dry_run=false sends now."""
    if not payload.dry_run and not settings.RESEND_API_KEY:
        raise HTTPException(status_code=400, detail="RESEND_API_KEY is not configured")
    report = run_lifecycle(db, dry_run=payload.dry_run, limit=payload.limit)
    return LifecycleRunResult(
        dry_run=payload.dry_run,
        checked=report.checked,
        by_kind=report.planned,
        sent=report.sent,
        failed=report.failed,
        capped=report.capped,
    )


_SAMPLE_CTX = {
    "missing": ["avatar", "bio"],
    "link_count": 2,
    "note": "Please add a link to an official profile that mentions your Bitlink page.",
    "alert_count": 2,
    "subject": "lookalike_username",
    "views": 128,
    "clicks": 41,
    "top_link": "My latest video",
}


def _kind(kind: str) -> str:
    if kind not in EMAIL_KINDS:
        raise HTTPException(status_code=404, detail=f"Unknown email kind. Options: {', '.join(EMAIL_KINDS)}")
    return kind


@admin.get("/preview/{kind}", response_class=HTMLResponse)
def preview_email(
    kind: str,
    lang: str = Query("en"),
    _: User = Depends(get_current_superuser),
) -> HTMLResponse:
    """Render an email with sample data (nothing is sent)."""
    ctx = {"name": "Lucía", "username": "lucia", "profile_url": "bitlink.click/lucia", **_SAMPLE_CTX}
    rendered = render(_kind(kind), lang, ctx, cta_url=web_url("/dashboard"), unsubscribe_url=web_url("/#unsubscribe"))
    return HTMLResponse(rendered.html)


class TestEmailRequest(BaseModel):
    kind: str
    language: str | None = None


@admin.post("/test")
def send_test_email(
    payload: TestEmailRequest,
    current_user: User = Depends(get_current_superuser),
    db: Session = Depends(get_db),
) -> dict:
    """Send one email of ``kind`` with sample data to the superadmin themself."""
    kind = _kind(payload.kind)
    profile = current_user.profile
    original = profile.language if profile else None
    if profile and payload.language in LANGUAGES:
        profile.language = payload.language
    was_opted_in = current_user.marketing_emails
    current_user.marketing_emails = True
    try:
        log = send_email(db, current_user, kind, ctx=dict(_SAMPLE_CTX))
    finally:
        current_user.marketing_emails = was_opted_in
        if profile:
            profile.language = original
    db.commit()
    return {"status": log.status if log else "not_sent", "error": log.error if log else None, "to": current_user.email}
