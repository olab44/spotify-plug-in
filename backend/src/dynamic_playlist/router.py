from fastapi import APIRouter, Depends
from src.config.dependencies import get_spotify_client, get_user_id
from src.config.spotify_client import SpotifyClient

from .schemas import AddTrackRequest, PlaylistDetails, Track
from .service import (
    add_track_local,
    get_playlist_history,
    load_playlist,
    refresh_playlist,
    remove_track_local,
    save_playlist,
)

router = APIRouter()


@router.get(
    "/heavy-rotation/load",
    response_model=PlaylistDetails,
)
def load_heavy_rotation_playlist(
    client: SpotifyClient = Depends(get_spotify_client),
    user_id: str = Depends(get_user_id),
) -> PlaylistDetails:
    return load_playlist(client=client, user_id=user_id)


@router.post(
    "/heavy-rotation/save",
    response_model=PlaylistDetails,
)
def save_heavy_rotation_playlist(
    client: SpotifyClient = Depends(get_spotify_client),
    user_id: str = Depends(get_user_id),
) -> PlaylistDetails:
    return save_playlist(client=client, user_id=user_id)


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
    return add_track_local(client=client, user_id=user_id, track_uri=request.track_uri)


@router.post(
    "/heavy-rotation/remove",
    response_model=PlaylistDetails,
)
def remove_track_from_heavy_rotation(
    request: AddTrackRequest,
    client: SpotifyClient = Depends(get_spotify_client),
    user_id: str = Depends(get_user_id),
) -> PlaylistDetails:
    return remove_track_local(client=client, user_id=user_id, track_uri=request.track_uri)


@router.get(
    "/heavy-rotation/history",
    response_model=list[Track],
)
def get_heavy_rotation_history(
    client: SpotifyClient = Depends(get_spotify_client),
    user_id: str = Depends(get_user_id),
) -> list[Track]:
    return get_playlist_history(client=client, user_id=user_id)
