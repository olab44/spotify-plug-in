from unittest.mock import MagicMock

import pytest
import requests
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from src.config.constants import DEFAULT_SCOPES, SPOTIFY_AUTH_URL
from src.login.schemas import SpotifyToken, SpotifyUser
from src.login.service import (
    get_current_user,
    get_spotify_auth_url,
    get_spotify_token,
    get_spotify_user_info,
)

MOCK_SPOTIFY_USER_FIXED = {
    "id": "test_user_id",
    "display_name": "Test User",
    "email": "test@example.com",
    "country": "US",
    "product": "premium",
    "type": "user",
    "uri": "spotify:user:test_user_id",
    "images": [],
}


def test_get_spotify_auth_url_success(mocker):
    """Test successful generation of Spotify authorization URL."""

    mocker.patch("src.login.service.SPOTIFY_CLIENT_ID", "MOCK_ID")
    mocker.patch("src.login.service.SPOTIFY_REDIRECT_URI", "http://mock.redirect.com")
    url = get_spotify_auth_url()

    assert SPOTIFY_AUTH_URL in url
    assert "client_id=MOCK_ID" in url
    assert "response_type=code" in url
    assert f"scope={DEFAULT_SCOPES}" in url


def test_get_spotify_auth_url_missing_config(mocker):
    mocker.patch("src.login.service.SPOTIFY_CLIENT_ID", None)
    mocker.patch("src.login.service.SPOTIFY_REDIRECT_URI", "http://mock.redirect.com")

    with pytest.raises(ValueError, match="SPOTIFY_CLIENT_ID or SPOTIFY_REDIRECT_URI is not set"):
        get_spotify_auth_url()


def test_get_spotify_token_success(mock_spotify_token_response):
    """Test successful token exchange."""
    token = get_spotify_token("test_code")

    assert isinstance(token, SpotifyToken)
    assert token.access_token == "mock_access_token"
    assert token.token_type == "Bearer"
    assert token.expires_in == 3600
    assert token.refresh_token == "mock_refresh_token"


def test_get_spotify_token_failure(mock_requests_post):
    """Test token exchange failure."""

    mock_response = MagicMock(status_code=400)
    mock_response.raise_for_status.side_effect = requests.exceptions.HTTPError(
        "400 Client Error", response=mock_response
    )
    mock_requests_post.return_value = mock_response

    with pytest.raises(HTTPException) as exc_info:
        get_spotify_token("invalid_code")

    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "Failed to get token from Spotify"


def test_get_spotify_user_info_success(mock_spotify_user_response):
    mock_spotify_user_response.return_value.json.return_value = MOCK_SPOTIFY_USER_FIXED

    user = get_spotify_user_info("mock_access_token")

    assert isinstance(user, SpotifyUser)
    assert user.id == "test_user_id"
    assert user.display_name == "Test User"
    assert user.email == "test@example.com"


def test_get_spotify_user_info_failure(mock_requests_get):
    """Test user info retrieval failure."""
    mock_response = MagicMock(status_code=401)
    mock_response.raise_for_status.side_effect = requests.exceptions.HTTPError(
        "401 Client Error", response=mock_response
    )
    mock_requests_get.return_value = mock_response

    with pytest.raises(HTTPException) as exc_info:
        get_spotify_user_info("invalid_token")

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Failed to fetch user info from Spotify"


def test_get_current_user_success():
    """Test successful current user retrieval."""
    token = HTTPAuthorizationCredentials(scheme="Bearer", credentials="mock_access_token")
    user = get_current_user(token)
    assert user == {"access_token": "mock_access_token"}


def test_get_current_user_no_token():

    token = HTTPAuthorizationCredentials(scheme="Bearer", credentials="")

    with pytest.raises(HTTPException) as exc_info:
        get_current_user(token)

    assert exc_info.value.status_code == 401
    assert "Not authenticated: No bearer token provided" in str(exc_info.value.detail)


@pytest.mark.parametrize(
    "token_obj,expected",
    [
        (HTTPAuthorizationCredentials(scheme="Bearer", credentials="abc123"), "abc123"),
        (HTTPAuthorizationCredentials(scheme="Bearer", credentials=""), HTTPException),
    ],
)
def test_get_current_user_behavior_parametrize(token_obj, expected):
    """Test parameterized cases for get_current_user."""
    if expected == HTTPException:
        with pytest.raises(HTTPException) as exc:
            get_current_user(token_obj)
        assert exc.value.status_code == 401
    else:
        user = get_current_user(token_obj)
        assert user["access_token"] == expected
