from typing import Any, Dict, List, Optional, cast

import requests
from src.config.constants import SPOTIFY_API_BASE_URL

TIME_RANGES = {
    "short-term": "short_term",
    "medium-term": "medium_term",
    "long-term": "long_term",
}


def get_top_tracks(
    access_token: str, time_range: str = "medium-term", limit: int = 50
) -> Optional[List[Dict[str, Any]]]:

    if not access_token:
        return None

    if time_range not in TIME_RANGES:
        raise ValueError(
            f"Invalid time range: {time_range}. Must be one of {list(TIME_RANGES.keys())}"
        )

    spotify_time_range = TIME_RANGES[time_range]
    headers = {"Authorization": f"Bearer {access_token}"}
    params: dict[str, str | int] = {"time_range": spotify_time_range, "limit": limit}

    try:
        response = requests.get(
            f"{SPOTIFY_API_BASE_URL}/me/top/tracks", headers=headers, params=params, timeout=10
        )
        response.raise_for_status()
        return cast(List[Dict[str, Any]], response.json()["items"])
    except requests.exceptions.HTTPError as e:
        print(f"Error fetching top tracks: {e}")
        return None
