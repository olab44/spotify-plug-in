import requests
from src.config.constants import SPOTIFY_API_BASE_URL

from .stats import get_playlist_stats
from .utils import get_playlist_tracks


def get_user_playlists(access_token: str):
    """Fetches all of a user's playlists."""
    headers = {"Authorization": f"Bearer {access_token}"}
    playlists = []
    url = f"{SPOTIFY_API_BASE_URL}/me/playlists?limit=50"
    try:
        while url:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            playlists.extend(data["items"])
            url = data.get("next")
    except requests.RequestException as e:
        print(f"Error fetching user playlists: {e}")
        return None
    return playlists


def get_playlist_data(access_token: str, playlist_id: str):
    """Fetches tracks and calculates stats for a specific playlist."""
    headers = {"Authorization": f"Bearer {access_token}"}
    try:
        playlist_response = requests.get(
            f"{SPOTIFY_API_BASE_URL}/playlists/{playlist_id}", headers=headers
        )
        playlist_response.raise_for_status()
        playlist_info = playlist_response.json()
        tracks = [item["track"] for item in playlist_info["tracks"]["items"]]

        stats = get_playlist_stats(access_token, playlist_id)
        if stats is None:
            return None

        return {"tracks": playlist_info["tracks"]["items"], "stats": stats}
    except requests.exceptions.RequestException as e:
        print(f"Error fetching playlist data: {e}")
        return None


def remove_duplicate_tracks(access_token: str, playlist_id: str):
    """Removes all duplicate tracks from a playlist."""
    if not access_token:
        return None

    tracks = get_playlist_tracks(access_token, playlist_id)
    if not tracks:
        return None

    seen_track_ids = set()
    duplicates_to_remove = []

    for track in tracks:
        if track["id"] in seen_track_ids:
            duplicates_to_remove.append({"uri": track["uri"]})
        else:
            seen_track_ids.add(track["id"])

    if not duplicates_to_remove:
        return True

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    batch_size = 100
    for i in range(0, len(duplicates_to_remove), batch_size):
        batch = duplicates_to_remove[i : i + batch_size]
        payload = {"tracks": batch}
        url = f"{SPOTIFY_API_BASE_URL}/playlists/{playlist_id}/tracks"
        try:
            response = requests.delete(url, headers=headers, json=payload)
            response.raise_for_status()
        except requests.RequestException as e:
            print(f"Error removing tracks from playlist: {e}")
            return False

    return True
