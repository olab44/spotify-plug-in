from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from src.login.service import get_current_user

from .dal import stream_playlist_tracks, stream_saved_tracks
from .presenter import stats_from_stream

router = APIRouter()


@router.get("/stats")
async def get_stats(
    scope: Optional[str] = Query("global", regex="^(global|playlist)$"),
    playlist_id: Optional[str] = None,
    user: dict = Depends(get_current_user),
):
    token = user.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    if scope == "playlist":
        if not playlist_id:
            raise HTTPException(
                status_code=400, detail="playlist_id required for scope=playlist"
            )
        stream = stream_playlist_tracks(playlist_id, token)
    else:
        stream = stream_saved_tracks(token)

    try:
        stats = await stats_from_stream(stream)
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to compute language stats: {e}"
        )
