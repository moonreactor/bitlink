from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.v1 import api_router
from app.core.config import settings

app = FastAPI(title="Bitlink API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

media_path = Path(settings.MEDIA_ROOT)
media_path.mkdir(parents=True, exist_ok=True)
app.mount("/media", StaticFiles(directory=str(media_path)), name="media")

app.include_router(api_router)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
