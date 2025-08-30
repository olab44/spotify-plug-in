from collections import Counter
from typing import Dict, List, Optional

import requests
from src.top_artists.service import get_top_artists as get_raw_top_artists

TIME_RANGES = {
    "short-term": "short_term",
    "medium-term": "medium_term",
    "long-term": "long_term",
}


def get_top_genres(
    access_token: str, time_range: str = "medium-term", limit: int = 50
) -> Optional[List[Dict[str, int]]]:
    """
    Get user's top genres by aggregating genres from their top artists.
    """
    if not access_token:
        return None

    if time_range not in TIME_RANGES:
        raise ValueError(
            f"Invalid time range: {time_range}. Must be one of {list(TIME_RANGES.keys())}"
        )

    try:
        artists = get_raw_top_artists(access_token, time_range=time_range, limit=limit)

        if not artists:
            return None

        all_genres = [
            genre
            for artist in artists
            if "genres" in artist and isinstance(artist["genres"], list)
            for genre in artist["genres"]
        ]

        if not all_genres:
            return None

        genre_counts = Counter(all_genres)
        sorted_genres = [
            {"genre": genre, "count": count}
            for genre, count in genre_counts.most_common(10)
        ]

        return sorted_genres

    except requests.exceptions.HTTPError as e:
        print(f"Error fetching top artists for genre aggregation: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred in get_top_genres: {e}")
        return None
