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

oauth2_scheme = HTTPBearer()


def get_spotify_auth_url() -> str:
    """Generates the Spotify authorization URL."""
    if not all([SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI]):
        raise ValueError("SPOTIFY_CLIENT_ID or SPOTIFY_REDIRECT_URI is not set")
    client_id = str(SPOTIFY_CLIENT_ID)
    redirect_uri = str(SPOTIFY_REDIRECT_URI)
    scopes = str(DEFAULT_SCOPES)
    return (
        f"{SPOTIFY_AUTH_URL}?"
        f"client_id={client_id}"
        f"&response_type=code"
        f"&redirect_uri={redirect_uri}"
        f"&scope={scopes}"
    )


def get_spotify_token(code: str) -> SpotifyToken:
    """Exchanges an authorization code for an access token."""
    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": str(SPOTIFY_REDIRECT_URI),
        "client_id": str(SPOTIFY_CLIENT_ID),
        "client_secret": str(SPOTIFY_CLIENT_SECRET),
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    try:
        response = requests.post(str(SPOTIFY_TOKEN_URL), data=payload, headers=headers, timeout=10)
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
        response = requests.get(f"{SPOTIFY_API_BASE_URL}/me", headers=headers, timeout=10)
        response.raise_for_status()
        return SpotifyUser(**response.json())
    except requests.exceptions.HTTPError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail="Failed to fetch user info from Spotify",
        )


def get_current_user(token: HTTPAuthorizationCredentials = Depends(oauth2_scheme)) -> dict:
    """Dependency to get the current user's token from a bearer token."""
    if not token.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated: No bearer token provided")

    return {"access_token": token.credentials}
