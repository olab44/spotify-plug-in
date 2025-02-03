from pydantic import BaseModel


class SpotifyToken(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    refresh_token: str
    scope: str


class SpotifyUser(BaseModel):
    display_name: str
    email: str
    id: str
    images: list
