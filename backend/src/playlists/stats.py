import math
from collections import Counter, defaultdict
from datetime import datetime, timezone
from typing import Dict, List, Optional

import requests
from src.config.constants import SPOTIFY_API_BASE_URL
from src.top_tracks.service import get_top_tracks

from .utils import get_playlist_tracks


def get_playlist_stats(access_token: str, playlist_id: str) -> Optional[Dict]:
    """Orchestrates fetching data and calculating all playlist statistics."""
    try:
        tracks = get_playlist_tracks(access_token, playlist_id)
        if not tracks:
            return None

        artist_ids = list(
            set(
                artist["id"]
                for track in tracks
                for artist in track.get("artists", [])
                if artist.get("id")
            )
        )

        artist_genres_map = get_genres_for_artists(access_token, artist_ids)

        song_genres = []
        for track in tracks:
            primary_artist = (
                track.get("artists", [])[0] if track.get("artists") else None
            )

            if primary_artist and primary_artist["id"] in artist_genres_map:
                genres_for_artist = artist_genres_map[primary_artist["id"]]
                if genres_for_artist:
                    top_genre = Counter(genres_for_artist).most_common(1)[0][0]
                    song_genres.append(top_genre)

        stats = {
            "totalTracks": len(tracks),
            "totalDuration": calculate_total_duration(tracks),
            "avgPopularity": calculate_avg_popularity(tracks),
            "medianPopularity": calculate_median_popularity(tracks),
            "explicitContentRatio": calculate_explicit_ratio(tracks),
            "duplicateTracks": find_duplicate_tracks(tracks),
            "releaseYearStats": calculate_release_year_stats(tracks),
            "genres": calculate_genre_stats(song_genres),
            "freshnessScore": calculate_freshness_score(tracks),
            "diversityScore": calculate_diversity_score(song_genres),
            "hitsVsHiddenGems": calculate_hits_vs_gems(tracks),
        }

        user_top_tracks = get_top_tracks(access_token, "long-term")
        if user_top_tracks:
            stats["tasteSimilarity"] = calculate_taste_similarity(
                tracks, user_top_tracks
            )
        return stats

    except Exception as e:
        print(f"Error in get_playlist_stats: {e}")
        return None


def calculate_total_duration(tracks: List[Dict]) -> str:
    total_ms = sum(track["duration_ms"] for track in tracks)
    total_seconds = total_ms // 1000
    minutes = (total_seconds % 3600) // 60
    hours = total_seconds // 3600
    return f"{hours}h {minutes}m"


def calculate_avg_popularity(tracks: List[Dict]) -> float:
    return sum(track["popularity"] for track in tracks) / len(tracks)


def calculate_median_popularity(tracks: List[Dict]) -> float:
    popularities = sorted([track["popularity"] for track in tracks])
    mid = len(popularities) // 2
    return (
        popularities[mid]
        if len(popularities) % 2 != 0
        else (popularities[mid - 1] + popularities[mid]) / 2
    )


def calculate_explicit_ratio(tracks: List[Dict]) -> float:
    explicit_count = sum(1 for track in tracks if track["explicit"])
    return explicit_count / len(tracks)


def find_duplicate_tracks(tracks: List[Dict]) -> List[Dict]:
    track_counts = Counter(track["id"] for track in tracks)
    duplicates = [
        {"name": track["name"], "count": track_counts[track["id"]]}
        for track in tracks
        if track_counts[track["id"]] > 1
    ]
    return list({v["name"]: v for v in duplicates}.values())


