import asyncio
from typing import AsyncGenerator, Generator
from unittest.mock import MagicMock

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from httpx import AsyncClient
from src.main import app

TEST_USER = {
    "id": "test_user_id",
    "display_name": "Test User",
    "email": "test@example.com",
    "access_token": "mock_access_token",
    "refresh_token": "mock_refresh_token",
}

MOCK_SPOTIFY_TOKEN = {
    "access_token": "mock_access_token",
    "token_type": "Bearer",
    "expires_in": 3600,
    "refresh_token": "mock_refresh_token",
    "scope": "user-read-private user-read-email",
}

MOCK_SPOTIFY_USER = {
    "id": "test_user_id",
    "display_name": "Test User",
    "email": "test@example.com",
    "country": "US",
    "product": "premium",
    "type": "user",
    "uri": "spotify:user:test_user_id",
}


@pytest.fixture(scope="session")
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def test_app() -> FastAPI:
    """Create a FastAPI test application."""
    return app


@pytest.fixture
def client(test_app: FastAPI) -> Generator[TestClient, None, None]:
    """Create a test client for the FastAPI application."""
    with TestClient(test_app) as client:
        yield client


@pytest.fixture
async def async_client(test_app: FastAPI) -> AsyncGenerator[AsyncClient, None]:
    """Create an async test client for the FastAPI application."""
    async with AsyncClient(app=test_app, base_url="http://test") as client:
        yield client


@pytest.fixture
def mock_requests_get(mocker):
    """Mock requests.get with a default success response."""
    mock = mocker.patch("requests.get")
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.raise_for_status.return_value = None
    mock.return_value = mock_response
    return mock


@pytest.fixture
def mock_requests_post(mocker):
    """Mock requests.post with a default success response."""
    mock = mocker.patch("requests.post")
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.raise_for_status.return_value = None
    mock.return_value = mock_response
    return mock


@pytest.fixture
def mock_requests_put(mocker):
    """Mock requests.put with a default success response."""
    mock = mocker.patch("requests.put")
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.raise_for_status.return_value = None
    mock.return_value = mock_response
    return mock


@pytest.fixture
def mock_requests_delete(mocker):
    """Mock requests.delete with a default success response."""
    mock = mocker.patch("requests.delete")
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.raise_for_status.return_value = None
    mock.return_value = mock_response
    return mock


@pytest.fixture
def mock_spotify_user_response(mock_requests_get):
    """Mock Spotify user info response."""
    mock_requests_get.return_value.json.return_value = MOCK_SPOTIFY_USER
    return mock_requests_get


@pytest.fixture
def mock_spotify_token_response(mock_requests_post):
    """Mock Spotify token response."""
    mock_requests_post.return_value.json.return_value = MOCK_SPOTIFY_TOKEN
    return mock_requests_post
