"""Periodic cleanup of unclaimed anonymous short links."""

import asyncio
import logging
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.short_link import ShortLink

logger = logging.getLogger("bitlink.cleanup")

RUN_EVERY_SECONDS = 24 * 60 * 60


def delete_expired_anonymous_links(db: Session, days: int | None = None) -> int:
    """Delete anonymous links that nobody claimed within ``days`` (default: 60).

    Their clicks go with them (FK ON DELETE CASCADE). Claimed links have a user_id and are never touched.
    """
    ttl = days if days is not None else settings.ANON_LINK_TTL_DAYS
    cutoff = datetime.now(timezone.utc) - timedelta(days=ttl)
    deleted = (
        db.query(ShortLink)
        .filter(ShortLink.user_id.is_(None), ShortLink.created_at < cutoff)
        .delete(synchronize_session=False)
    )
    db.commit()
    return deleted


def _run_once() -> None:
    db = SessionLocal()
    try:
        deleted = delete_expired_anonymous_links(db)
        if deleted:
            logger.info("Deleted %s expired anonymous short links", deleted)
    except Exception:  # noqa: BLE001 - never crash the API because of housekeeping
        logger.exception("Anonymous link cleanup failed")
        db.rollback()
    finally:
        db.close()


async def cleanup_loop() -> None:
    """Background task started with the API: run shortly after boot, then daily."""
    await asyncio.sleep(60)
    while True:
        await asyncio.to_thread(_run_once)
        await asyncio.sleep(RUN_EVERY_SECONDS)


if __name__ == "__main__":  # manual run: python -m app.services.cleanup
    _run_once()
