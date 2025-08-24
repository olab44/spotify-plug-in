from fastapi import APIRouter, Depends, HTTPException
from src.login.service import get_current_user

from .service import (get_top_genres_long_term, get_top_genres_medium_term,
                      get_top_genres_short_term)

router = APIRouter()


@router.get("/short-term")
def top_genres_short(user: dict = Depends(get_current_user)):
    access_token = user.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    genres = get_top_genres_short_term(access_token)
    if genres is None:
        raise HTTPException(status_code=401, detail="Failed to fetch top genres or token expired")
    return genres


@router.get("/medium-term")
def top_genres_medium(user: dict = Depends(get_current_user)):
    access_token = user.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    genres = get_top_genres_medium_term(access_token)
    if genres is None:
        raise HTTPException(status_code=401, detail="Failed to fetch top genres or token expired")
    return genres


@router.get("/long-term")
def top_genres_long(user: dict = Depends(get_current_user)):
    access_token = user.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    genres = get_top_genres_long_term(access_token)
    if genres is None:
        raise HTTPException(status_code=401, detail="Failed to fetch top genres or token expired")
    return genres
