from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.links import _link_out
from app.api.v1.profile import get_user_profile
from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.link import Link
from app.models.link_section import LinkSection
from app.models.user import User
from app.schemas.section import (
    MAX_SECTIONS_PER_PROFILE,
    LayoutOut,
    LayoutRequest,
    SectionCreate,
    SectionOut,
    SectionUpdate,
)
from app.services.link_layout import LayoutError, apply_layout, dissolve_section, next_top_position

router = APIRouter(prefix="/me", tags=["sections"])


def _sections(db: Session, profile_id) -> list[LinkSection]:
    return (
        db.query(LinkSection)
        .filter(LinkSection.profile_id == profile_id)
        .order_by(LinkSection.position.asc(), LinkSection.created_at.asc())
        .all()
    )


def _links(db: Session, profile_id) -> list[Link]:
    return (
        db.query(Link)
        .filter(Link.profile_id == profile_id)
        .order_by(Link.position.asc(), Link.created_at.asc())
        .all()
    )


def _get_section(db: Session, profile_id, section_id: UUID) -> LinkSection:
    section = (
        db.query(LinkSection)
        .filter(LinkSection.id == section_id, LinkSection.profile_id == profile_id)
        .first()
    )
    if section is None:
        raise HTTPException(status_code=404, detail="Section not found")
    return section


@router.get("/sections", response_model=list[SectionOut])
def list_sections(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> list[LinkSection]:
    profile = get_user_profile(db, current_user)
    return _sections(db, profile.id)


@router.post("/sections", response_model=SectionOut, status_code=status.HTTP_201_CREATED)
def create_section(
    payload: SectionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> LinkSection:
    profile = get_user_profile(db, current_user)
    sections = _sections(db, profile.id)
    if len(sections) >= MAX_SECTIONS_PER_PROFILE:
        raise HTTPException(
            status_code=400, detail=f"You can have up to {MAX_SECTIONS_PER_PROFILE} sections."
        )
    section = LinkSection(
        profile_id=profile.id,
        title=payload.title,
        layout=payload.layout,
        position=next_top_position(_links(db, profile.id), sections),
    )
    db.add(section)
    db.commit()
    db.refresh(section)
    return section


@router.patch("/sections/{section_id}", response_model=SectionOut)
def update_section(
    section_id: UUID,
    payload: SectionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> LinkSection:
    profile = get_user_profile(db, current_user)
    section = _get_section(db, profile.id, section_id)
    data = payload.model_dump(exclude_unset=True)
    for field in ("title", "layout"):
        if data.get(field) is not None:
            setattr(section, field, data[field])
    db.commit()
    db.refresh(section)
    return section


@router.delete("/sections/{section_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_section(
    section_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    """Delete a section. Its links are kept and stay where they were on the page."""
    profile = get_user_profile(db, current_user)
    section = _get_section(db, profile.id, section_id)
    dissolve_section(_links(db, profile.id), _sections(db, profile.id), section)
    db.flush()
    db.delete(section)
    db.commit()


@router.put("/layout", response_model=LayoutOut)
def save_layout(
    payload: LayoutRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> LayoutOut:
    """Save the whole page order in one go: sections, loose links and the links inside sections."""
    profile = get_user_profile(db, current_user)
    links = _links(db, profile.id)
    sections = _sections(db, profile.id)
    try:
        apply_layout(links, sections, [b.model_dump() for b in payload.blocks])
    except LayoutError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    db.commit()
    return LayoutOut(
        sections=[SectionOut.model_validate(s) for s in sorted(sections, key=lambda s: s.position)],
        links=[_link_out(l) for l in links],
    )
