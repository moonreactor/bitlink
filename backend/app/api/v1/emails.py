"""Email preferences, unsubscribe links and the superadmin email tools."""

import base64
import hashlib
import hmac
import html
import json
import logging
import time
from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, Form, HTTPException, Query, Request
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.deps import get_current_superuser, get_current_user
from app.db.session import get_db
from app.models.email_log import EmailLog
from app.models.profile import Profile
from app.models.user import User
from app.services.email_templates import EMAIL_KINDS, LANGUAGES, pick_language, render
from app.services.lifecycle_emails import run_lifecycle
from app.services.mailer import send_email, valid_unsubscribe_token, web_url

router = APIRouter(tags=["emails"])
logger = logging.getLogger("bitlink.email")


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


# ---------------------------------------------------------------- Resend webhook

WEBHOOK_TOLERANCE_SECONDS = 5 * 60
# Rank so a late "delivered" event never overwrites "clicked" or "bounced".
_RANK = {"delayed": 1, "delivered": 2, "opened": 3, "clicked": 4, "failed": 5, "bounced": 5, "complained": 6}


def _domain(address: str) -> str:
    """"Bitlink <hola@bitlink.click>" → "bitlink.click"."""
    return address.strip().rstrip(">").rsplit("@", 1)[-1].strip().lower()


def _valid_svix_signature(secret: str, headers, body: bytes) -> bool:
    """Resend signs webhooks the Svix way: HMAC-SHA256 of "id.timestamp.body", base64."""
    msg_id = headers.get("svix-id") or ""
    timestamp = headers.get("svix-timestamp") or ""
    signatures = headers.get("svix-signature") or ""
    if not (msg_id and timestamp and signatures):
        return False
    try:
        if abs(time.time() - int(timestamp)) > WEBHOOK_TOLERANCE_SECONDS:
            return False
        key = base64.b64decode(secret.split("_", 1)[1] if secret.startswith("whsec_") else secret)
    except ValueError:
        return False
    expected = base64.b64encode(
        hmac.new(key, f"{msg_id}.{timestamp}.".encode() + body, hashlib.sha256).digest()
    ).decode()
    return any(
        hmac.compare_digest(expected, sig.split(",", 1)[1])
        for sig in signatures.split()
        if sig.startswith("v1,")
    )


@router.post("/email/webhook/resend", include_in_schema=False)
async def resend_webhook(request: Request, db: Session = Depends(get_db)) -> dict:
    secret = settings.RESEND_WEBHOOK_SECRET
    if not secret:
        raise HTTPException(status_code=404, detail="Not found")
    body = await request.body()
    if not _valid_svix_signature(secret, request.headers, body):
        raise HTTPException(status_code=401, detail="Invalid signature")
    try:
        event = json.loads(body)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    state = str(event.get("type", "")).removeprefix("email.").replace("delivery_delayed", "delayed")
    data = event.get("data") or {}
    email_id = str(data.get("email_id") or "")
    # One Resend account can send for several domains/apps and the webhook gets all of them:
    # only events for our sender's domain matter (and below, only email ids we logged).
    sender = str(data.get("from") or "")
    if sender and _domain(sender) != _domain(settings.EMAIL_FROM):
        return {"ok": True, "ignored": True}
    if state not in _RANK or not email_id:
        return {"ok": True, "ignored": True}
    log = db.query(EmailLog).filter(EmailLog.provider_id == email_id).first()
    if log is None:
        return {"ok": True, "ignored": True}

    now = datetime.now(timezone.utc)
    stamp = {"delivered": "delivered_at", "opened": "opened_at", "clicked": "clicked_at", "bounced": "bounced_at"}
    if state in stamp and getattr(log, stamp[state]) is None:
        setattr(log, stamp[state], now)
    if state in ("opened", "clicked") and log.delivered_at is None:
        log.delivered_at = now
    if state == "clicked" and log.opened_at is None:
        log.opened_at = now
    if _RANK[state] >= _RANK.get(log.delivery_status or "", 0):
        log.delivery_status = state
    if state == "failed" or state == "bounced":
        reason = (event.get("data") or {}).get("bounce", {}) or {}
        log.error = (str(reason.get("message") or reason.get("type") or state))[:300]
    if state in ("bounced", "complained"):
        # Stop tips to addresses that bounce or mark us as spam (protects sender reputation).
        user = db.get(User, log.user_id)
        if user is not None:
            user.marketing_emails = False
    db.commit()
    return {"ok": True}


# ---------------------------------------------------------------- superadmin

admin = APIRouter(prefix="/admin/emails", tags=["admin"])


class EmailKindStats(BaseModel):
    kind: str
    total: int = 0
    sent: int = 0
    failed: int = 0
    rejected: int = 0
    skipped: int = 0
    delivered: int = 0
    opened: int = 0
    clicked: int = 0
    bounced: int = 0
    complained: int = 0


class EmailStats(BaseModel):
    configured: bool
    webhook_configured: bool
    lifecycle_enabled: bool
    lifecycle_max_per_run: int
    sender: str
    days: int
    totals: EmailKindStats
    by_kind: list[EmailKindStats]
    unsubscribed_users: int
    first_email_at: datetime | None


