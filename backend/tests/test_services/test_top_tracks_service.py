"""Tests for the top tracks service."""

from unittest.mock import Mock

import pytest

from src.top_tracks.service import get_top_tracks


@pytest.mark.asyncio
async def test_get_top_tracks_success(mock_spotify_api):
    """Test successful retrieval of top tracks."""
    # Mock data
    mock_tracks = [
        {
            "id": "track1",
            "name": "Track 1",
            "artists": [{"name": "Artist 1"}],
            "album": {"name": "Album 1"},
            "popularity": 80,
            "preview_url": "http://example.com/preview1",
            "external_urls": {"spotify": "http://spotify.com/track1"},
        },
        {
            "id": "track2",
            "name": "Track 2",
            "artists": [{"name": "Artist 2"}],
            "album": {"name": "Album 2"},
            "popularity": 75,
            "preview_url": "http://example.com/preview2",
            "external_urls": {"spotify": "http://spotify.com/track2"},
        },
    ]

    # Configure mock
    mock_spotify = Mock()
    mock_spotify.current_user_top_tracks.return_value = {"items": mock_tracks}
    mock_spotify_api.return_value = mock_spotify

    # Test with default parameters
    result = await get_top_tracks(access_token="mock_token", time_range="medium_term", limit=20)

    # Verify results
    assert len(result) == 2
    assert result[0]["id"] == "track1"
    assert result[0]["name"] == "Track 1"
    assert result[1]["id"] == "track2"
    assert result[1]["name"] == "Track 2"

    # Verify Spotify API was called with correct parameters
    mock_spotify.current_user_top_tracks.assert_called_once_with(
        time_range="medium_term", limit=20, offset=0
    )


@pytest.mark.asyncio
async def test_get_top_tracks_empty_response(mock_spotify_api):
    """Test handling of empty response from Spotify API."""
    # Configure mock
    mock_spotify = Mock()
    mock_spotify.current_user_top_tracks.return_value = {"items": []}
    mock_spotify_api.return_value = mock_spotify

    result = await get_top_tracks(access_token="mock_token", time_range="short_term", limit=10)

    assert len(result) == 0


@pytest.mark.asyncio
async def test_get_top_tracks_error_handling(mock_spotify_api):
    """Test error handling in get_top_tracks."""
    # Configure mock to raise an exception
    mock_spotify = Mock()
    mock_spotify.current_user_top_tracks.side_effect = Exception("Spotify API error")
    mock_spotify_api.return_value = mock_spotify

    with pytest.raises(Exception) as exc_info:
        await get_top_tracks(access_token="mock_token", time_range="long_term", limit=50)

    assert "Spotify API error" in str(exc_info.value)


@pytest.mark.asyncio
async def test_get_top_tracks_with_different_time_ranges(mock_spotify_api):
    """Test get_top_tracks with different time ranges."""
    mock_spotify = Mock()
    mock_spotify.current_user_top_tracks.return_value = {"items": []}
    mock_spotify_api.return_value = mock_spotify

    time_ranges = ["short_term", "medium_term", "long_term"]
    for time_range in time_ranges:
        await get_top_tracks(access_token="mock_token", time_range=time_range, limit=20)
        mock_spotify.current_user_top_tracks.assert_called_with(
            time_range=time_range, limit=20, offset=0
        )


@pytest.mark.asyncio
async def test_get_top_tracks_with_different_limits(mock_spotify_api):
    """Test get_top_tracks with different limit values."""
    mock_spotify = Mock()
    mock_spotify.current_user_top_tracks.return_value = {"items": []}
    mock_spotify_api.return_value = mock_spotify

    limits = [10, 20, 50]
    for limit in limits:
        await get_top_tracks(access_token="mock_token", time_range="medium_term", limit=limit)
        mock_spotify.current_user_top_tracks.assert_called_with(
            time_range="medium_term", limit=limit, offset=0
        )
