from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.v1.profile import get_user_profile
from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.social_link import SocialLink
from app.models.user import User
from app.schemas.social import SocialLinkOut, SocialLinksReplace

router = APIRouter(prefix="/me/social-links", tags=["social"])


@router.get("", response_model=list[SocialLinkOut])
def list_social(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[SocialLink]:
    profile = get_user_profile(db, current_user)
    return (
        db.query(SocialLink)
        .filter(SocialLink.profile_id == profile.id)
        .order_by(SocialLink.position.asc())
        .all()
    )


@router.put("", response_model=list[SocialLinkOut])
def replace_social(
    payload: SocialLinksReplace,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[SocialLink]:
    profile = get_user_profile(db, current_user)
    db.query(SocialLink).filter(SocialLink.profile_id == profile.id).delete()
    created: list[SocialLink] = []
    for idx, item in enumerate(payload.items):
        row = SocialLink(
            profile_id=profile.id,
            platform=item.platform.lower(),
            url=item.url,
            position=item.position if item.position else idx,
        )
        db.add(row)
        created.append(row)
    db.commit()
    for row in created:
        db.refresh(row)
    return created
