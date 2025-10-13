from pydantic import BaseModel


class Genre(BaseModel):
    genre: str
    count: int
