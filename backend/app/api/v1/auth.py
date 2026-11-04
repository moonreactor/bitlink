from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.db.session import get_db
from app.models.profile import DEFAULT_THEME, Profile
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    RefreshRequest,
    RegisterRequest,
    TokenResponse,
    UserOut,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> TokenResponse:
    if db.query(User).filter(User.email == payload.email.lower()).first():
        raise HTTPException(
            status_code=400,
            detail="This email is already registered. Try logging in instead.",
        )
    if db.query(Profile).filter(Profile.username == payload.username).first():
        raise HTTPException(
            status_code=400,
            detail="This username is already taken. Please choose another.",
        )

    user = User(email=payload.email.lower(), password_hash=hash_password(payload.password))
    db.add(user)
    db.flush()

    profile = Profile(
        user_id=user.id,
        username=payload.username,
        display_name=payload.display_name,
        theme_json=dict(DEFAULT_THEME),
    )
    db.add(profile)
    db.commit()

    return TokenResponse(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password.")
    if not user.is_active:
        raise HTTPException(
            status_code=401,
            detail="This account has been disabled. Contact support if you need help.",
        )

    return TokenResponse(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)) -> TokenResponse:
    from uuid import UUID

    data = decode_token(payload.refresh_token)
    if data is None or data.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    try:
        user_id = UUID(data["sub"])
    except (KeyError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user = db.get(User, user_id)
    if user is None or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found")

    return TokenResponse(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
    )


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)) -> User:
    return current_user
