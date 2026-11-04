import re
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, field_validator

USERNAME_RE = re.compile(r"^[a-z0-9_]{3,30}$")


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    username: str
    display_name: str = Field(min_length=1, max_length=100)

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters.")
        if len(v) > 128:
            raise ValueError("Password must be at most 128 characters.")
        return v

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        v = v.lower().strip()
        if not USERNAME_RE.match(v):
            raise ValueError(
                "Username must be 3–30 characters and use only lowercase letters, numbers, and underscores."
            )
        reserved = {
            "admin",
            "api",
            "dashboard",
            "login",
            "register",
            "settings",
            "me",
            "public",
            "superuser",
        }
        if v in reserved:
            raise ValueError("This username is reserved. Please choose another.")
        return v

    @field_validator("display_name")
    @classmethod
    def validate_display_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Display name cannot be empty.")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class UserOut(BaseModel):
    id: UUID
    email: EmailStr
    is_active: bool
    is_superuser: bool
    created_at: datetime

    model_config = {"from_attributes": True}
