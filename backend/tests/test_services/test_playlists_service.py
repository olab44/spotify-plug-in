import pytest
from src.playlists.service import get_playlist_data, get_user_playlists, remove_duplicate_tracks

MOCK_PLAYLIST = {
    "id": "playlist123",
    "name": "Test Playlist",
    "description": "A test playlist",
    "tracks": {"href": "tracks_url", "total": 1},
    "owner": {"id": "user123"},
}

MOCK_TRACKS_RESPONSE = {
    "items": [
        {
            "track": {
                "id": "track1",
                "uri": "spotify:track:track1",
                "name": "Track 1",
                "artists": [{"name": "Artist 1"}],
                "duration_ms": 180000,
                "popularity": 75,
                "explicit": False,
                "album": {"release_date": "2023-01-01"},
            }
        }
    ],
    "next": None,
}

MOCK_PLAYLISTS_RESPONSE = {"items": [MOCK_PLAYLIST], "next": None}


@pytest.fixture
def mock_playlist_response(mock_requests_get):
    """Mock playlist API responses. This fixture is now less useful due to multi-call/multi-response needs."""
    return mock_requests_get


@pytest.fixture
def mock_playlists_list_response(mock_requests_get):
    """Mock playlists list API response."""
    mock_requests_get.return_value.json.return_value = MOCK_PLAYLISTS_RESPONSE
    return mock_requests_get


def test_get_user_playlists_success(mock_playlists_list_response):
    """Test successful retrieval of user's playlists."""
    playlists = get_user_playlists("mock_token")
    print(playlists)

    mock_playlists_list_response.assert_called_once()
    assert len(playlists) == 1
    assert playlists[0]["id"] == "playlist123"
    assert playlists[0]["name"] == "Test Playlist"


def test_get_user_playlists_failure(mock_requests_get):
    """Test playlist retrieval failure."""
    mock_requests_get.side_effect = Exception("API Error")

    result = get_user_playlists("mock_token")
    assert result is None


def test_get_user_playlists_no_token():
    """Test playlist retrieval with no token."""
    result = get_user_playlists(None)
    assert result is None


def test_get_playlist_data_failure(mock_requests_get):
    """Test playlist data retrieval failure."""
    mock_requests_get.side_effect = Exception("API Error")

    result = get_playlist_data("mock_token", "playlist123")
    assert result is None


def test_get_playlist_data_no_token():
    """Test playlist data retrieval with no token."""
    result = get_playlist_data(None, "playlist123")
    assert result is None


def test_remove_duplicate_tracks_failure(mock_requests_delete):
    """Test failure in removing duplicate tracks."""
    mock_requests_delete.side_effect = Exception("API Error")

    result = remove_duplicate_tracks("mock_token", "playlist123")
    assert result is False


def test_remove_duplicate_tracks_no_token():
    """Test duplicate track removal with no token."""
    result = remove_duplicate_tracks(None, "playlist123")
    assert result is False