@admin.get("/stats", response_model=EmailStats)
def email_stats(
    days: int = Query(30, ge=1, le=3650),
    _: User = Depends(get_current_superuser),
    db: Session = Depends(get_db),
) -> EmailStats:
    since = datetime.now(timezone.utc) - timedelta(days=days)
    by_kind: dict[str, EmailKindStats] = {}
    totals = EmailKindStats(kind="all")

    def bump(kind: str, field: str, n: int) -> None:
        row = by_kind.setdefault(kind, EmailKindStats(kind=kind))
        setattr(row, field, getattr(row, field) + n)
        setattr(totals, field, getattr(totals, field) + n)

    base = db.query(EmailLog).filter(EmailLog.created_at >= since)
    for kind, status_, n in (
        base.with_entities(EmailLog.kind, EmailLog.status, func.count(EmailLog.id))
        .group_by(EmailLog.kind, EmailLog.status)
        .all()
    ):
        bump(kind, "total", n)
        if status_ in ("sent", "failed", "rejected", "skipped"):
            bump(kind, status_, n)
    # Each later state implies the earlier ones (a click was also opened and delivered).
    timestamps = {
        "delivered": EmailLog.delivered_at,
        "opened": EmailLog.opened_at,
        "clicked": EmailLog.clicked_at,
        "bounced": EmailLog.bounced_at,
    }
    for field, column in timestamps.items():
        for kind, n in (
            base.filter(column.is_not(None))
            .with_entities(EmailLog.kind, func.count(EmailLog.id))
            .group_by(EmailLog.kind)
            .all()
        ):
            bump(kind, field, n)
    for kind, n in (
        base.filter(EmailLog.delivery_status == "complained")
        .with_entities(EmailLog.kind, func.count(EmailLog.id))
        .group_by(EmailLog.kind)
        .all()
    ):
        bump(kind, "complained", n)

    return EmailStats(
        configured=bool(settings.RESEND_API_KEY),
        webhook_configured=bool(settings.RESEND_WEBHOOK_SECRET),
        lifecycle_enabled=settings.LIFECYCLE_EMAILS_ENABLED,
        lifecycle_max_per_run=settings.LIFECYCLE_MAX_PER_RUN,
        sender=settings.EMAIL_FROM,
        days=days,
        totals=totals,
        by_kind=sorted(by_kind.values(), key=lambda r: -r.total),
        unsubscribed_users=db.query(func.count(User.id)).filter(User.marketing_emails.is_(False)).scalar() or 0,
        first_email_at=db.query(func.min(EmailLog.created_at)).scalar(),
    )


class EmailLogItem(BaseModel):
    id: UUID
    user_id: UUID
    email: str
    username: str | None
    kind: str
    language: str
    subject: str | None
    status: str
    delivery_status: str | None
    error: str | None
    provider_id: str | None
    created_at: datetime
    delivered_at: datetime | None
    opened_at: datetime | None
    clicked_at: datetime | None
    bounced_at: datetime | None


class EmailLogList(BaseModel):
    items: list[EmailLogItem]
    total: int
    page: int
    page_size: int


@admin.get("/logs", response_model=EmailLogList)
def email_logs(
    kind: str | None = None,
    status: str | None = Query(None, description="sent | failed | rejected | skipped"),
    delivery: str | None = Query(None, description="delivered | opened | clicked | bounced | complained | pending"),
    q: str | None = Query(None, description="email or username"),
    user_id: UUID | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    _: User = Depends(get_current_superuser),
    db: Session = Depends(get_db),
) -> EmailLogList:
    query = (
        db.query(EmailLog, User.email, Profile.username)
        .join(User, User.id == EmailLog.user_id)
        .outerjoin(Profile, Profile.user_id == User.id)
    )
    if kind:
        query = query.filter(EmailLog.kind == kind)
    if status:
        query = query.filter(EmailLog.status == status)
    if delivery == "pending":
        query = query.filter(EmailLog.status == "sent", EmailLog.delivery_status.is_(None))
    elif delivery == "opened":
        query = query.filter(EmailLog.opened_at.is_not(None))
    elif delivery == "clicked":
        query = query.filter(EmailLog.clicked_at.is_not(None))
    elif delivery:
        query = query.filter(EmailLog.delivery_status == delivery)
    if user_id:
        query = query.filter(EmailLog.user_id == user_id)
    if q and q.strip():
        term = f"%{q.strip().lower().lstrip('@')}%"
        query = query.filter(or_(func.lower(User.email).like(term), func.lower(Profile.username).like(term)))
    total = query.count()
    rows = (
        query.order_by(EmailLog.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return EmailLogList(
        items=[
            EmailLogItem(
                id=log.id,
                user_id=log.user_id,
                email=email,
                username=username,
                kind=log.kind,
                language=log.language,
                subject=log.subject,
                status=log.status,
                delivery_status=log.delivery_status,
                error=log.error,
                provider_id=log.provider_id,
                created_at=log.created_at,
                delivered_at=log.delivered_at,
                opened_at=log.opened_at,
                clicked_at=log.clicked_at,
                bounced_at=log.bounced_at,
            )
            for log, email, username in rows
        ],
        total=total,
        page=page,
        page_size=page_size,
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
