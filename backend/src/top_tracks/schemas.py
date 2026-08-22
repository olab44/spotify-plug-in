from typing import Dict, List

from pydantic import BaseModel, HttpUrl


class SpotifyArtistSimple(BaseModel):
    id: str
    name: str


class SpotifyAlbumImage(BaseModel):
    url: HttpUrl
    height: int
    width: int


class SpotifyAlbumSimple(BaseModel):
    id: str
    name: str
    images: List[SpotifyAlbumImage]


class SpotifyTrack(BaseModel):

    id: str
    name: str
    artists: List[SpotifyArtistSimple]
    album: SpotifyAlbumSimple
    duration_ms: int
    explicit: bool
    popularity: int
    uri: str
    external_urls: Dict[str, HttpUrl]
