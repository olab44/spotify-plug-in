from typing import Any, Dict, List

from fastapi import APIRouter, Depends, HTTPException, Path, status
from src.config.dependencies import get_spotify_client
from src.config.spotify_client import SpotifyClient

from .schemas import SpotifyTrack

router = APIRouter()

TIME_RANGES_MAP = {
    "short-term": "short_term",
    "medium-term": "medium_term",
    "long-term": "long_term",
}


@router.get(
    "/{time_range}",
    response_model=List[SpotifyTrack],
)
def get_top_tracks_for_period(
    time_range: str = Path(..., regex="^(short|medium|long)-term$"),
    client: SpotifyClient = Depends(get_spotify_client),
) -> List[Dict[str, Any]]:
    spotify_time_range = TIME_RANGES_MAP.get(time_range)

    tracks = client.users.get_top_tracks(time_range=spotify_time_range)
    if tracks is None:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to fetch top tracks from Spotify. The API may be down or the token expired.",
        )

    return tracks
