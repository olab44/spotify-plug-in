# login/service.py
import os
import requests
from fastapi import HTTPException, Depends
from datetime import datetime, timedelta
from dotenv import load_dotenv
from .schemas import SpotifyToken, SpotifyUser
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

load_dotenv()

SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1"

SECRET_KEY = os.getenv("SECRET_KEY", "secret")
tokens = {}

security = HTTPBearer()


def get_spotify_auth_url() -> str:
    client_id = os.getenv("SPOTIFY_CLIENT_ID")
    redirect_uri = os.getenv("SPOTIFY_REDIRECT_URI")

    if not client_id or not redirect_uri:
        raise ValueError("SPOTIFY_CLIENT_ID or SPOTIFY_REDIRECT_URI is not set")

    scope = "user-read-private user-read-email user-library-read playlist-read-private"
    auth_url = (
        f"{SPOTIFY_AUTH_URL}?"
        f"client_id={client_id}"
        f"&response_type=code"
        f"&redirect_uri={redirect_uri}"
        f"&scope={scope}"
    )
    return auth_url


def get_spotify_token(code: str) -> SpotifyToken:
    client_id = os.getenv("SPOTIFY_CLIENT_ID")
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
    redirect_uri = os.getenv("SPOTIFY_REDIRECT_URI")

    if not client_id or not client_secret or not redirect_uri:
        raise ValueError("SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, or SPOTIFY_REDIRECT_URI is not set")

    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_uri,
        "client_id": client_id,
        "client_secret": client_secret,
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    response = requests.post(SPOTIFY_TOKEN_URL, data=payload, headers=headers)
    response.raise_for_status()
    token_info = response.json()
    token_info["expires_at"] = datetime.utcnow() + timedelta(seconds=token_info.get("expires_in", 3600))
    tokens[token_info["access_token"]] = token_info
    return SpotifyToken(**token_info)


def get_spotify_user_info(access_token: str) -> SpotifyUser:
    if access_token not in tokens or tokens[access_token]["expires_at"] < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Token expired or not found")

    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(f"{SPOTIFY_API_BASE_URL}/me", headers=headers)
    response.raise_for_status()
    return SpotifyUser(**response.json())


def logout_user(access_token: str):
    if access_token in tokens:
        del tokens[access_token]


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    print(f"DEBUG: get_current_user - Token extracted from header: {token}")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {"access_token": token}
