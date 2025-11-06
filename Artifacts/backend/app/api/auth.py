"""
Authentication endpoints for user login and token management.

This module provides endpoints for:
- User login (email/password authentication)
- Token refresh
- Current user information retrieval
"""
from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    verify_password,
    decode_token,
)
from app.db.session import get_db
from app.models import User
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["authentication"])

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


# ============================================================================
# SCHEMAS
# ============================================================================

class Token(BaseModel):
    """Response model for successful login"""
    access_token: str
    refresh_token: str
    token_type: str
    user: dict


class UserResponse(BaseModel):
    """User information response"""
    id: int
    email: str
    full_name: str
    system_role: str
    is_active: bool

    class Config:
        from_attributes = True


class RefreshTokenRequest(BaseModel):
    """Request model for token refresh"""
    refresh_token: str


# ============================================================================
# DEPENDENCIES
# ============================================================================

async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency that extracts and validates the current user from JWT token.

    Args:
        token: JWT access token from Authorization header
        db: Database session

    Returns:
        User object if valid token

    Raises:
        HTTPException 401 if token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Decode the token
    payload = decode_token(token)
    if payload is None:
        raise credentials_exception

    # Check token type
    if payload.get("type") != "access":
        raise credentials_exception

    # Get user ID from token
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    # Fetch user from database
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )

    return user


# ============================================================================
# ENDPOINTS
# ============================================================================

@router.post("/login", response_model=Token)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db)
):
    """
    User login endpoint.

    Accepts email and password via OAuth2 password flow (username field contains email).
    Returns JWT access token, refresh token, and user information.

    Args:
        form_data: OAuth2 form with username (email) and password
        db: Database session

    Returns:
        Token response with access_token, refresh_token, and user data

    Raises:
        HTTPException 401 if credentials are invalid
    """
    # Find user by email (OAuth2PasswordRequestForm uses 'username' field)
    user = db.query(User).filter(User.email == form_data.username).first()

    # Verify user exists and password is correct
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account"
        )

    # Create access and refresh tokens
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email}
    )
    refresh_token = create_refresh_token(
        data={"sub": str(user.id), "email": user.email}
    )

    # Update last login timestamp
    from datetime import datetime
    user.last_login_at = datetime.utcnow()
    db.commit()

    # Return tokens and user info
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.email,  # For frontend compatibility
            "email": user.email,
            "full_name": user.full_name,
            "system_role": user.system_role,
        }
    }


@router.post("/refresh", response_model=Token)
async def refresh_token(
    request: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    """
    Refresh access token using a valid refresh token.

    Args:
        request: Contains the refresh token
        db: Database session

    Returns:
        New token response with fresh access_token

    Raises:
        HTTPException 401 if refresh token is invalid
    """
    # Decode refresh token
    payload = decode_token(request.refresh_token)
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Get user
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )

    # Create new tokens
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email}
    )
    refresh_token = create_refresh_token(
        data={"sub": str(user.id), "email": user.email}
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.email,
            "email": user.email,
            "full_name": user.full_name,
            "system_role": user.system_role,
        }
    }


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    Get current authenticated user information.

    Args:
        current_user: Injected from JWT token via dependency

    Returns:
        User information
    """
    return current_user
