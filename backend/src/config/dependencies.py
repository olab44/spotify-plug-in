from typing import Generator

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .database import SessionLocal
from .spotify_client import SpotifyClient

oauth2_scheme = HTTPBearer()


def get_token(token: HTTPAuthorizationCredentials = Depends(oauth2_scheme)) -> str:
    """Dependency to get the access token from the bearer header."""
    if not token or not token.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Bearer token not provided"
        )
    return token.credentials


def get_spotify_client(access_token: str = Depends(get_token)) -> SpotifyClient:
    return SpotifyClient(access_token)


def get_user_id(client: SpotifyClient = Depends(get_spotify_client)) -> str:

    profile = client.users.get_profile()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not fetch user profile from Spotify. Token may be invalid.",
        )

    user_id = profile.get("id")

    return user_id


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
