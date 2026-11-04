from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.profile import get_user_profile
from app.core.config import settings
from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.profile import Profile
from app.models.user import User
from app.schemas.domain import DomainOut, DomainSetRequest, DomainVerifyResponse, domain_payload
from app.services.domain import domain_token_present, new_verify_token, normalize_domain

router = APIRouter(prefix="/me/domain", tags=["domain"])


def _cname_target() -> str:
    # Host visitors should CNAME to (web app), stripped of scheme/path.
    raw = (settings.PUBLIC_WEB_URL or "").strip()
    raw = raw.removeprefix("https://").removeprefix("http://").split("/")[0]
    return raw or "bitlink.click"


@router.get("", response_model=DomainOut)
def get_domain(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DomainOut:
    profile = get_user_profile(db, current_user)
    return domain_payload(
        profile.custom_domain,
        bool(profile.custom_domain_verified),
        profile.custom_domain_verify_token,
        _cname_target(),
    )


@router.put("", response_model=DomainOut)
def set_domain(
    payload: DomainSetRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DomainOut:
    profile = get_user_profile(db, current_user)
    domain = payload.domain

    taken = (
        db.query(Profile)
        .filter(Profile.custom_domain == domain, Profile.id != profile.id)
        .first()
    )
    if taken:
        raise HTTPException(status_code=400, detail="Domain already in use")

    # Reuse token if same domain; otherwise mint a fresh challenge.
    if profile.custom_domain != domain:
        profile.custom_domain = domain
        profile.custom_domain_verified = False
        profile.custom_domain_verify_token = new_verify_token()
    elif not profile.custom_domain_verify_token:
        profile.custom_domain_verify_token = new_verify_token()
        profile.custom_domain_verified = False

    db.commit()
    db.refresh(profile)
    return domain_payload(
        profile.custom_domain,
        bool(profile.custom_domain_verified),
        profile.custom_domain_verify_token,
        _cname_target(),
    )


@router.delete("", response_model=DomainOut, status_code=status.HTTP_200_OK)
def clear_domain(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DomainOut:
    profile = get_user_profile(db, current_user)
    profile.custom_domain = None
    profile.custom_domain_verified = False
    profile.custom_domain_verify_token = None
    db.commit()
    return domain_payload(None, False, None, _cname_target())


@router.post("/verify", response_model=DomainVerifyResponse)
def verify_domain(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DomainVerifyResponse:
    profile = get_user_profile(db, current_user)
    if not profile.custom_domain or not profile.custom_domain_verify_token:
        raise HTTPException(status_code=400, detail="Set a custom domain first")

    try:
        normalize_domain(profile.custom_domain)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    ok = domain_token_present(profile.custom_domain, profile.custom_domain_verify_token)
    if ok:
        profile.custom_domain_verified = True
        db.commit()
        db.refresh(profile)
        return DomainVerifyResponse(
            verified=True,
            message="Domain verified. Point a CNAME to the Bitlink web host, then wait for DNS.",
            custom_domain=profile.custom_domain,
            custom_domain_verified=True,
            custom_domain_verify_token=profile.custom_domain_verify_token,
            txt_hostnames=domain_payload(
                profile.custom_domain, True, profile.custom_domain_verify_token
            ).txt_hostnames,
        )

    profile.custom_domain_verified = False
    db.commit()
    return DomainVerifyResponse(
        verified=False,
        message=(
            "TXT record not found yet. Add the verification token as a TXT record "
            "and try again (DNS can take a few minutes)."
        ),
        custom_domain=profile.custom_domain,
        custom_domain_verified=False,
        custom_domain_verify_token=profile.custom_domain_verify_token,
        txt_hostnames=domain_payload(
            profile.custom_domain, False, profile.custom_domain_verify_token
        ).txt_hostnames,
    )
