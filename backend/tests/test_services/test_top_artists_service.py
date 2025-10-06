"""Tests for the top artists service module."""

import pytest
from src.top_artists.service import get_top_artists

MOCK_ARTIST = {
    "id": "artist123",
    "name": "Test Artist",
    "genres": ["pop", "rock"],
    "popularity": 85,
    "images": [{"url": "http://example.com/image.jpg"}],
}

MOCK_TOP_ARTISTS_RESPONSE = {"items": [MOCK_ARTIST], "next": None}


@pytest.fixture
def mock_top_artists_response(mock_requests_get):
    """Mock top artists API response."""
    mock_requests_get.return_value.json.return_value = MOCK_TOP_ARTISTS_RESPONSE
    return mock_requests_get


def test_get_top_artists_success(mock_top_artists_response):
    """Test successful retrieval of top artists."""
    artists = get_top_artists("mock_token", "medium-term", 1)

    mock_top_artists_response.assert_called_once()
    assert len(artists) == 1
    assert artists[0]["id"] == "artist123"
    assert artists[0]["name"] == "Test Artist"
    assert "pop" in artists[0]["genres"]


def test_get_top_artists_invalid_time_range():
    """Test top artists retrieval with invalid time range."""
    with pytest.raises(ValueError, match="Invalid time range"):
        get_top_artists("mock_token", "invalid-range")


def test_get_top_artists_no_token():
    """Test top artists retrieval with no token."""
    result = get_top_artists(None)
    assert result is None


def test_get_top_artists_failure(mock_requests_get):
    """Test top artists retrieval failure."""
    mock_requests_get.side_effect = Exception("API Error")
    result = get_top_artists("mock_token")
    assert result is None


def test_get_top_artists_empty_response(mock_requests_get):
    """Test top artists retrieval with empty response."""
    mock_requests_get.return_value.json.return_value = {"items": []}
    result = get_top_artists("mock_token")
    assert result == []


def test_get_top_artists_custom_limit(mock_top_artists_response):
    """Test top artists retrieval with custom limit."""
    get_top_artists("mock_token", limit=20)
    args = mock_top_artists_response.call_args
    assert args is not None
    assert "params" in args[1]
    assert args[1]["params"]["limit"] == 20


@pytest.mark.parametrize("time_range", ["short-term", "medium-term", "long-term"])
def test_get_top_artists_time_ranges(time_range, mock_top_artists_response):
    """Test top artists retrieval with different time ranges."""
    get_top_artists("mock_token", time_range=time_range)
    args = mock_top_artists_response.call_args
    assert args is not None
    assert "params" in args[1]
    assert args[1]["params"]["time_range"] == time_range.replace("-", "_")
