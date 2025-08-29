import requests
from src.config.constants import SPOTIFY_API_BASE_URL


def get_top_artists(
    access_token: str, time_range: str = "medium_term", limit: int = 50
):
    """
    Fetches a user's top artists for a specified time range.
    """
    if not access_token:
        return None

    headers = {"Authorization": f"Bearer {access_token}"}
    params = {"time_range": time_range, "limit": limit}

    try:
        response = requests.get(
            f"{SPOTIFY_API_BASE_URL}/me/top/artists", headers=headers, params=params
        )
        response.raise_for_status()
        return response.json()["items"]
    except requests.HTTPError as e:
        print(f"Error fetching top artists: {e}")
        return None


def get_top_artists_short_term(access_token: str):
    return get_top_artists(access_token, time_range="short_term")


def get_top_artists_medium_term(access_token: str):
    return get_top_artists(access_token, time_range="medium_term")


def get_top_artists_long_term(access_token: str):
    return get_top_artists(access_token, time_range="long_term")
