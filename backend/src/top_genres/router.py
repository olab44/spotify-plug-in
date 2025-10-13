from typing import Dict, List

from fastapi import APIRouter, Depends, Path
from src.config.constants import TIME_RANGES
from src.config.dependencies import get_spotify_client
from src.config.spotify_client import SpotifyClient

from . import service
from .schemas import Genre

router = APIRouter()


@router.get("/{time_range}", response_model=List[Genre], tags=["genres"])
def get_top_genres_for_period(
    time_range: str = Path(..., regex="^(short|medium|long)-term$"),
    spotify_client: SpotifyClient = Depends(get_spotify_client),
) -> List[Dict[str, int]]:
    spotify_time_range = TIME_RANGES.get(time_range)
    genres = service.get_top_genres(spotify_client=spotify_client, time_range=spotify_time_range)

    return genres
