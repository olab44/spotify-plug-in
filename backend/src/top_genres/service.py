from collections import Counter
from typing import Dict, List

from src.config.spotify_client import SpotifyClient


def get_top_genres(
    spotify_client: SpotifyClient, time_range: str, artist_limit: int = 50, genre_limit: int = 10
) -> List[Dict[str, int]]:
    artists = spotify_client.users.get_top_artists(time_range=time_range, limit=artist_limit)

    if not artists:
        return []

    all_genres = [genre for artist in artists for genre in artist.get("genres", [])]

    if not all_genres:
        return []

    genre_counts = Counter(all_genres)
    sorted_genres = [
        {"genre": genre, "count": count} for genre, count in genre_counts.most_common(genre_limit)
    ]

    return sorted_genres
