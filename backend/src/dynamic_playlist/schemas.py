from typing import List

from pydantic import BaseModel, Field


class Track(BaseModel):
    uri: str
    name: str
    artist: str


class PlaylistDetails(BaseModel):
    id: str
    name: str
    description: str
    url: str
    owner: str
    tracks: List[Track]


class AddTrackRequest(BaseModel):
    track_uri: str = Field(..., description="The Spotify URI of the track to add.")
