from fastapi import APIRouter, Depends, HTTPException

from src.login.service import get_current_user

from .service import create_or_update_dynamic_playlist

router = APIRouter(tags=["dynamic_playlist"])


@router.post("/create")
def create_dynamic_playlist_endpoint(user: dict = Depends(get_current_user)):
    """
    Creates or updates a dynamic playlist with the top 20 most listened-to songs
    from the last 24 hours for the current user.
    """
    access_token = user.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        playlist_id = create_or_update_dynamic_playlist(access_token)
        return {
            "message": "Dynamic playlist updated successfully",
            "playlist_id": playlist_id,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create/update playlist: {e}")
