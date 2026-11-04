import re
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, field_validator

USERNAME_RE = re.compile(r"^[a-z0-9_]{3,30}$")


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    username: str
    display_name: str = Field(min_length=1, max_length=100)

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        v = v.lower().strip()
        if not USERNAME_RE.match(v):
            raise ValueError("Username must be 3-30 chars: lowercase letters, numbers, underscore")
        reserved = {"admin", "api", "dashboard", "login", "register", "settings", "me", "public"}
        if v in reserved:
            raise ValueError("Username is reserved")
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

    model_config = {"from_attributes": True}
