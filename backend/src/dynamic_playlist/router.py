from fastapi import APIRouter, Depends
from src.config.dependencies import get_spotify_client, get_user_id
from src.config.spotify_client import SpotifyClient

from .schemas import AddTrackRequest, PlaylistDetails
from .service import add_track_and_prune, refresh_playlist

router = APIRouter()


@router.get(
    "/heavy-rotation/refresh",
    response_model=PlaylistDetails,
)
def refresh_heavy_rotation_playlist(
    client: SpotifyClient = Depends(get_spotify_client),
    user_id: str = Depends(get_user_id),
) -> PlaylistDetails:
    return refresh_playlist(client=client, user_id=user_id)


@router.post(
    "/heavy-rotation/add",
    response_model=PlaylistDetails,
)
def add_track_to_heavy_rotation(
    request: AddTrackRequest,
    client: SpotifyClient = Depends(get_spotify_client),
    user_id: str = Depends(get_user_id),
) -> PlaylistDetails:
    return add_track_and_prune(client=client, user_id=user_id, track_uri=request.track_uri)
