import json
from concurrent.futures import ProcessPoolExecutor
from typing import Any, Dict, List, Optional, Set, cast

import requests
from redis.client import Redis
from src.config.constants import SPOTIFY_API_BASE_URL

process_pool = ProcessPoolExecutor()
redis_client: Redis = Redis.from_url("redis://redis:6379")

TIME_RANGES = {
    "short-term": "short_term",
    "medium-term": "medium_term",
    "long-term": "long_term",
}


def get_user_playlists(access_token: str) -> Optional[List[Dict[str, Any]]]:
    """Fetch all user playlists from Spotify."""
    headers = {"Authorization": f"Bearer {access_token}"}
    playlists = []
    url = f"{SPOTIFY_API_BASE_URL}/me/playlists"
    while url:
        resp = requests.get(url, headers=headers)
        if resp.status_code != 200:
            return None
        data = resp.json()
        playlists.extend(data.get("items", []))
        url = data.get("next")
    return playlists


def get_playlist_tracks(access_token: str, playlist_id: str) -> List[Dict[str, Any]]:
    """Fetch all tracks in a playlist."""
    headers = {"Authorization": f"Bearer {access_token}"}
    tracks = []
    url = f"{SPOTIFY_API_BASE_URL}/playlists/{playlist_id}/tracks"
    while url:
        resp = requests.get(url, headers=headers)
        if resp.status_code != 200:
            break
        data = resp.json()
        tracks.extend([item["track"] for item in data.get("items", []) if item.get("track")])
        url = data.get("next")
    return tracks


def build_artist_song_count(tracks: List[Dict[str, Any]]) -> Dict[str, int]:
    """Count songs per artist, removing duplicates by track ID."""
    unique_tracks: Set[str] = set()
    artist_count: Dict[str, int] = {}

    for track in tracks:
        track_id = track.get("id")
        if not track_id or track_id in unique_tracks:
            continue
        unique_tracks.add(track_id)
        for artist in track.get("artists", []):
            artist_id = artist.get("id")
            if artist_id:
                artist_count[artist_id] = artist_count.get(artist_id, 0) + 1

    return artist_count


def get_top_artists_with_song_count(
    access_token: str, time_range: str = "medium-term"
) -> Optional[List[Dict[str, Any]]]:
    artists = get_top_artists(access_token, time_range=time_range)
    if artists is None:
        return None

    user_id = "me"
    playlist_cache_key = f"user:{user_id}:playlists"
    cached_playlists = redis_client.get(playlist_cache_key)
    if cached_playlists:
        playlists = json.loads(cached_playlists)
    else:
        playlists = get_user_playlists(access_token)
        redis_client.set(playlist_cache_key, json.dumps(playlists), ex=60 * 60 * 24)

    futures = [process_pool.submit(get_playlist_tracks, access_token, pl["id"]) for pl in playlists]
    all_tracks = []
    for f in futures:
        all_tracks.extend(f.result())

    artist_count_cache_key = f"user:{user_id}:artist_track_counts:{time_range}"
    cached_counts = redis_client.get(artist_count_cache_key)
    if cached_counts:
        artist_song_count = json.loads(cached_counts)
    else:
        artist_song_count = build_artist_song_count(all_tracks)
        redis_client.set(artist_count_cache_key, json.dumps(artist_song_count), ex=60 * 60 * 2)

    for artist in artists:
        artist_id = artist.get("id")
        artist["library_song_count"] = artist_song_count.get(artist_id, 0)

    return artists


def get_top_artists(
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
            f"{SPOTIFY_API_BASE_URL}/me/top/artists", headers=headers, params=params, timeout=10
        )
        response.raise_for_status()
        return cast(List[Dict[str, Any]], response.json()["items"])
    except requests.HTTPError:
        return None
    except Exception:
        return None
