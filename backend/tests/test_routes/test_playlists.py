"""Tests for the playlists router endpoints."""

import pytest
from fastapi import status
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_playlists_success(
    async_client: AsyncClient, mock_current_user, mock_spotify_api
):
    """Test successful retrieval of user playlists."""
    # Mock data
    mock_playlists = {
        "items": [
            {
                "id": "playlist1",
                "name": "Playlist 1",
                "description": "Description 1",
                "images": [{"url": "http://example.com/image1.jpg"}],
                "tracks": {"total": 10},
            },
            {
                "id": "playlist2",
                "name": "Playlist 2",
                "description": "Description 2",
                "images": [{"url": "http://example.com/image2.jpg"}],
                "tracks": {"total": 20},
            },
        ],
        "total": 2,
    }

    # Configure mock
    mock_spotify = mock_spotify_api.return_value
    mock_spotify.current_user_playlists.return_value = mock_playlists

    response = await async_client.get("/playlists")
    assert response.status_code == status.HTTP_200_OK

    data = response.json()
    assert len(data) == 2
    assert data[0]["id"] == "playlist1"
    assert data[1]["id"] == "playlist2"


@pytest.mark.asyncio
async def test_get_playlists_unauthorized(async_client: AsyncClient):
    """Test playlists endpoint without authentication."""
    response = await async_client.get("/playlists")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.asyncio
async def test_get_playlist_stats_success(
    async_client: AsyncClient, mock_current_user, mock_spotify_api, mock_redis
):
    """Test successful retrieval of playlist statistics."""
    # Mock playlist tracks data
    mock_tracks = {
        "items": [
            {
                "track": {
                    "id": "track1",
                    "name": "Track 1",
                    "artists": [{"name": "Artist 1"}],
                    "album": {"name": "Album 1"},
                    "duration_ms": 180000,
                },
                "added_at": "2024-01-01T00:00:00Z",
            },
            {
                "track": {
                    "id": "track2",
                    "name": "Track 2",
                    "artists": [{"name": "Artist 2"}],
                    "album": {"name": "Album 2"},
                    "duration_ms": 240000,
                },
                "added_at": "2024-01-02T00:00:00Z",
            },
        ],
        "total": 2,
    }

    # Configure mock
    mock_spotify = mock_spotify_api.return_value
    mock_spotify.playlist_tracks.return_value = mock_tracks

    response = await async_client.get("/playlists/playlist123/stats")
    assert response.status_code == status.HTTP_200_OK

    data = response.json()
    assert "total_tracks" in data
    assert "total_duration" in data
    assert "unique_artists" in data
    assert "unique_albums" in data


@pytest.mark.asyncio
async def test_get_playlist_stats_not_found(
    async_client: AsyncClient, mock_current_user, mock_spotify_api
):
    """Test playlist stats endpoint with non-existent playlist."""
    # Configure mock to raise an exception
    mock_spotify = mock_spotify_api.return_value
    mock_spotify.playlist_tracks.side_effect = Exception("Playlist not found")

    response = await async_client.get("/playlists/nonexistent/stats")
    assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.asyncio
async def test_get_playlist_stats_invalid_id(async_client: AsyncClient, mock_current_user):
    """Test playlist stats endpoint with invalid playlist ID."""
    response = await async_client.get("/playlists/invalid%id/stats")
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.asyncio
async def test_get_playlist_stats_unauthorized(async_client: AsyncClient):
    """Test playlist stats endpoint without authentication."""
    response = await async_client.get("/playlists/playlist123/stats")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
