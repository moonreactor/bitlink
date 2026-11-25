import re
from datetime import datetime
from typing import Literal
from urllib.parse import urlparse

from pydantic import BaseModel, Field, field_validator

from app.services.link_meta import normalize_url


def _evidence_url(raw: str) -> str:
    value = raw.strip()
    # "javascript:…", "mailto:…" etc. (normalize_url would turn them into https://javascript:…).
    # A colon followed by a digit is a port ("example.com:8080"), not a scheme.
    scheme = re.match(r"^([a-z][a-z0-9+.-]*):(?!\d)", value, re.I)
    if scheme and scheme.group(1).lower() not in ("http", "https"):
        raise ValueError("Links must start with http:// or https://")
    url = normalize_url(value)
    parsed = urlparse(url)
    try:
        parsed.port
    except ValueError as exc:
        raise ValueError(f"Invalid link: {raw}") from exc
    if not parsed.hostname or "." not in parsed.hostname:
        raise ValueError(f"Invalid link: {raw}")
    return url


class ProofResult(BaseModel):
    kind: Literal["page", "dns"]
    target: str
    found: bool
    error: str | None = None
    checked_at: datetime


class VerificationRequirement(BaseModel):
    key: str
    met: bool
    required: bool = True


class MyVerificationRequest(BaseModel):
    id: str
    status: str
    source: str
    verification_type: str
    created_at: datetime
    reviewed_at: datetime | None = None
    # Note from the team when rejected.
    decision_note: str | None = None
    proof_results: list[ProofResult] | None = None


class MyVerificationOut(BaseModel):
    is_verified: bool
    verification_type: str | None = None
    verified_at: datetime | None = None
    proof_code: str
    requirements: list[VerificationRequirement]
    can_request: bool
    # requirements | pending | cooldown | verified | flagged; None when can_request is True.
    blocked_reason: str | None = None
    cooldown_until: datetime | None = None
    latest_request: MyVerificationRequest | None = None


class VerificationRequestCreate(BaseModel):
    verification_type: Literal["creator", "public_figure", "brand", "organization"]
    reason: str | None = Field(default=None, max_length=1000)
    evidence_urls: list[str] = Field(min_length=1, max_length=5)

    @field_validator("evidence_urls")
    @classmethod
    def _urls(cls, v: list[str]) -> list[str]:
        out: list[str] = []
        for raw in v:
            if not raw.strip():
                continue
            if len(raw) > 500:
                raise ValueError("Links must be shorter than 500 characters")
            out.append(_evidence_url(raw))
        if not out:
            raise ValueError("Add at least one link that shows the code")
        return list(dict.fromkeys(out))

    @field_validator("reason")
    @classmethod
    def _reason(cls, v: str | None) -> str | None:
        return (v or "").strip() or None
