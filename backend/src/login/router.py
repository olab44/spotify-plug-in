from fastapi import APIRouter, Depends, HTTPException, Response, Request
from fastapi.responses import RedirectResponse
from src.login.service import (get_current_user, get_spotify_auth_url, get_spotify_token, get_spotify_user_info)
from dotenv import load_dotenv
import os

from src.login.schemas import SpotifyUser

router = APIRouter()

load_dotenv()
blacklisted_tokens = set()

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")


@router.get("/login")
def login():
    auth_url = get_spotify_auth_url()
    return RedirectResponse(url=auth_url)


@router.get("/callback")
def spotify_callback(code: str, response: Response):
    try:
        token_data = get_spotify_token(code)
        access_token = token_data.access_token
        expires_in = token_data.expires_in
        return RedirectResponse(f"http://localhost:8080/dashboard?access_token={access_token}&expires_in={expires_in}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out successfully"}


@router.get("/token")
def get_token(request: Request):
    raise HTTPException(status_code=404, detail="This endpoint is not used in the current authentication flow.")


@router.get("/me", response_model=SpotifyUser)
def get_user_info(user: dict = Depends(get_current_user)):
    print(f"DEBUG: get_user_info - User dict received: {user}")
    token_string = user.get("access_token")
    if not token_string:
        raise HTTPException(status_code=401, detail="Access token missing in user dependency")
    print(f"DEBUG: get_user_info - Token string for service: {token_string}")
    try:
        user_info = get_spotify_user_info(token_string)
        return user_info
    except Exception as e:
        print(f"ERROR: get_user_info - Error calling get_spotify_user_info: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch user info from Spotify: {e}")
