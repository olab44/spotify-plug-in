from fastapi import APIRouter, Depends, HTTPException
from src.language_stats.dal import stream_playlist_tracks
from src.login.service import get_current_user

from .processor import get_language_stats
from .schemas import LanguageStats

router = APIRouter()


@router.get("/stats")
async def get_language_stats_for_playlist(
    playlist_id: str, user: dict = Depends(get_current_user)
) -> LanguageStats:
    token = user.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    if not playlist_id:
        raise HTTPException(status_code=400, detail="No playlist ID provided")
    track_stream = stream_playlist_tracks(playlist_id, token)

    try:
        stats = await get_language_stats(track_stream)
        return stats

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compute language stats: {e}")
