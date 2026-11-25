"""Sending email through Resend, and the account emails the API triggers directly.

Without ``RESEND_API_KEY`` nothing leaves the server: the email is logged (status ``skipped``) so
local development and tests work the same way.
"""

from __future__ import annotations

import hashlib
import hmac
import json
import logging
import urllib.error
import urllib.request
import uuid
from dataclasses import dataclass
from urllib.parse import urlencode

from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.email_log import EmailLog
from app.models.profile import Profile
from app.models.user import User
from app.services.email_templates import MARKETING_KINDS, pick_language, render

logger = logging.getLogger("bitlink.email")

RESEND_URL = "https://api.resend.com/emails"
TIMEOUT_SECONDS = 10


@dataclass
class SendResult:
    status: str  # sent | failed | skipped
    provider_id: str | None = None
    error: str | None = None


def _post_resend(payload: dict, idempotency_key: str | None) -> SendResult:
    headers = {
        "Authorization": f"Bearer {settings.RESEND_API_KEY}",
        "Content-Type": "application/json",
        "User-Agent": "bitlink-api/1.0",
    }
    if idempotency_key:
        headers["Idempotency-Key"] = idempotency_key[:256]
    req = urllib.request.Request(
        RESEND_URL, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT_SECONDS) as res:  # noqa: S310 - fixed https URL
            data = json.loads(res.read() or b"{}")
            return SendResult("sent", provider_id=str(data.get("id") or "")[:64] or None)
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", "replace")[:250]
        logger.warning("Resend rejected email (%s): %s", exc.code, detail)
        return SendResult("failed", error=f"{exc.code}: {detail}")
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        logger.warning("Resend request failed: %s", exc)
        return SendResult("failed", error=str(exc)[:300])


def transport(payload: dict, idempotency_key: str | None = None) -> SendResult:
    """Hand the email to Resend. Tests replace this function."""
    if not settings.RESEND_API_KEY:
        logger.info("Email not sent (no RESEND_API_KEY): %s → %s", payload["subject"], payload["to"])
        return SendResult("skipped")
    return _post_resend(payload, idempotency_key)


# ---------------------------------------------------------------- unsubscribe links


def unsubscribe_token(user_id: uuid.UUID | str) -> str:
    msg = f"unsubscribe:{user_id}".encode()
    return hmac.new(settings.SECRET_KEY.encode(), msg, hashlib.sha256).hexdigest()[:32]


def valid_unsubscribe_token(user_id: uuid.UUID | str, token: str) -> bool:
    return hmac.compare_digest(unsubscribe_token(user_id), token or "")


def unsubscribe_url(user: User, language: str) -> str:
    query = urlencode({"u": str(user.id), "t": unsubscribe_token(user.id), "l": language})
    return f"{settings.public_api_base}/api/v1/email/unsubscribe?{query}"


# ---------------------------------------------------------------- sending


def web_url(path: str = "") -> str:
    return f"{settings.PUBLIC_WEB_URL.rstrip('/')}{path}"


def profile_url(profile: Profile) -> str:
    return web_url(f"/{profile.username}")


def send_email(
    db: Session,
    user: User,
    kind: str,
    *,
    cta_path: str | None = None,
    cta_url: str | None = None,
    ctx: dict | None = None,
    profile: Profile | None = None,
    idempotency_key: str | None = None,
) -> EmailLog | None:
    """Render ``kind`` in the profile's language, send it and log it (the caller commits).

    Returns None when the user cannot get it (inactive, or opted out of marketing emails).
    """
    if not user.is_active:
        return None
    if kind in MARKETING_KINDS and not user.marketing_emails:
        return None
    profile = profile or user.profile
    lang = pick_language(profile.language if profile else None)
    context = {"name": (profile.display_name if profile else "") or user.email.split("@")[0]}
    if profile:
        context.update(username=profile.username, profile_url=profile_url(profile).split("://")[-1])
    context.update(ctx or {})

    unsub = unsubscribe_url(user, lang) if kind in MARKETING_KINDS else None
    rendered = render(kind, lang, context, cta_url=cta_url or web_url(cta_path or "/dashboard"), unsubscribe_url=unsub)
    payload: dict = {
        "from": settings.EMAIL_FROM,
        "to": [user.email],
        "subject": rendered.subject,
        "html": rendered.html,
        "text": rendered.text,
        "tags": [{"name": "kind", "value": kind}, {"name": "lang", "value": lang}],
    }
    if settings.EMAIL_REPLY_TO:
        payload["reply_to"] = settings.EMAIL_REPLY_TO
    if unsub:
        # RFC 8058 one-click unsubscribe (Gmail / Yahoo bulk sender rules).
        payload["headers"] = {
            "List-Unsubscribe": f"<{unsub}>",
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        }

    result = transport(payload, idempotency_key)
    log = EmailLog(
        user_id=user.id,
        kind=kind,
        language=lang,
        status=result.status,
        provider_id=result.provider_id,
        error=result.error,
        subject=rendered.subject[:200],
    )
    db.add(log)
    return log


def send_in_background(user_id: uuid.UUID, kind: str, **kwargs) -> None:
    """For FastAPI BackgroundTasks: own session, never raises into the request."""
    db = SessionLocal()
    try:
        user = db.get(User, user_id)
        if user is not None:
            send_email(db, user, kind, **kwargs)
            db.commit()
    except Exception:  # noqa: BLE001 - an email problem must never break the request
        logger.exception("Sending %s email failed", kind)
        db.rollback()
    finally:
        db.close()
