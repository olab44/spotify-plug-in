import requests
from src.config.constants import SPOTIFY_API_BASE_URL
from src.config.tokens import TOKENS


def get_top_artists(access_token: str, time_range: str = "medium_term", limit: int = 50):
    token = TOKENS.get(access_token)
    if not token:
        return None
    headers = {"Authorization": f"Bearer {access_token}"}
    params = {"time_range": time_range, "limit": limit}
    response = requests.get(f"{SPOTIFY_API_BASE_URL}/me/top/artists", headers=headers, params=params)
    response.raise_for_status()
    return response.json()["items"]


def get_top_artists_short_term(access_token: str):
    return get_top_artists(access_token, time_range="short_term")


def get_top_artists_medium_term(access_token: str):
    return get_top_artists(access_token, time_range="medium_term")


def get_top_artists_long_term(access_token: str):
    return get_top_artists(access_token, time_range="long_term")
