from unittest.mock import MagicMock

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient
from pydantic import BaseModel
from src.login.router import router
from starlette import status


class SpotifyToken(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    refresh_token: str
    scope: str


class SpotifyUser(BaseModel):
    display_name: str
    email: str
    id: str
    images: list


class LogoutRequest(BaseModel):
    access_token: str


MOCK_AUTH_URL = "https://accounts.spotify.com/authorize?client_id=123"
MOCK_TOKEN_DATA = {
    "access_token": "mock_access_token_123",
    "expires_in": 3600,
}
# Updated to match the new SpotifyUser schema (id, email, display_name, images: list)
MOCK_USER_INFO_DICT = {
    "id": "test_user_id",
    "email": "test@example.com",
    "display_name": "Test User",
    "images": [{"url": "http://img.com/avatar.jpg", "height": 64, "width": 64}],
}
# We need to simulate the SpotifyUser schema being returned
MOCK_USER_INFO_SCHEMA = SpotifyUser(**MOCK_USER_INFO_DICT)


# --- FIXTURES ---


@pytest.fixture(scope="module")
def client():
    """Provides a TestClient for the login router."""
    return TestClient(router)


@pytest.fixture(autouse=True)
def mock_service_dependencies(mocker):
    """
    Automatically mocks the service functions imported by the router.
    The path used for patching must be where the objects are imported (i.e., in the router module).
    """
    # Mocks for /login route
    mocker.patch("src.login.router.get_spotify_auth_url", return_value=MOCK_AUTH_URL)

    # Mocks for /callback route
    mock_token_getter = mocker.patch(
        "src.login.router.get_spotify_token",
        return_value=MagicMock(
            access_token=MOCK_TOKEN_DATA["access_token"], expires_in=MOCK_TOKEN_DATA["expires_in"]
        ),
    )

    # Mocks for /me route dependencies
    mock_current_user = mocker.patch(
        "src.login.router.get_current_user",
        return_value={"access_token": MOCK_TOKEN_DATA["access_token"]},
    )
    mock_user_info = mocker.patch(
        "src.login.router.get_spotify_user_info", return_value=MOCK_USER_INFO_SCHEMA
    )

    return {
        "get_spotify_token": mock_token_getter,
        "get_current_user": mock_current_user,
        "get_spotify_user_info": mock_user_info,
    }


# --- TEST CASES ---


class TestLoginRouter:
    """Tests all routes defined in src/login/router.py."""

    def test_login_success(self, client):
        """
        GIVEN the /login endpoint
        WHEN a GET request is made
        THEN it should return a 307 redirect to the Spotify authentication URL.
        """
        response = client.get("/login", allow_redirects=False)

        assert response.status_code == status.HTTP_307_TEMPORARY_REDIRECT
        assert response.headers["location"] == MOCK_AUTH_URL

    @pytest.mark.parametrize("code", ["valid_code_123", "another_code_456"])
    def test_callback_success(self, client, code, mock_service_dependencies):
        """
        GIVEN the /callback endpoint with a valid code
        WHEN a GET request is made
        THEN it should exchange the code for a token and redirect to the frontend URL
             with the token details in the fragment.
        """
        response = client.get(f"/callback?code={code}", allow_redirects=False)

        # 1. Check response status and redirect location
        assert response.status_code == status.HTTP_307_TEMPORARY_REDIRECT
        expected_redirect = (
            f"http://localhost:8080/callback#access_token={MOCK_TOKEN_DATA['access_token']}"
            f"&expires_in={MOCK_TOKEN_DATA['expires_in']}"
        )
        assert response.headers["location"] == expected_redirect

        # 2. Verify the token exchange service was called correctly
        mock_service_dependencies["get_spotify_token"].assert_called_once_with(code)

    def test_callback_failure(self, client, mock_service_dependencies):
        """
        GIVEN the /callback endpoint
        WHEN the token exchange fails (e.g., invalid code, network error)
        THEN it should return a 400 Bad Request with the exception details.
        """
        error_message = "Invalid or expired authorization code."
        # Configure the mock to raise a generic exception
        mock_service_dependencies["get_spotify_token"].side_effect = Exception(error_message)

        response = client.get("/callback?code=bad_code_999")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.json() == {"detail": error_message}
        mock_service_dependencies["get_spotify_token"].assert_called_once()

    def test_logout_success(self, client):
        """
        GIVEN the /logout endpoint
        WHEN a POST request is made
        THEN it should return a 200 success message.
        (Note: The router definition for /logout does not currently accept the LogoutRequest model.)
        """
        response = client.post("/logout")

        assert response.status_code == status.HTTP_200_OK
        assert response.json() == {"message": "Logged out successfully"}

    def test_get_user_info_success(self, client, mock_service_dependencies):
        """
        GIVEN the /me endpoint with a valid authenticated user
        WHEN a GET request is made
        THEN it should fetch user info from Spotify and return it, matching the UPDATED response model.
        """
        response = client.get("/me")

        # 1. Check response status and content
        assert response.status_code == status.HTTP_200_OK

        # Verify the returned JSON matches the updated mock dictionary structure
        assert response.json() == MOCK_USER_INFO_DICT

        # 2. Verify correct token was used
        expected_token = MOCK_TOKEN_DATA["access_token"]
        mock_service_dependencies["get_spotify_user_info"].assert_called_once_with(expected_token)

    def test_get_user_info_missing_token_failure(self, client, mock_service_dependencies):
        """
        GIVEN the /me endpoint
        WHEN the dependency returns a user object missing the access_token
        THEN it should raise a 401 Unauthorized exception.
        """
        # Configure the dependency to return a user without an access token
        mock_service_dependencies["get_current_user"].return_value = {"id": "user_id_only"}

        response = client.get("/me")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.json() == {"detail": "Access token missing in user dependency"}

        # Should not attempt to call Spotify
        mock_service_dependencies["get_spotify_user_info"].assert_not_called()

    def test_get_user_info_spotify_http_failure(self, client, mock_service_dependencies):

        mock_service_dependencies["get_spotify_user_info"].side_effect = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Spotify token"
        )

        response = client.get("/me")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.json() == {"detail": "Invalid Spotify token"}
        mock_service_dependencies["get_spotify_user_info"].assert_called_once()

    def test_get_user_info_generic_spotify_failure(self, client, mock_service_dependencies):
        generic_error = "Connection timed out"
        mock_service_dependencies["get_spotify_user_info"].side_effect = Exception(generic_error)

        response = client.get("/me")

        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        assert response.json()["detail"].startswith("Failed to fetch user info from Spotify:")
        assert generic_error in response.json()["detail"]
        mock_service_dependencies["get_spotify_user_info"].assert_called_once()
