from fastapi import APIRouter, Depends, HTTPException, status
from redis.client import Redis
from src.config.dependencies import get_spotify_client
from src.config.redis_client import get_redis_client
from src.config.spotify_client import SpotifyClient

from . import service
from .schemas import LanguageStats

router = APIRouter()


@router.get("/stats", response_model=LanguageStats, tags=["language"])
def get_language_stats_for_playlist(
    playlist_id: str,
    spotify_client: SpotifyClient = Depends(get_spotify_client),
    redis_client: Redis = Depends(get_redis_client),
) -> LanguageStats:
    if not playlist_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A playlist_id query parameter is required.",
        )

    try:
        stats = service.get_language_stats_for_playlist(
            playlist_id=playlist_id,
            spotify_client=spotify_client,
            redis_client=redis_client,
        )
        return stats
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while computing language stats.",
        )
