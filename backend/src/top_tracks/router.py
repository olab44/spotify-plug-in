from fastapi import APIRouter, Depends, HTTPException
from src.login.service import get_current_user

from .service import (
    get_top_tracks_long_term,
    get_top_tracks_medium_term,
    get_top_tracks_short_term,
)

router = APIRouter()


@router.get("/short-term")
def top_tracks_short(user: dict = Depends(get_current_user)):
    access_token = user.get("access_token")
    tracks = get_top_tracks_short_term(access_token)
    if tracks is None:
        raise HTTPException(status_code=401, detail="Token expired or not found")
    return tracks


@router.get("/medium-term")
def top_tracks_medium(user: dict = Depends(get_current_user)):
    access_token = user.get("access_token")
    tracks = get_top_tracks_medium_term(access_token)
    if tracks is None:
        raise HTTPException(status_code=401, detail="Token expired or not found")
    return tracks


@router.get("/long-term")
def top_tracks_long(user: dict = Depends(get_current_user)):
    access_token = user.get("access_token")
    tracks = get_top_tracks_long_term(access_token)
    if tracks is None:
        raise HTTPException(status_code=401, detail="Token expired or not found")
    return tracks