def parse_release_date(date_str: str):
    """Parse Spotify release_date safely into a UTC datetime."""
    if not date_str:
        return None

    try:
        if len(date_str) == 4:
            return datetime.strptime(date_str, "%Y").replace(
                month=1, day=1, tzinfo=timezone.utc
            )
        elif len(date_str) == 7:
            return datetime.strptime(date_str, "%Y-%m").replace(
                day=1, tzinfo=timezone.utc
            )
        elif len(date_str) == 10:
            return datetime.strptime(date_str, "%Y-%m-%d").replace(tzinfo=timezone.utc)
        else:
            return datetime.strptime(date_str, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    except Exception:
        return None


def calculate_release_year_stats(tracks: List[Dict]) -> Dict:
    release_years = []
    release_dates = []

    for track in tracks:
        release_date_str = track.get("album", {}).get("release_date")
        release_date_obj = parse_release_date(release_date_str)
        if not release_date_obj:
            continue

        release_dates.append(release_date_obj)
        release_years.append(release_date_obj.year)

    if not release_years:
        return {
            "avgReleaseYear": 0,
            "oldestTrack": {"name": "N/A", "year": 0},
            "newestTrack": {"name": "N/A", "year": 0},
            "histogram": {},
        }

    year_histogram = defaultdict(int)
    for year in release_years:
        year_histogram[str(year)] += 1

    def normalize_for_sort(track):
        parsed = parse_release_date(track.get("album", {}).get("release_date"))
        return parsed or datetime.max.replace(tzinfo=timezone.utc)

    oldest_track_data = min(tracks, key=normalize_for_sort)
    newest_track_data = max(tracks, key=normalize_for_sort)

    return {
        "avgReleaseYear": sum(release_years) / len(release_years),
        "oldestTrack": {
            "name": oldest_track_data.get("name", "Unknown"),
            "year": int(
                oldest_track_data.get("album", {})
                .get("release_date", "0")
                .split("-")[0]
            ),
        },
        "newestTrack": {
            "name": newest_track_data.get("name", "Unknown"),
            "year": int(
                newest_track_data.get("album", {})
                .get("release_date", "0")
                .split("-")[0]
            ),
        },
        "histogram": dict(year_histogram),
    }


def calculate_audio_features_stats(features: List[Dict]) -> Dict:
    if not features:
        return {}

    def safe_avg(key):
        values = [f[key] for f in features if key in f]
        return sum(values) / len(values) if values else 0.0

    return {
        "avgValence": safe_avg("valence"),
        "avgEnergy": safe_avg("energy"),
        "avgDanceability": safe_avg("danceability"),
        "avgTempo": safe_avg("tempo"),
        "acousticness": safe_avg("acousticness"),
        "instrumentalness": safe_avg("instrumentalness"),
        "modeDistribution": Counter(f["mode"] for f in features if "mode" in f),
    }


def calculate_genre_stats(genres: List[str]) -> Dict:
    if not genres:
        return {"topGenres": {}, "uniqueGenresCount": 0}
    genre_counts = Counter(genres)
    return {
        "topGenres": dict(genre_counts.most_common(10)),
        "uniqueGenresCount": len(genre_counts),
    }


def calculate_freshness_score(tracks: List[Dict]) -> float:
    if not tracks:
        return 0.0
    now = datetime.now(timezone.utc)

    valid_dates = [
        parse_release_date(track["album"].get("release_date"))
        for track in tracks
        if "album" in track and track["album"].get("release_date")
    ]
    valid_dates = [d for d in valid_dates if d]

    if not valid_dates:
        return 0.0

    avg_age_days = sum((now - date).days for date in valid_dates) / len(valid_dates)
    return max(0, 100 - (avg_age_days / 365))


def calculate_diversity_score(genres: List[str]) -> float:
    if not genres:
        return 0.0
    genre_counts = Counter(genres)
    total_genres = len(genres)
    entropy = 0
    for count in genre_counts.values():
        p = count / total_genres
        if p > 0:
            entropy -= p * math.log2(p)
    return entropy


def calculate_hits_vs_gems(tracks: List[Dict]) -> Dict:
    if not tracks:
        return {"hitsRatio": 0.0, "gemsRatio": 0.0}

    valid_tracks = [t for t in tracks if "popularity" in t]
    if not valid_tracks:
        return {"hitsRatio": 0.0, "gemsRatio": 0.0}

    hits_count = sum(1 for track in valid_tracks if track["popularity"] > 70)
    gems_count = sum(1 for track in valid_tracks if track["popularity"] < 30)

    return {
        "hitsRatio": hits_count / len(valid_tracks),
        "gemsRatio": gems_count / len(valid_tracks),
    }


def calculate_taste_similarity(
    playlist_tracks: List[Dict], user_top_tracks: List[Dict]
) -> float:
    if not playlist_tracks or not user_top_tracks:
        return 0.0
    playlist_ids = {track["id"] for track in playlist_tracks if "id" in track}
    top_track_ids = {track["id"] for track in user_top_tracks if "id" in track}
    common_tracks = playlist_ids.intersection(top_track_ids)
    return len(common_tracks) / len(playlist_ids) if playlist_ids else 0.0


def get_genres_for_artists(access_token: str, artist_ids: list):
    """Fetches genres for a list of artist IDs and returns a dictionary."""
    if not access_token or not artist_ids:
        return {}

    headers = {"Authorization": f"Bearer {access_token}"}
    artist_genres = defaultdict(list)

    for i in range(0, len(artist_ids), 50):
        batch_ids = artist_ids[i : i + 50]
        ids_param = ",".join(batch_ids)
        url = f"{SPOTIFY_API_BASE_URL}/artists?ids={ids_param}"
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            for artist in data.get("artists", []):
                artist_genres[artist["id"]].extend(artist.get("genres", []))
        except requests.RequestException as e:
            print(f"Error fetching artist data: {e}")
            return {}

    return dict(artist_genres)
