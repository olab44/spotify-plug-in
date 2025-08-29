from collections import defaultdict

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


def get_genres_for_artists(access_token: str, artist_ids: list):
    """Fetches genres for a list of artist IDs."""
    if not access_token or not artist_ids:
        return {}

    headers = {"Authorization": f"Bearer {access_token}"}
    genres = set()

    for i in range(0, len(artist_ids), 50):
        batch_ids = artist_ids[i : i + 50]
        ids_param = ",".join(batch_ids)
        url = f"{SPOTIFY_API_BASE_URL}/artists?ids={ids_param}"
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            for artist in data.get("artists", []):
                genres.update(artist.get("genres", []))
        except requests.RequestException as e:
            print(f"Error fetching artist data: {e}")
            return {}

    return list(genres)


def get_playlist_data(access_token: str, playlist_id: str):
    """Fetches tracks and calculates stats for a specific playlist."""
    tracks = []
    headers = {"Authorization": f"Bearer {access_token}"}
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
    except requests.exceptions.RequestException as e:
        print(f"Error fetching playlist tracks: {e}")
        return None

    if not tracks:
        return None

    stats = {}

    total_ms = sum(track["duration_ms"] for track in tracks)
    total_seconds = total_ms // 1000
    minutes = (total_seconds % 3600) // 60
    hours = total_seconds // 3600
    stats["totalDuration"] = f"{hours}h {minutes}m"

    release_years = [
        int(track["album"]["release_date"].split("-")[0]) for track in tracks
    ]
    stats["avgReleaseYear"] = (
        sum(release_years) / len(release_years) if release_years else 0
    )
    stats["oldestTrack"] = {
        "name": min(tracks, key=lambda t: t["album"]["release_date"])["name"],
        "year": min(release_years),
    }
    stats["newestTrack"] = {
        "name": max(tracks, key=lambda t: t["album"]["release_date"])["name"],
        "year": max(release_years),
    }

    year_histogram = defaultdict(int)
    for year in release_years:
        decade = f"{year // 10 * 10}s"
        year_histogram[decade] += 1
    stats["releaseYearHistogram"] = dict(year_histogram)

    popularities = sorted([track["popularity"] for track in tracks])
    stats["avgPopularity"] = sum(popularities) / len(popularities)
    mid = len(popularities) // 2
    stats["medianPopularity"] = (
        popularities[mid]
        if len(popularities) % 2 != 0
        else (popularities[mid - 1] + popularities[mid]) / 2
    )

    explicit_count = sum(1 for track in tracks if track["explicit"])
    stats["explicitContentRatio"] = explicit_count / len(tracks)

    track_counts = defaultdict(int)
    for track in tracks:
        track_counts[track["name"]] += 1
    stats["duplicateTracks"] = [
        {"name": name, "count": count}
        for name, count in track_counts.items()
        if count > 1
    ]

    all_artist_ids = list(
        set(artist["id"] for track in tracks for artist in track["artists"])
    )
    all_genres = get_genres_for_artists(access_token, all_artist_ids)
    genre_counts = defaultdict(int)
    for genre in all_genres:
        genre_counts[genre] += 1
    stats["topGenres"] = dict(genre_counts)

    return {"tracks": tracks, "stats": stats}


def remove_duplicate_tracks(access_token: str, playlist_id: str):
    """Removes all duplicate tracks from a playlist."""
    if not access_token:
        return None

    tracks = get_playlist_tracks(access_token, playlist_id)
    if not tracks:
        return None

    track_counts = defaultdict(list)
    for track in tracks:
        track_counts[track["id"]].append(track)

    track_ids_to_remove = [
        track_id for track_id, instances in track_counts.items() if len(instances) > 1
    ]

    if not track_ids_to_remove:
        return True

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    batch_size = 100
    for i in range(0, len(track_ids_to_remove), batch_size):
        batch = track_ids_to_remove[i : i + batch_size]
        payload = {
            "tracks": [{"uri": f"spotify:track:{track_id}"} for track_id in batch]
        }
        url = f"{SPOTIFY_API_BASE_URL}/playlists/{playlist_id}/tracks"
        try:
            response = requests.delete(url, headers=headers, json=payload)
            response.raise_for_status()
        except requests.RequestException as e:
            print(f"Error removing tracks from playlist: {e}")
            return False

    return True
