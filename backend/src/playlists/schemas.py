from typing import Any, Dict, List, Optional

from pydantic import BaseModel, HttpUrl


class PlaylistTracksInfo(BaseModel):
    href: HttpUrl
    total: int


class PlaylistSimple(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    images: List[Dict[str, Any]]
    tracks: PlaylistTracksInfo


class PlaylistStats(BaseModel):
    totalTracks: int
    totalDuration: str
    avgPopularity: float

    class Config:
        extra = "allow"


class PlaylistDetails(BaseModel):
    tracks: List[Dict[str, Any]]
    stats: PlaylistStats


class RemoveDuplicatesResponse(BaseModel):
    message: str
    duplicates_found: int
    snapshot_id: str
