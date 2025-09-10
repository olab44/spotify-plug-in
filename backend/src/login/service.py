import requests
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from src.config.constants import (
    DEFAULT_SCOPES,
    SPOTIFY_API_BASE_URL,
    SPOTIFY_AUTH_URL,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REDIRECT_URI,
    SPOTIFY_TOKEN_URL,
)
from src.login.schemas import SpotifyToken, SpotifyUser


def get_spotify_auth_url() -> str:
    """Generates the Spotify authorization URL."""
    if not all([SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI]):
        raise ValueError("SPOTIFY_CLIENT_ID or SPOTIFY_REDIRECT_URI is not set")
    return (
        f"{SPOTIFY_AUTH_URL}?"
        f"client_id={SPOTIFY_CLIENT_ID}"
        f"&response_type=code"
        f"&redirect_uri={SPOTIFY_REDIRECT_URI}"
        f"&scope={DEFAULT_SCOPES}"
    )


def get_spotify_token(code: str) -> SpotifyToken:
    """Exchanges an authorization code for an access token."""
    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": SPOTIFY_REDIRECT_URI,
        "client_id": SPOTIFY_CLIENT_ID,
        "client_secret": SPOTIFY_CLIENT_SECRET,
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    try:
        response = requests.post(SPOTIFY_TOKEN_URL, data=payload, headers=headers)
        response.raise_for_status()
        return SpotifyToken(**response.json())
    except requests.exceptions.HTTPError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail="Failed to get token from Spotify",
        )


def get_spotify_user_info(access_token: str) -> SpotifyUser:
    """Fetches user information from Spotify's API."""
    headers = {"Authorization": f"Bearer {access_token}"}
    try:
        response = requests.get(f"{SPOTIFY_API_BASE_URL}/me", headers=headers)
        response.raise_for_status()
        return SpotifyUser(**response.json())
    except requests.exceptions.HTTPError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail="Failed to fetch user info from Spotify",
        )


oauth2_scheme = HTTPBearer()


# src/login/service.py

from src.config.database import SessionLocal  # Import SessionLocal

# ... (other imports)
from src.models import User

# This is a temporary in-memory store for demonstration
# You need a persistent way to store and retrieve tokens,
# but for this example, we'll use a simple cache.
user_cache = {}


def get_current_user(token: HTTPAuthorizationCredentials = Depends(oauth2_scheme)):
    """Dependency to get the current user's token and ID from a bearer token."""
    if not token.credentials:
        raise HTTPException(
            status_code=401, detail="Not authenticated: No bearer token provided"
        )

    # In a real app, you would retrieve user data from your DB based on the token.
    # For this example, we will retrieve the user from the database directly
    # or fetch the info from Spotify if it's not present.

    # This is a critical step: get the user from the database using their access token.
    db = SessionLocal()
    user = db.query(User).filter(User.access_token == token.credentials).first()
    db.close()

    if not user:
        # If user not found in DB, it might be a new login or an invalid token
        try:
            user_info = get_spotify_user_info(token.credentials)
            # You would then save this user to the DB and get their ID
            # For now, let's just return what we have
            return {
                "access_token": token.credentials,
                "id": user_info.id,
                "display_name": user_info.display_name,
                "email": user_info.email,
            }
        except HTTPException as e:
            raise HTTPException(
                status_code=401, detail="Invalid or expired access token"
            )

    return {
        "access_token": user.access_token,
        "id": user.spotify_id,
        "display_name": user.display_name,
        "email": user.email,
    }
