from typing import Dict, List, Optional

import requests
from src.config.constants import SPOTIFY_API_BASE_URL


def get_playlist_tracks(access_token: str, playlist_id: str) -> Optional[List[Dict]]:
    """Fetches all tracks from a specific playlist synchronously."""
    if not access_token:
        raise ValueError("Access token is required")

    headers = {"Authorization": f"Bearer {access_token}"}
    tracks = []
    url = f"{SPOTIFY_API_BASE_URL}/playlists/{playlist_id}/tracks?limit=100"

    try:
        while url:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()

            for item in data.get("items", []):
                track = item.get("track")
                if track and track.get("id") and track.get("name"):
                    track["artists"] = track.get("artists", [])
                    track["album"] = track.get("album", {})
                    track["duration_ms"] = track.get("duration_ms", 0)
                    track["popularity"] = track.get("popularity", 0)
                    tracks.append(track)

            url = data.get("next")

        if not tracks:
            raise ValueError("No valid tracks found in playlist")

        return tracks
    except requests.exceptions.RequestException as e:
        print(f"Error fetching playlist tracks: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred in get_playlist_tracks: {e}")
        return None
