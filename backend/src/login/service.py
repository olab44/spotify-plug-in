import os
import requests
from dotenv import load_dotenv
from .schemas import SpotifyToken, SpotifyUser

load_dotenv()

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
SPOTIFY_REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI")
SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_API_URL = "https://api.spotify.com/v1/me"


def get_spotify_auth_url() -> str:
    scope = "user-read-private user-read-email"
    auth_url = (
        f"{SPOTIFY_AUTH_URL}?response_type=code&client_id={SPOTIFY_CLIENT_ID}"
        f"&scope={scope}&redirect_uri={SPOTIFY_REDIRECT_URI}"
    )
    return auth_url


def get_spotify_token(code: str) -> SpotifyToken:
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
    return SpotifyToken(**response.json())


def get_spotify_user_info(access_token: str) -> SpotifyUser:
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(SPOTIFY_API_URL, headers=headers)
    response.raise_for_status()
    return SpotifyUser(**response.json())
