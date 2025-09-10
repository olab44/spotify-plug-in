from typing import List, Optional

from pydantic import BaseModel


class LanguageCount(BaseModel):
    language_code: str
    count: int
    percentage: float
    example_tracks: List[str] = []


class LanguageStats(BaseModel):
    total_tracks: int
    languages: List[LanguageCount]
    dominant_language: str
    language_diversity_score: float


class CachedLanguageData(BaseModel):
    track_id: str
    language: str
    timestamp: str
    confidence_score: float
