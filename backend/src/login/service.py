import requests
from fastapi import HTTPException, Request
from datetime import datetime, timedelta
from .schemas import SpotifyToken, SpotifyUser
from src.config.constants import (
    SPOTIFY_AUTH_URL,
    SPOTIFY_TOKEN_URL,
    SPOTIFY_API_BASE_URL,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REDIRECT_URI,
    DEFAULT_SCOPES,
)
from src.config.tokens import TOKENS


def get_spotify_auth_url() -> str:
    if not SPOTIFY_CLIENT_ID or not SPOTIFY_REDIRECT_URI:
        raise ValueError("SPOTIFY_CLIENT_ID or SPOTIFY_REDIRECT_URI is not set")
    auth_url = (
        f"{SPOTIFY_AUTH_URL}?"
        f"client_id={SPOTIFY_CLIENT_ID}"
        f"&response_type=code"
        f"&redirect_uri={SPOTIFY_REDIRECT_URI}"
        f"&scope={DEFAULT_SCOPES}"
    )
    return auth_url


def get_spotify_token(code: str) -> SpotifyToken:
    if not SPOTIFY_CLIENT_ID or not SPOTIFY_CLIENT_SECRET or not SPOTIFY_REDIRECT_URI:
        raise ValueError("SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, or SPOTIFY_REDIRECT_URI is not set")
    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": SPOTIFY_REDIRECT_URI,
        "client_id": SPOTIFY_CLIENT_ID,
        "client_secret": SPOTIFY_CLIENT_SECRET,
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    response = requests.post(SPOTIFY_TOKEN_URL, data=payload, headers=headers)
    response.raise_for_status()
    token_info = response.json()
    token_info["expires_at"] = datetime.utcnow() + timedelta(seconds=token_info.get("expires_in", 3600))
    TOKENS.set(token_info["access_token"], token_info)
    return SpotifyToken(**token_info)


def get_spotify_user_info(access_token: str) -> SpotifyUser:
    token = TOKENS.get(access_token)
    if not token:
        raise HTTPException(status_code=401, detail="Token expired or not found")
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(f"{SPOTIFY_API_BASE_URL}/me", headers=headers)
    response.raise_for_status()
    return SpotifyUser(**response.json())


def logout_user(access_token: str):
    TOKENS.delete(access_token)


def get_current_user(request: Request):
    auth_header = request.headers.get("authorization")
    token = None
    if auth_header and auth_header.lower().startswith("bearer "):
        token = auth_header.split()[1]
    else:
        token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    if not TOKENS.get(token):
        raise HTTPException(status_code=401, detail="Token expired or not found")
    return {"access_token": token}
