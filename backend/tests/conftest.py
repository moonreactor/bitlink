"""Test setup: the API runs against a throwaway SQLite file, no Postgres/Docker needed.

Env vars must be set before `app` is imported, because the engine and media folder are
created at import time.
"""

import os
import tempfile

_TMP = tempfile.mkdtemp(prefix="bitlink-tests-")
os.environ["DATABASE_URL"] = f"sqlite:///{_TMP}/test.db"
os.environ["MEDIA_ROOT"] = f"{_TMP}/media"

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy.dialects.postgresql import JSONB  # noqa: E402
from sqlalchemy.ext.compiler import compiles  # noqa: E402


@compiles(JSONB, "sqlite")
def _jsonb_as_json(_type, _compiler, **_kw):  # pragma: no cover - trivial shim
    return "JSON"


from app import models as _models  # noqa: E402,F401  (registers every table on Base)
from app.db.base import Base  # noqa: E402
from app.db.session import SessionLocal, engine  # noqa: E402
from app.main import app  # noqa: E402


@pytest.fixture(autouse=True)
def _fresh_db():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    yield


@pytest.fixture()
def client() -> TestClient:
    # Not used as a context manager on purpose: skips the background cleanup loop.
    return TestClient(app)


@pytest.fixture()
def db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def register(client: TestClient, username: str, **extra) -> dict:
    """Create an account and return its auth header."""
    res = client.post(
        "/api/v1/auth/register",
        json={
            "email": f"{username}@example.com",
            "password": "password123",
            "username": username,
            "display_name": username.title(),
            **extra,
        },
    )
    assert res.status_code == 201, res.text
    return {"Authorization": f"Bearer {res.json()['access_token']}"}
