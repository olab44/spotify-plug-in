import math
from collections import Counter, defaultdict
from datetime import datetime, timezone
from typing import Dict, List

from src.config.spotify_client import SpotifyClient


def get_all_user_playlists(spotify_client: SpotifyClient) -> List[dict] | None:
    return spotify_client.playlists.get_all_my_playlists()


def remove_duplicates_from_playlist(spotify_client: SpotifyClient, playlist_id: str) -> Dict | None:
    playlist_items = spotify_client.playlists.get_playlist_tracks(playlist_id)
    if not playlist_items:
        return {
            "message": "Playlist is empty or could not be fetched.",
            "duplicates_found": 0,
            "snapshot_id": "N/A",
        }

    positions_by_uri = defaultdict(list)
    for index, item in enumerate(playlist_items):
        track = item.get("track")
        if track and isinstance(track, dict) and track.get("uri"):
            positions_by_uri[track["uri"]].append(index)

    items_to_remove = []
    for uri, positions in positions_by_uri.items():
        if len(positions) > 1:
            for pos in positions[1:]:
                items_to_remove.append({"uri": uri, "positions": [pos]})

    if not items_to_remove:
        return {"message": "No duplicates found.", "duplicates_found": 0, "snapshot_id": "N/A"}

    items_to_remove.sort(key=lambda x: x["positions"][0], reverse=True)

    total_removed_count = len(items_to_remove)
    for i in range(0, total_removed_count, 100):
        batch = items_to_remove[i : i + 100]
        success = spotify_client.playlists.remove_tracks_by_uri_and_position(playlist_id, batch)
        if not success:
            return None

    return {
        "message": "Duplicate tracks removed successfully (kept one instance of each).",
        "duplicates_found": total_removed_count,
        "snapshot_id": "Updated",
    }


def calculate_playlist_analytics(spotify_client: SpotifyClient, playlist_id: str) -> Dict | None:
    items = spotify_client.playlists.get_playlist_tracks(playlist_id)
    if not items:
        return None

    tracks = [item["track"] for item in items if item.get("track")]
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

    artists_details = spotify_client.catalog.get_artists_by_ids(artist_ids)
    artist_genres_map = (
        {artist["id"]: artist["genres"] for artist in artists_details} if artists_details else {}
    )

    song_genres = []
    for track in tracks:
        primary_artist_id = track.get("artists", [{}])[0].get("id")
        if primary_artist_id and primary_artist_id in artist_genres_map:
            genres = artist_genres_map[primary_artist_id]
            if genres:
                song_genres.append(genres[0].replace("-", " "))

    user_top_tracks = spotify_client.users.get_top_tracks(time_range="long_term")

    stats = {
        "totalTracks": len(tracks),
        "totalDuration": _calculate_total_duration(tracks),
        "avgPopularity": _calculate_avg_popularity(tracks),
        "explicitContentRatio": _calculate_explicit_ratio(tracks),
        "duplicateTracks": _find_duplicate_tracks(tracks),
        "releaseYearStats": _calculate_release_year_stats(tracks),
        "genres": _calculate_genre_stats(song_genres),
        "freshnessScore": _calculate_freshness_score(tracks),
        "diversityScore": _calculate_diversity_score(song_genres),
        "hitsVsHiddenGems": _calculate_hits_vs_gems(tracks),
        "tasteSimilarity": (
            _calculate_taste_similarity(tracks, user_top_tracks) if user_top_tracks else 0.0
        ),
    }

    return {"tracks": tracks, "stats": stats}


def _calculate_total_duration(tracks: List[Dict]) -> str:
    total_ms = sum(track.get("duration_ms", 0) for track in tracks)
    total_seconds = total_ms // 1000
    minutes, _ = divmod(total_seconds, 60)
    hours, minutes = divmod(minutes, 60)
    return f"{hours}h {minutes}m"


def _calculate_avg_popularity(tracks: List[Dict]) -> float:
    if not tracks:
        return 0.0
    return float(sum(track.get("popularity", 0) for track in tracks) / len(tracks))


