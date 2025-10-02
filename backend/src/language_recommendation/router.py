from fastapi import APIRouter, HTTPException

from .schemas import LanguageRecommendationRequest, LanguageRecommendationResponse
from .service import recommend_languages

router = APIRouter()


@router.post("/recommend", response_model=LanguageRecommendationResponse)
def recommend(request: LanguageRecommendationRequest) -> LanguageRecommendationResponse:
    try:
        response = recommend_languages(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
