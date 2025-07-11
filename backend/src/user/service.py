import requests
from datetime import datetime
from collections import defaultdict

SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1"


def fetch_listening_stats(access_token: str):
    """Fetch listening stats: minutes per year/month & average per month."""
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(f"{SPOTIFY_API_BASE_URL}/me/player/recently-played?limit=50", headers=headers)

    if response.status_code != 200:
        return {"error": "Failed to fetch listening stats"}

    data = response.json()
    stats = defaultdict(lambda: {"minutes": 0, "count": 0})

    for item in data.get("items", []):
        played_at = item["played_at"]
        track_duration = item["track"]["duration_ms"] / 60000
        date_obj = datetime.strptime(played_at, "%Y-%m-%dT%H:%M:%S.%fZ")
        key = f"{date_obj.year}-{date_obj.month:02d}"

        stats[key]["minutes"] += track_duration
        stats[key]["count"] += 1

    return {
        "stats": [{"year_month": key, "minutes_listened": value["minutes"]} for key, value in stats.items()],
        "average_minutes_per_month": sum(d["minutes_listened"] for d in stats.values()) / len(stats) if stats else 0
    }


def fetch_music_evolution(access_token: str):
    """Fetch top genres and artists over time."""
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(f"{SPOTIFY_API_BASE_URL}/me/top/artists?limit=50&time_range=long_term", headers=headers)

    if response.status_code != 200:
        return {"error": "Failed to fetch music evolution"}

    data = response.json()
    evolution = defaultdict(lambda: {"artists": [], "genres": []})

    for artist in data.get("items", []):
        for genre in artist.get("genres", []):
            evolution["all_time"]["genres"].append(genre)
        evolution["all_time"]["artists"].append(artist["name"])

    return evolution


def fetch_discovery(access_token: str):
    """Fetch the most listened-to new song of the month/year."""
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(f"{SPOTIFY_API_BASE_URL}/me/top/tracks?limit=50&time_range=short_term", headers=headers)

    if response.status_code != 200:
        return {"error": "Failed to fetch discovery"}

    data = response.json()
    top_track = data["items"][0] if data["items"] else None

    return {
        "song": top_track["name"] if top_track else None,
        "artist": top_track["artists"][0]["name"] if top_track else None
    }


def fetch_rankings(access_token: str):
    url = "https://api.spotify.com/v1/me/top/tracks?limit=100"
    headers = {"Authorization": f"Bearer {access_token}"}

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        data = response.json()

        if "error" in data and data["error"].get("status") == 403:
            return {"error": "Insufficient client scope. Ensure you authorized with `user-top-read`."}

        return data

    except requests.exceptions.RequestException:
        return {"error": "Failed to fetch rankings"}


def fetch_language_analysis(access_token: str):
    """Analyze the dominant languages in user's music."""
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(f"{SPOTIFY_API_BASE_URL}/me/top/tracks?limit=50&time_range=long_term", headers=headers)

    if response.status_code != 200:
        return {"error": "Failed to fetch language analysis"}

    data = response.json()
    languages = defaultdict(int)

    for track in data.get("items", []):
        languages[track["album"]["name"]] += 1

    return {"language_ranking": sorted(languages.items(), key=lambda x: x[1], reverse=True)}
