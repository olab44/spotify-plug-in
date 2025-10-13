from typing import Dict, List, Optional

from pydantic import BaseModel, HttpUrl


class ArtistImage(BaseModel):
    url: HttpUrl
    height: int
    width: int


class Artist(BaseModel):
    id: str
    name: str
    genres: List[str]
    images: List[ArtistImage]
    uri: str
    external_urls: Dict[str, HttpUrl]
    library_song_count: Optional[int] = None
