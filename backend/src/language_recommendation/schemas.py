from typing import Any, Dict, List

from pydantic import BaseModel


class ArtistSimple(BaseModel):
    id: str
    name: str
    genres: List[str] = []
    popularity: int = 0
    external_urls: Dict[str, Any] = {}


class RecommendationRequest(BaseModel):
    target_language: str
    limit: int = 20
    include_artists: List[str] = []


class RecommendationResponse(BaseModel):
    recommendations: List[ArtistSimple]
