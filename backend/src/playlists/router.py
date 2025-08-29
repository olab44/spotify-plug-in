from fastapi import APIRouter, Depends, HTTPException
from src.login.service import get_current_user

from .service import get_playlist_tracks, get_user_playlists

router = APIRouter()


@router.get("/all")
def get_playlists(user: dict = Depends(get_current_user)):
    access_token = user.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    playlists = get_user_playlists(access_token)
    if playlists is None:
        raise HTTPException(status_code=401, detail="Failed to fetch playlists")
    return playlists


@router.get("/{playlist_id}")
def get_playlist(playlist_id: str, user: dict = Depends(get_current_user)):
    access_token = user.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        tracks = get_playlist_tracks(access_token, playlist_id)
        if tracks is None:
            raise HTTPException(status_code=404, detail="Playlist not found or empty")

        return tracks
    except HTTPException as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=f"Failed to fetch playlist data: {e.detail}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"An unexpected error occurred: {str(e)}"
        )
