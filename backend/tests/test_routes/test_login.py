"""Tests for the login router endpoints."""

import pytest
from fastapi import status
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_login_endpoint_success(async_client: AsyncClient):
    """Test successful login endpoint."""
    response = await async_client.get("/auth/login")
    assert response.status_code == status.HTTP_200_OK
    assert "url" in response.json()
    assert response.json()["url"].startswith("https://accounts.spotify.com/authorize")


@pytest.mark.asyncio
async def test_callback_endpoint_success(async_client: AsyncClient, mocker, mock_redis):
    """Test successful callback endpoint."""
    # Mock Spotify OAuth token exchange
    mock_token = {
        "access_token": "mock_access_token",
        "refresh_token": "mock_refresh_token",
        "expires_in": 3600,
        "token_type": "Bearer",
    }
    mocker.patch("src.login.service.SpotifyOAuth.get_access_token", return_value=mock_token)

    # Mock Spotify user info
    mock_user = {
        "id": "test_user",
        "display_name": "Test User",
        "email": "test@example.com",
    }
    mocker.patch("src.login.service.Spotify.current_user", return_value=mock_user)

    response = await async_client.get("/auth/callback?code=test_code&state=test_state")
    assert response.status_code == status.HTTP_302_FOUND
    assert response.headers["location"] == "/"


@pytest.mark.asyncio
async def test_callback_endpoint_missing_code(async_client: AsyncClient):
    """Test callback endpoint with missing code parameter."""
    response = await async_client.get("/auth/callback")
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.asyncio
async def test_callback_endpoint_invalid_state(async_client: AsyncClient, mock_redis):
    """Test callback endpoint with invalid state parameter."""
    response = await async_client.get("/auth/callback?code=test_code&state=invalid_state")
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.asyncio
async def test_callback_endpoint_spotify_error(async_client: AsyncClient, mocker, mock_redis):
    """Test callback endpoint when Spotify returns an error."""
    mocker.patch(
        "src.login.service.SpotifyOAuth.get_access_token",
        side_effect=Exception("Spotify API error"),
    )

    response = await async_client.get("/auth/callback?code=test_code&state=test_state")
    assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR


@pytest.mark.asyncio
async def test_logout_endpoint_success(async_client: AsyncClient, mock_current_user):
    """Test successful logout endpoint."""
    response = await async_client.post("/auth/logout")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"message": "Successfully logged out"}


@pytest.mark.asyncio
async def test_logout_endpoint_unauthorized(async_client: AsyncClient):
    """Test logout endpoint without authentication."""
    response = await async_client.post("/auth/logout")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
