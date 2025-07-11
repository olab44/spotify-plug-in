from fastapi import APIRouter, Depends
from src.login.service import get_current_user
import src.user.service as spotify_service

router = APIRouter()


@router.get("/stats")
async def get_user_stats(user: dict = Depends(get_current_user)):
    """Return user listening statistics (minutes per month/year)."""
    return spotify_service.fetch_listening_stats(user["access_token"])


@router.get("/music-evolution")
async def get_music_evolution(user: dict = Depends(get_current_user)):
    """Return user's top genres and artists over time."""
    return spotify_service.fetch_music_evolution(user["access_token"])


@router.get("/discovery")
async def get_discovery(user: dict = Depends(get_current_user)):
    """Return most listened-to new song of the month/year."""
    return spotify_service.fetch_discovery(user["access_token"])


@router.get("/rankings")
async def get_rankings(user: dict = Depends(get_current_user)):
    """Return top 100 songs, artists, and genres."""
    return spotify_service.fetch_rankings(user)


@router.get("/language-analysis")
async def get_language_analysis(user: dict = Depends(get_current_user)):
    """Return the dominant languages in user's listening history."""
    return spotify_service.fetch_language_analysis(user)
