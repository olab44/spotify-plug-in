from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from starlette.responses import JSONResponse

from .schemas import SpotifyUser
from .service import (
    get_current_user,
    get_spotify_auth_url,
    get_spotify_token,
    get_spotify_user_info,
)

router = APIRouter(tags=["spotify"])


@router.get("/login")
def login() -> RedirectResponse:
    """Redirects the user to Spotify's authentication page."""
    auth_url = get_spotify_auth_url()
    return RedirectResponse(url=auth_url)


@router.get("/callback")
def spotify_callback(code: str) -> RedirectResponse:
    """Exchanges code for token and redirects to frontend with token in URL fragment."""
    try:
        token_data = get_spotify_token(code)
        return RedirectResponse(
            f"http://localhost:8080/callback#access_token={token_data.access_token}&expires_in={token_data.expires_in}"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/logout")
def logout() -> JSONResponse:
    """Removes the token from the in-memory store."""
    return JSONResponse({"message": "Logged out successfully"})


@router.get("/me", response_model=SpotifyUser)
def get_user_info(user: dict = Depends(get_current_user)) -> SpotifyUser:
    """Fetches and returns the current user's profile information."""
    access_token = user.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Access token missing in user dependency")
    try:
        user_info = get_spotify_user_info(access_token)
        return user_info
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch user info from Spotify: {e}")
