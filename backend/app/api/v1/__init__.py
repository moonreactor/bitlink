from fastapi import APIRouter

from app.api.v1 import (
    admin,
    analytics,
    auth,
    domain,
    links,
    media,
    products,
    profile,
    public,
    reports,
    sections,
    short_links,
)

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth.router)
api_router.include_router(profile.router)
api_router.include_router(domain.router)
api_router.include_router(links.router)
api_router.include_router(sections.router)
api_router.include_router(analytics.router)
api_router.include_router(media.router)
api_router.include_router(short_links.router)
api_router.include_router(products.router)
api_router.include_router(admin.router)
api_router.include_router(reports.router)
api_router.include_router(public.router)
