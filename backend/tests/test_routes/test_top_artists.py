"""Tests for top artists router endpoints."""

import pytest
from fastapi import status
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_top_artists_success(
    async_client: AsyncClient, mock_current_user, mock_spotify_api
):
    """Test successful retrieval of top artists."""
    # Mock data
    mock_artists = {
        "items": [
            {
                "id": "artist1",
                "name": "Artist 1",
                "genres": ["rock", "alternative"],
                "popularity": 80,
                "images": [{"url": "http://example.com/image1.jpg"}],
                "external_urls": {"spotify": "http://spotify.com/artist1"},
            },
            {
                "id": "artist2",
                "name": "Artist 2",
                "genres": ["pop", "electronic"],
                "popularity": 75,
                "images": [{"url": "http://example.com/image2.jpg"}],
                "external_urls": {"spotify": "http://spotify.com/artist2"},
            },
        ],
        "total": 2,
    }

    # Configure mock
    mock_spotify = mock_spotify_api.return_value
    mock_spotify.current_user_top_artists.return_value = mock_artists

    response = await async_client.get("/top-artists?time_range=medium_term&limit=20")
    assert response.status_code == status.HTTP_200_OK

    data = response.json()
    assert len(data) == 2
    assert data[0]["id"] == "artist1"
    assert data[1]["id"] == "artist2"

    # Verify correct parameters were used
    mock_spotify.current_user_top_artists.assert_called_once_with(
        time_range="medium_term", limit=20, offset=0
    )


@pytest.mark.asyncio
async def test_get_top_artists_unauthorized(async_client: AsyncClient):
    """Test top artists endpoint without authentication."""
    response = await async_client.get("/top-artists")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.asyncio
async def test_get_top_artists_invalid_time_range(async_client: AsyncClient, mock_current_user):
    """Test top artists endpoint with invalid time range."""
    response = await async_client.get("/top-artists?time_range=invalid_range&limit=20")
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.asyncio
async def test_get_top_artists_invalid_limit(async_client: AsyncClient, mock_current_user):
    """Test top artists endpoint with invalid limit."""
    response = await async_client.get("/top-artists?time_range=medium_term&limit=0")
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    response = await async_client.get("/top-artists?time_range=medium_term&limit=101")
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.asyncio
async def test_get_top_artists_spotify_error(
    async_client: AsyncClient, mock_current_user, mock_spotify_api
):
    """Test error handling when Spotify API fails."""
    # Configure mock to raise an exception
    mock_spotify = mock_spotify_api.return_value
    mock_spotify.current_user_top_artists.side_effect = Exception("Spotify API error")

    response = await async_client.get("/top-artists?time_range=medium_term&limit=20")
    assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR


@pytest.mark.asyncio
async def test_get_top_artists_different_time_ranges(
    async_client: AsyncClient, mock_current_user, mock_spotify_api
):
    """Test top artists endpoint with different time ranges."""
    mock_spotify = mock_spotify_api.return_value
    mock_spotify.current_user_top_artists.return_value = {"items": []}

    time_ranges = ["short_term", "medium_term", "long_term"]
    for time_range in time_ranges:
        response = await async_client.get(f"/top-artists?time_range={time_range}&limit=20")
        assert response.status_code == status.HTTP_200_OK
        mock_spotify.current_user_top_artists.assert_called_with(
            time_range=time_range, limit=20, offset=0
        )
