from typing import List

from pydantic import BaseModel


class LanguageCount(BaseModel):
    language_code: str
    count: int
    percentage: float
    example_tracks: List[str] = []


class LanguageStats(BaseModel):
    total_tracks: int
    languages: List[LanguageCount]
    top_languages: List[str]
    dominant_language: str
    language_diversity_score: float


class CachedLanguageData(BaseModel):
    track_id: str
    language: str
    timestamp: float
    confidence_score: float
