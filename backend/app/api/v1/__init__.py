from fastapi import APIRouter

from app.api.v1 import admin, analytics, auth, links, media, profile, public, social

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth.router)
api_router.include_router(profile.router)
api_router.include_router(links.router)
api_router.include_router(social.router)
api_router.include_router(analytics.router)
api_router.include_router(media.router)
api_router.include_router(admin.router)
api_router.include_router(public.router)
