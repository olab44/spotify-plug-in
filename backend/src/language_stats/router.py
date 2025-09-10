from fastapi import APIRouter, Depends, HTTPException
from src.login.service import get_current_user

from .schemas import LanguageStats
from .service import get_language_stats

router = APIRouter()


@router.get("/stats", response_model=LanguageStats)
async def get_stats(user: dict = Depends(get_current_user)):
    """
    Get language statistics for the user's top tracks.
    """
    access_token = user.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        stats = await get_language_stats(access_token)
        if not stats:
            raise HTTPException(
                status_code=404,
                detail="No language statistics available. Try listening to more music!",
            )
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze language statistics: {str(e)}",
        )
