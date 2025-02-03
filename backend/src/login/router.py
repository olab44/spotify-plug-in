import requests
from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from login.service import get_spotify_auth_url, get_spotify_token, get_spotify_user_info
from login.schemas import SpotifyUser

router = APIRouter()


@router.get("/login")
def login():
    auth_url = get_spotify_auth_url()
    return RedirectResponse(auth_url)


@router.get("/callback", response_model=SpotifyUser)
def callback(code: str):
    try:
        token_info = get_spotify_token(code)
        user_info = get_spotify_user_info(token_info.access_token)
        return user_info
    except requests.HTTPError as e:
        raise HTTPException(status_code=e.response.status_code, detail="Failed to get user info")