def _calculate_explicit_ratio(tracks: List[Dict]) -> float:
    if not tracks:
        return 0.0
    explicit_count = sum(1 for track in tracks if track.get("explicit"))
    return explicit_count / len(tracks)


def _find_duplicate_tracks(tracks: List[Dict]) -> List[Dict]:
    track_counts = Counter(track["id"] for track in tracks if track.get("id"))
    unique_duplicates = {
        track["id"]: track for track in tracks if track.get("id") and track_counts[track["id"]] > 1
    }
    return [
        {"name": track["name"], "count": track_counts[track["id"]]}
        for track in unique_duplicates.values()
    ]


def _parse_release_date(date_str: str) -> datetime | None:
    for fmt in ("%Y-%m-%d", "%Y-%m", "%Y"):
        try:
            return datetime.strptime(date_str, fmt).replace(tzinfo=timezone.utc)
        except (ValueError, TypeError):
            continue
    return None


def _calculate_release_year_stats(tracks: List[Dict]) -> Dict:
    release_dates = [
        d
        for t in tracks
        if (d := _parse_release_date(t.get("album", {}).get("release_date"))) is not None
    ]
    if not release_dates:
        return {"avgReleaseYear": 0, "oldestTrack": {}, "newestTrack": {}, "histogram": {}}

    oldest_track = min(
        tracks,
        key=lambda t: _parse_release_date(t.get("album", {}).get("release_date"))
        or datetime.max.replace(tzinfo=timezone.utc),
    )
    newest_track = max(
        tracks,
        key=lambda t: _parse_release_date(t.get("album", {}).get("release_date"))
        or datetime.min.replace(tzinfo=timezone.utc),
    )

    histogram = Counter(date.year for date in release_dates)
    oldest_date = _parse_release_date(oldest_track.get("album", {}).get("release_date", ""))
    newest_date = _parse_release_date(newest_track.get("album", {}).get("release_date", ""))

    return {
        "avgReleaseYear": sum(d.year for d in release_dates) / len(release_dates),
        "oldestTrack": {
            "name": oldest_track.get("name"),
            "year": oldest_date.year if oldest_date else 0,
        },
        "newestTrack": {
            "name": newest_track.get("name"),
            "year": newest_date.year if newest_date else 0,
        },
        "histogram": dict(sorted(histogram.items())),
    }


def _calculate_genre_stats(genres: List[str]) -> Dict:
    if not genres:
        return {"topGenres": {}, "uniqueGenresCount": 0}
    genre_counts = Counter(genres)
    return {"topGenres": dict(genre_counts.most_common(5)), "uniqueGenresCount": len(genre_counts)}


def _calculate_freshness_score(tracks: List[Dict]) -> float:
    release_dates = [
        d
        for t in tracks
        if (d := _parse_release_date(t.get("album", {}).get("release_date"))) is not None
    ]
    if not release_dates:
        return 0.0
    avg_age_days = sum((datetime.now(timezone.utc) - date).days for date in release_dates) / len(
        release_dates
    )
    return max(0.0, 100.0 - (avg_age_days / 36.525))


def _calculate_diversity_score(genres: List[str]) -> float:
    if not genres:
        return 0.0
    p = [count / len(genres) for count in Counter(genres).values()]
    return -sum(pi * math.log2(pi) for pi in p)


def _calculate_hits_vs_gems(tracks: List[Dict]) -> Dict:
    if not tracks:
        return {"hitsRatio": 0.0, "gemsRatio": 0.0}
    hits_count = sum(1 for track in tracks if track.get("popularity", 0) > 70)
    gems_count = sum(1 for track in tracks if track.get("popularity", 0) < 30)
    return {"hitsRatio": hits_count / len(tracks), "gemsRatio": gems_count / len(tracks)}


def _calculate_taste_similarity(playlist_tracks: List[Dict], user_top_tracks: List[Dict]) -> float:
    playlist_ids = {track["id"] for track in playlist_tracks if "id" in track}
    top_track_ids = {track["id"] for track in user_top_tracks if "id" in track}
    common_tracks = playlist_ids.intersection(top_track_ids)
    return len(common_tracks) / len(playlist_ids) if playlist_ids else 0.0
