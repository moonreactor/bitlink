from datetime import datetime, timezone

from app.models.link import Link


def is_link_visible(link: Link, now: datetime | None = None) -> bool:
    if not link.is_active:
        return False
    now = now or datetime.now(timezone.utc)
    if link.visible_from and link.visible_from > now:
        return False
    if link.visible_until and link.visible_until < now:
        return False
    return True
