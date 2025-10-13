from typing import List

from fastapi import APIRouter, Depends, HTTPException, Path, status
from redis.client import Redis
from src.config.constants import TIME_RANGES
from src.config.dependencies import get_spotify_client, get_user_id
from src.config.redis_client import get_redis_client
from src.config.spotify_client import SpotifyClient

from . import service
from .schemas import Artist

router = APIRouter()


@router.get("/{time_range}", response_model=List[Artist])
def get_top_artists_quick(
    time_range: str = Path(..., regex="^(short|medium|long)-term$"),
    spotify_client: SpotifyClient = Depends(get_spotify_client),
):
    spotify_time_range = TIME_RANGES[time_range]
    artists = service.get_top_artists(spotify_client, time_range=spotify_time_range)

    if artists is None:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to fetch top artists from Spotify.",
        )
    return artists


@router.get(
    "/{time_range}/with-counts",
    response_model=List[Artist],
)
def get_top_artists_full(
    time_range: str = Path(..., regex="^(short|medium|long)-term$"),
    user_id: str = Depends(get_user_id),
    spotify_client: SpotifyClient = Depends(get_spotify_client),
    redis_client: Redis = Depends(get_redis_client),
):
    spotify_time_range = TIME_RANGES[time_range]

    artists = service.get_top_artists_with_song_count(
        spotify_client=spotify_client,
        redis_client=redis_client,
        time_range=spotify_time_range,
        user_id=user_id,
    )

    if artists is None:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to process top artists with song counts.",
        )
    return artists
