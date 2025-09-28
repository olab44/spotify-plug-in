from collections import Counter
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional

import requests
from fastapi import HTTPException
from src.config.constants import SPOTIFY_API_BASE_URL

PLAYLIST_NAME = "My Top 20: 24h Hits"


def create_or_update_dynamic_playlist(access_token: str) -> str:
    headers = {"Authorization": f"Bearer {access_token}"}

    playlist_id = find_existing_playlist(access_token, headers)

    if not playlist_id:
        playlist_id = create_new_playlist(access_token, headers)

    tracks = get_recently_played_tracks(access_token, headers)
    if not tracks:
        raise ValueError("No recently played tracks found in the last 24 hours.")

    track_uris = [track["track"]["uri"] for track in tracks]
    top_tracks = Counter(track_uris).most_common(20)
    top_track_uris = [uri for uri, count in top_tracks]

    replace_playlist_items(playlist_id, top_track_uris, headers)

    return playlist_id


def find_existing_playlist(access_token: str, headers: Dict[str, str]) -> Optional[str]:
    try:
        user_id = str(
            requests.get(f"{SPOTIFY_API_BASE_URL}/me", headers=headers, timeout=10).json()["id"]
        )
        response = requests.get(
            f"{SPOTIFY_API_BASE_URL}/users/{user_id}/playlists", headers=headers, timeout=10
        )
        response.raise_for_status()
        playlists = response.json()["items"]
        for playlist in playlists:
            if playlist["name"] == PLAYLIST_NAME:
                return str(playlist["id"])
        return None
    except requests.HTTPError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Error finding playlist: {e.response.text}",
        )


def create_new_playlist(access_token: str, headers: Dict[str, str]) -> str:
    try:
        user_id = str(
            requests.get(f"{SPOTIFY_API_BASE_URL}/me", headers=headers, timeout=10).json()["id"]
        )
        payload = {
            "name": PLAYLIST_NAME,
            "description": "Your most listened-to songs from the last 24 hours. Automatically updated!",
            "public": True,
        }
        response = requests.post(
            f"{SPOTIFY_API_BASE_URL}/users/{user_id}/playlists",
            headers=headers,
            json=payload,
            timeout=10,
        )
        response.raise_for_status()
        return str(response.json()["id"])
    except requests.HTTPError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Error creating playlist: {e.response.text}",
        )


def get_recently_played_tracks(access_token: str, headers: Dict[str, str]) -> List[Dict]:
    all_tracks: List[Dict] = []
    timestamp_24h_ago = int((datetime.now(timezone.utc) - timedelta(hours=24)).timestamp() * 1000)

    params = {"limit": 50, "after": timestamp_24h_ago}
    try:
        while True:
            response = requests.get(
                f"{SPOTIFY_API_BASE_URL}/me/player/recently-played",
                headers=headers,
                params=params,
                timeout=10,
            )
            response.raise_for_status()
            data = response.json()
            items = data.get("items", [])
            if not items:
                break
            all_tracks.extend(items)

            if "next" in data:

                params = {}

                next_url = data.get("next")
                if next_url:
                    pass

                if "next" not in data:
                    break
            else:
                break

        return all_tracks
    except requests.HTTPError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Error fetching recently played tracks: {e.response.text}",
        )


def replace_playlist_items(
    playlist_id: str, track_uris: List[str], headers: Dict[str, str]
) -> None:
    if not track_uris:
        payload: Dict[str, List[str]] = {"uris": []}
    else:
        payload = {"uris": track_uris}
    try:
        response = requests.put(
            f"{SPOTIFY_API_BASE_URL}/playlists/{playlist_id}/tracks",
            headers=headers,
            json=payload,
            timeout=10,
        )
        response.raise_for_status()
    except requests.HTTPError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Error replacing playlist items: {e.response.text}",
        )
