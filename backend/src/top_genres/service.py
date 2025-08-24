from collections import Counter

import requests
from src.top_artists.service import get_top_artists as get_raw_top_artists


def get_top_genres(access_token: str, time_range: str = "medium_term", limit: int = 50):
    """
    Fetches top artists for a given time range and aggregates their genres
    to determine the most frequently occurring genres.

    Args:
        access_token (str): The Spotify access token for the user.
        time_range (str): The time range for top artists (short_term, medium_term, long_term).
        limit (int): The maximum number of top artists to fetch to derive genres from.
                     (Note: More artists will provide a broader genre analysis).

    Returns:
        List[Dict[str, Any]] | None: A list of dictionaries, where each dictionary
                                     contains 'genre' and 'count', sorted by count
                                     in descending order. Returns None if fetching
                                     artists fails or no genres are found.
    """
    if not access_token:
        return None

    try:
        artists = get_raw_top_artists(access_token, time_range=time_range, limit=limit)

        if not artists:
            return None

        all_genres = []
        for artist in artists:
            if "genres" in artist and isinstance(artist["genres"], list):
                all_genres.extend(artist["genres"])

        if not all_genres:
            return None

        genre_counts = Counter(all_genres)

        sorted_genres = sorted(
            [{"genre": genre, "count": count} for genre, count in genre_counts.items()],
            key=lambda x: x["count"],
            reverse=True,
        )

        return sorted_genres

    except requests.exceptions.HTTPError as e:
        print(f"Error fetching top artists for genre aggregation: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred in get_top_genres: {e}")
        return None


def get_top_genres_short_term(access_token: str):
    """Gets top genres for the short term."""
    return get_top_genres(access_token, time_range="short_term")


def get_top_genres_medium_term(access_token: str):
    """Gets top genres for the medium term."""
    return get_top_genres(access_token, time_range="medium_term")


def get_top_genres_long_term(access_token: str):
    """Gets top genres for the long term."""
    return get_top_genres(access_token, time_range="long_term")
