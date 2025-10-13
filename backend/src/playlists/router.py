from typing import Any, Dict, List

from fastapi import APIRouter, Depends, HTTPException, status
from src.config.dependencies import get_spotify_client
from src.config.spotify_client import SpotifyClient

from . import service
from .schemas import PlaylistDetails, PlaylistSimple, RemoveDuplicatesResponse

router = APIRouter()


@router.get("/all", response_model=List[PlaylistSimple], summary="Get All User Playlists")
def get_playlists(
    spotify_client: SpotifyClient = Depends(get_spotify_client),
) -> List[Dict[str, Any]]:
    playlists = service.get_all_user_playlists(spotify_client)
    if playlists is None:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to fetch playlists from Spotify.",
        )
    return playlists


@router.get("/{playlist_id}", response_model=PlaylistDetails)
def get_playlist(
    playlist_id: str, spotify_client: SpotifyClient = Depends(get_spotify_client)
) -> Dict[str, Any]:
    data = service.calculate_playlist_analytics(spotify_client, playlist_id)
    if data is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Playlist not found or failed to process."
        )
    return data


@router.post("/{playlist_id}/remove-duplicates", response_model=RemoveDuplicatesResponse)
def remove_duplicates(
    playlist_id: str, spotify_client: SpotifyClient = Depends(get_spotify_client)
) -> Dict[str, Any]:
    result = service.remove_duplicates_from_playlist(spotify_client, playlist_id)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to remove duplicates from Spotify.",
        )
    return result
