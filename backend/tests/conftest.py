import asyncio
from typing import AsyncGenerator, Generator

import pytest
from fakeredis import aioredis
from fastapi import FastAPI
from fastapi.testclient import TestClient
from httpx import AsyncClient

from src.config.database import get_redis_client
from src.dependencies import get_current_user
from src.main import app

TEST_USER = {
    "id": "test_user_id",
    "display_name": "Test User",
    "email": "test@example.com",
    "access_token": "mock_access_token",
    "refresh_token": "mock_refresh_token",
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
def mock_redis():
    """Create a mock Redis client."""
    redis = aioredis.FakeRedis()
    app.dependency_overrides[get_redis_client] = lambda: redis
    yield redis
    app.dependency_overrides.pop(get_redis_client, None)


@pytest.fixture
def mock_current_user():
    """Mock the current user dependency."""

    async def override_get_current_user():
        return TEST_USER

    app.dependency_overrides[get_current_user] = override_get_current_user
    yield TEST_USER
    app.dependency_overrides.pop(get_current_user, None)


@pytest.fixture
def mock_spotify_api(mocker):
    """Mock Spotify API client."""
    return mocker.patch("src.config.spotify.Spotify")
