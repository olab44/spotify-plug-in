from fastapi import APIRouter, Depends, HTTPException
from src.login.service import get_current_user

from .service import get_playlist_data, get_user_playlists, remove_duplicate_tracks

router = APIRouter()


@router.get("/all")
def get_playlists(user: dict = Depends(get_current_user)) -> list[dict]:
    access_token = user.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    playlists = get_user_playlists(access_token)
    if playlists is None:
        raise HTTPException(status_code=401, detail="Failed to fetch playlists")
    return playlists


@router.get("/{playlist_id}")
def get_playlist(
    playlist_id: str, user: dict = Depends(get_current_user)
) -> dict[str, dict | list]:
    access_token = user.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        data = get_playlist_data(access_token, playlist_id)
        if data is None:
            raise HTTPException(status_code=404, detail="Playlist not found or empty")
        return data
    except HTTPException as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=f"Failed to fetch playlist data: {e.detail}",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")


@router.post("/{playlist_id}/remove-duplicates")
def remove_duplicates(playlist_id: str, user: dict = Depends(get_current_user)) -> dict[str, str]:
    access_token = user.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    success = remove_duplicate_tracks(access_token, playlist_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to remove duplicates from Spotify.")

    return {"message": "Duplicate tracks removed successfully."}
