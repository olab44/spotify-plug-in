from fastapi import APIRouter, Depends, HTTPException
from src.login.service import get_current_user

from .service import (get_top_artists_long_term, get_top_artists_medium_term,
                      get_top_artists_short_term)

router = APIRouter()


@router.get("/short-term")
def top_artists_short(user: dict = Depends(get_current_user)):
    access_token = user.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    artists = get_top_artists_short_term(access_token)
    if artists is None:
        raise HTTPException(status_code=401, detail="Failed to fetch top artists")
    return artists


@router.get("/medium-term")
def top_artists_medium(user: dict = Depends(get_current_user)):
    access_token = user.get("access_token")
    artists = get_top_artists_medium_term(access_token)
    if artists is None:
        raise HTTPException(status_code=401, detail="Token expired or not found")
    return artists


@router.get("/long-term")
def top_artists_long(user: dict = Depends(get_current_user)):
    access_token = user.get("access_token")
    artists = get_top_artists_long_term(access_token)
    if artists is None:
        raise HTTPException(status_code=401, detail="Token expired or not found")
    return artists
