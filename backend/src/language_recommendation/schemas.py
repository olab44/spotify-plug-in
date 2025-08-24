from typing import List

from pydantic import BaseModel


class LanguageRecommendationRequest(BaseModel):
    user_id: str
    languages: List[str]


class LanguageRecommendationResponse(BaseModel):
    podcasts: List[str]
    music_tracks: List[str]
    playlist_url: str
    lyrics: List[str]
    translations: List[str]
