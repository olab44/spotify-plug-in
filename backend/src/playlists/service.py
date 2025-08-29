import requests
from src.config.constants import SPOTIFY_API_BASE_URL


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


def get_playlist_tracks(access_token: str, playlist_id: str):
    """Fetches all tracks from a specific playlist synchronously."""
    if not access_token:
        return None

    headers = {"Authorization": f"Bearer {access_token}"}
    tracks = []
    url = f"{SPOTIFY_API_BASE_URL}/playlists/{playlist_id}/tracks?limit=100"

    try:
        while url:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            tracks.extend(
                [item["track"] for item in data["items"] if item.get("track")]
            )
            url = data.get("next")
        return tracks
    except requests.exceptions.RequestException as e:
        print(f"Error fetching playlist tracks: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred in get_playlist_tracks: {e}")
        return None
