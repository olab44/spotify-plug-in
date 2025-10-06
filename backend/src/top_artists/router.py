from fastapi import APIRouter, Depends, HTTPException, Path
from src.login.service import get_current_user

from .service import get_top_artists, get_top_artists_with_song_count

router = APIRouter()


@router.get("/{time_range}")
def get_top_artists_quick(
    time_range: str = Path(
        ..., description="Time range for top artists", regex="^(short|medium|long)-term$"
    ),
    user: dict = Depends(get_current_user),
) -> list:
    access_token = user.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    artists = get_top_artists(access_token, time_range=time_range)
    if artists is None:
        raise HTTPException(status_code=401, detail="Failed to fetch top artists or token expired")

    for artist in artists:
        artist["library_song_count"] = None

    return artists


@router.get("/{time_range}/with-counts")
def get_top_artists_full(
    time_range: str = Path(..., regex="^(short|medium|long)-term$"),
    user: dict = Depends(get_current_user),
) -> list:
    access_token = user.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    artists = get_top_artists_with_song_count(access_token, time_range=time_range)
    if artists is None:
        raise HTTPException(status_code=401, detail="Failed to fetch top artists or token expired")

    return artists
