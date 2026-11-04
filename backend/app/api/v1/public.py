from uuid import UUID

from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from sqlalchemy.orm import Session, joinedload

from app.core.security import verify_password
from app.db.session import get_db
from app.models.analytics import LinkClick, PageView
from app.models.link import Link
from app.models.profile import Profile
from app.models.subscriber import Subscriber
from app.schemas.analytics import ClickRequest, ClickResponse, SubscribeRequest, TrackMeta, UnlockProfileRequest
from app.schemas.link import PublicLinkOut
from app.schemas.public import PublicProfileOut
from app.schemas.social import SocialLinkOut
from app.services.analytics import detect_device, hash_visitor, normalize_referrer
from app.services.scheduling import is_link_visible
from app.services.youtube import extract_youtube_video_id

router = APIRouter(prefix="/public", tags=["public"])


def _get_profile(db: Session, username: str) -> Profile:
    profile = (
        db.query(Profile)
        .options(joinedload(Profile.links), joinedload(Profile.social_links))
        .filter(Profile.username == username.lower())
        .first()
    )
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


def _client_meta(request: Request, referrer: str | None, visitor_id: str | None) -> dict:
    ua = request.headers.get("user-agent")
    ip = request.client.host if request.client else None
    country = request.headers.get("cf-ipcountry") or request.headers.get("x-country-code")
    return {
        "visitor_hash": hash_visitor(visitor_id, ua, ip),
        "referrer": normalize_referrer(referrer or request.headers.get("referer")),
        "user_agent": ua,
        "country": country[:2].upper() if country else None,
        "device": detect_device(ua),
    }


@router.get("/{username}", response_model=PublicProfileOut)
def get_public_profile(
    username: str,
    unlock_token: str | None = Header(default=None, alias="X-Profile-Unlock"),
    db: Session = Depends(get_db),
) -> PublicProfileOut:
    profile = _get_profile(db, username)
    is_locked = bool(profile.profile_password_hash)
    unlocked = False
    if is_locked and unlock_token:
        unlocked = verify_password(unlock_token, profile.profile_password_hash)

    if is_locked and not unlocked:
        return PublicProfileOut(
            username=profile.username,
            display_name=profile.display_name,
            bio=None,
            avatar_url=profile.avatar_url,
            theme_json=profile.theme_json or {},
            seo_title=profile.seo_title,
            seo_description=profile.seo_description,
            remove_branding=profile.remove_branding,
            show_email_capture=False,
            is_locked=True,
            redirect_url=None,
            background_music_enabled=False,
            background_music_video_id=None,
            links=[],
            social_links=[],
        )

    visible_links = [l for l in profile.links if is_link_visible(l)]
    redirect_url = None
    if profile.redirect_link_id:
        for link in visible_links:
            if link.id == profile.redirect_link_id and not link.lock_code_hash:
                redirect_url = link.url
                break

    # Featured links first, then keep relative order within each group
    ordered = sorted(visible_links, key=lambda l: (0 if l.is_featured else 1, l.position))
    public_links = [
        PublicLinkOut(
            id=l.id,
            title=l.title,
            url=None if l.lock_code_hash else l.url,
            thumbnail_url=l.thumbnail_url,
            icon=l.icon,
            animation=l.animation or "none",
            is_featured=l.is_featured,
            has_lock=bool(l.lock_code_hash),
        )
        for l in ordered
    ]

    return PublicProfileOut(
        username=profile.username,
        display_name=profile.display_name,
        bio=profile.bio,
        avatar_url=profile.avatar_url,
        theme_json=profile.theme_json or {},
        seo_title=profile.seo_title,
        seo_description=profile.seo_description,
        remove_branding=profile.remove_branding,
        show_email_capture=profile.show_email_capture,
        is_locked=False,
        redirect_url=redirect_url,
        background_music_enabled=bool(
            profile.background_music_enabled and profile.background_music_url
        ),
        background_music_video_id=(
            extract_youtube_video_id(profile.background_music_url)
            if profile.background_music_enabled
            else None
        ),
        links=public_links,
        social_links=[
            SocialLinkOut.model_validate(s) for s in sorted(profile.social_links, key=lambda x: x.position)
        ],
    )


@router.post("/{username}/unlock")
def unlock_profile(
    username: str,
    payload: UnlockProfileRequest,
    db: Session = Depends(get_db),
) -> dict:
    profile = _get_profile(db, username)
    if not profile.profile_password_hash:
        return {"unlocked": True}
    if not verify_password(payload.password, profile.profile_password_hash):
        raise HTTPException(status_code=401, detail="Invalid password")
    return {"unlocked": True, "unlock_token": payload.password}


@router.post("/{username}/view", status_code=status.HTTP_204_NO_CONTENT)
def track_view(
    username: str,
    request: Request,
    payload: TrackMeta | None = None,
    db: Session = Depends(get_db),
) -> None:
    profile = _get_profile(db, username)
    if profile.profile_password_hash:
        return
    meta = _client_meta(
        request,
        payload.referrer if payload else None,
        payload.visitor_id if payload else None,
    )
    db.add(PageView(profile_id=profile.id, **meta))
    db.commit()


@router.post("/{username}/links/{link_id}/click", response_model=ClickResponse)
def track_click(
    username: str,
    link_id: UUID,
    request: Request,
    payload: ClickRequest,
    db: Session = Depends(get_db),
) -> ClickResponse:
    profile = _get_profile(db, username)
    link = db.query(Link).filter(Link.id == link_id, Link.profile_id == profile.id).first()
    if link is None or not is_link_visible(link):
        raise HTTPException(status_code=404, detail="Link not found")

    if link.lock_code_hash:
        if not payload.unlock_code or not verify_password(payload.unlock_code, link.lock_code_hash):
            raise HTTPException(status_code=401, detail="Invalid unlock code")

    meta = _client_meta(request, payload.referrer, payload.visitor_id)
    db.add(LinkClick(link_id=link.id, profile_id=profile.id, **meta))
    db.commit()
    return ClickResponse(url=link.url, unlocked=True)


@router.post("/{username}/subscribe", status_code=status.HTTP_201_CREATED)
def subscribe(
    username: str,
    payload: SubscribeRequest,
    db: Session = Depends(get_db),
) -> dict:
    profile = _get_profile(db, username)
    if not profile.show_email_capture:
        raise HTTPException(status_code=400, detail="Email capture disabled")

    existing = (
        db.query(Subscriber)
        .filter(Subscriber.profile_id == profile.id, Subscriber.email == payload.email.lower())
        .first()
    )
    if existing:
        return {"ok": True, "already_subscribed": True}

    db.add(Subscriber(profile_id=profile.id, email=payload.email.lower()))
    db.commit()
    return {"ok": True, "already_subscribed": False}
