from typing import Any, Dict, List, Optional

import requests
from src.config.constants import SPOTIFY_API_BASE_URL

from .stats import get_playlist_stats
from .utils import get_playlist_tracks


def get_user_playlists(access_token: str) -> Optional[List[Dict]]:
    """Fetches all of a user's playlists."""
    if not access_token:
        return None

    headers = {"Authorization": f"Bearer {access_token}"}
    playlists: List[Dict] = []
    url = f"{SPOTIFY_API_BASE_URL}/me/playlists?limit=50"

    try:
        while url:
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            data = response.json()
            playlists.extend(data["items"])
            url = data.get("next")
    except requests.RequestException as e:
        print(f"Error fetching user playlists: {e}")
        return None
    except Exception:
        return None

    return playlists


def get_playlist_data(
    access_token: str, playlist_id: str
) -> Optional[Dict[str, List[Dict] | Dict]]:
    """Fetches tracks and calculates stats for a specific playlist."""
    if not access_token or not playlist_id:
        return None

    headers = {"Authorization": f"Bearer {access_token}"}

    try:
        playlist_response = requests.get(
            f"{SPOTIFY_API_BASE_URL}/playlists/{playlist_id}", headers=headers, timeout=10
        )
        playlist_response.raise_for_status()

        tracks = get_playlist_tracks(access_token, playlist_id)
        if tracks is None:
            return None

        stats = get_playlist_stats(access_token, playlist_id)
        if stats is None:
            return None

        return {"tracks": tracks, "stats": stats}

    except requests.exceptions.RequestException:
        return None
    except Exception:
        return None


def remove_duplicate_tracks(access_token: str, playlist_id: str) -> bool:
    """Removes all duplicate tracks from a playlist.
    Returns True on success, False on failure or if no tracks found/auth fails.
    """
    if not access_token:
        return False

    tracks = get_playlist_tracks(access_token, playlist_id)
    if not tracks:
        return False

    seen_track_uris = set()
    duplicates_by_uri: Dict[str, List[int]] = {}

    for index, item in enumerate(tracks):
        track_data = item.get("track")
        if not track_data or not track_data.get("uri"):
            continue

        uri = track_data["uri"]

        if uri in seen_track_uris:
            if uri not in duplicates_by_uri:
                duplicates_by_uri[uri] = []
            duplicates_by_uri[uri].append(index)
        else:
            seen_track_uris.add(uri)

    if not duplicates_by_uri:
        return True

    tracks_to_delete: List[Dict[str, Any]] = [
        {"uri": uri, "positions": positions} for uri, positions in duplicates_by_uri.items()
    ]

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }
    url = f"{SPOTIFY_API_BASE_URL}/playlists/{playlist_id}/tracks"

    payload = {"tracks": tracks_to_delete}

    try:
        response = requests.delete(url, headers=headers, json=payload, timeout=10)
        response.raise_for_status()
    except requests.RequestException:
        return False
    except Exception:
        return False

    return True
