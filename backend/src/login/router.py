from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from src.config.dependencies import get_spotify_client
from src.config.spotify_client import AuthAPI, SpotifyClient
from starlette.responses import JSONResponse

from .schemas import SpotifyUser

router = APIRouter(tags=["login"])

auth_api = AuthAPI()


@router.get("/login")
def login() -> RedirectResponse:
    """Redirects the user to Spotify's authentication page."""
    auth_url = auth_api.get_auth_url()
    return RedirectResponse(url=auth_url)


@router.get("/callback")
def spotify_callback(code: str) -> RedirectResponse:
    token_data = auth_api.get_token_from_code(code)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Could not exchange code for token."
        )

    frontend_url = "http://localhost:8080/callback"
    return RedirectResponse(
        f"{frontend_url}#access_token={token_data['access_token']}&expires_in={token_data['expires_in']}"
    )


@router.post("/logout")
def logout() -> JSONResponse:
    return JSONResponse({"message": "Logout successful. Please clear token on client-side."})


@router.get("/me", response_model=SpotifyUser)
def get_user_info(client: SpotifyClient = Depends(get_spotify_client)) -> Dict[str, Any]:
    user_info = client.users.get_profile()
    if user_info is None:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to fetch user info from Spotify.",
        )
    return user_info
