from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.profile import get_user_profile
from app.core.deps import get_current_user
from app.core.security import hash_password
from app.db.session import get_db
from app.models.link import Link
from app.models.user import User
from app.schemas.link import LinkCreate, LinkOut, LinkReorderRequest, LinkUpdate

router = APIRouter(prefix="/me/links", tags=["links"])


def _link_out(link: Link) -> LinkOut:
    return LinkOut(
        id=link.id,
        title=link.title,
        url=link.url,
        thumbnail_url=link.thumbnail_url,
        icon=link.icon,
        animation=link.animation or "none",
        is_active=link.is_active,
        is_featured=link.is_featured,
        position=link.position,
        visible_from=link.visible_from,
        visible_until=link.visible_until,
        has_lock=bool(link.lock_code_hash),
        created_at=link.created_at,
        updated_at=link.updated_at,
    )


@router.get("", response_model=list[LinkOut])
def list_links(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[LinkOut]:
    profile = get_user_profile(db, current_user)
    links = (
        db.query(Link)
        .filter(Link.profile_id == profile.id)
        .order_by(Link.position.asc(), Link.created_at.asc())
        .all()
    )
    return [_link_out(l) for l in links]


@router.post("", response_model=LinkOut, status_code=status.HTTP_201_CREATED)
def create_link(
    payload: LinkCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> LinkOut:
    profile = get_user_profile(db, current_user)
    max_pos = (
        db.query(Link.position)
        .filter(Link.profile_id == profile.id)
        .order_by(Link.position.desc())
        .first()
    )
    position = (max_pos[0] + 1) if max_pos else 0

    link = Link(
        profile_id=profile.id,
        title=payload.title,
        url=payload.url,
        thumbnail_url=payload.thumbnail_url,
        icon=payload.icon,
        animation=payload.animation,
        is_active=payload.is_active,
        is_featured=payload.is_featured,
        position=position,
        visible_from=payload.visible_from,
        visible_until=payload.visible_until,
        lock_code_hash=hash_password(payload.lock_code) if payload.lock_code else None,
    )
    db.add(link)
    db.commit()
    db.refresh(link)
    return _link_out(link)


@router.patch("/{link_id}", response_model=LinkOut)
def update_link(
    link_id: UUID,
    payload: LinkUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> LinkOut:
    profile = get_user_profile(db, current_user)
    link = db.query(Link).filter(Link.id == link_id, Link.profile_id == profile.id).first()
    if link is None:
        raise HTTPException(status_code=404, detail="Link not found")

    data = payload.model_dump(exclude_unset=True)
    for field in ("title", "url", "thumbnail_url", "icon", "animation", "is_active", "is_featured"):
        if field in data:
            setattr(link, field, data[field])

    if data.get("clear_thumbnail"):
        link.thumbnail_url = None
    if data.get("clear_icon"):
        link.icon = None

    if data.get("clear_schedule"):
        link.visible_from = None
        link.visible_until = None
    else:
        if "visible_from" in data:
            link.visible_from = data["visible_from"]
        if "visible_until" in data:
            link.visible_until = data["visible_until"]

    if data.get("clear_lock_code"):
        link.lock_code_hash = None
    elif data.get("lock_code"):
        link.lock_code_hash = hash_password(data["lock_code"])

    db.commit()
    db.refresh(link)
    return _link_out(link)


@router.delete("/{link_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_link(
    link_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    profile = get_user_profile(db, current_user)
    link = db.query(Link).filter(Link.id == link_id, Link.profile_id == profile.id).first()
    if link is None:
        raise HTTPException(status_code=404, detail="Link not found")
    if profile.redirect_link_id == link.id:
        profile.redirect_link_id = None
    db.delete(link)
    db.commit()


@router.put("/reorder", response_model=list[LinkOut])
def reorder_links(
    payload: LinkReorderRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[LinkOut]:
    profile = get_user_profile(db, current_user)
    links = {str(l.id): l for l in db.query(Link).filter(Link.profile_id == profile.id).all()}
    for item in payload.items:
        link = links.get(str(item.id))
        if link:
            link.position = item.position
    db.commit()
    ordered = sorted(links.values(), key=lambda l: l.position)
    return [_link_out(l) for l in ordered]
