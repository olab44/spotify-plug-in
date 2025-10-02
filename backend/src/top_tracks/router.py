from fastapi import APIRouter, Depends, HTTPException, Path
from src.login.service import get_current_user

from .service import get_top_tracks

router = APIRouter()


@router.get("/{time_range}")
def get_top_tracks_for_period(
    time_range: str = Path(
        ..., description="Time range for top tracks", regex="^(short|medium|long)-term$"
    ),
    user: dict = Depends(get_current_user),
) -> list:
    access_token = user.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        tracks = get_top_tracks(access_token, time_range=time_range)
        if tracks is None:
            raise HTTPException(
                status_code=401, detail="Failed to fetch top tracks or token expired"
            )
        return tracks
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
