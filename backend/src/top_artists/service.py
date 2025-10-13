import json
from concurrent.futures import ThreadPoolExecutor
from typing import Dict, List, Set

from redis.client import Redis
from src.config.spotify_client import SpotifyClient

executor = ThreadPoolExecutor(max_workers=10)


def get_top_artists(spotify_client: SpotifyClient, time_range: str) -> List[dict] | None:
    return spotify_client.users.get_top_artists(time_range=time_range)


def get_top_artists_with_song_count(
    spotify_client: SpotifyClient, redis_client: Redis, time_range: str, user_id: str
) -> List[dict] | None:
    top_artists = get_top_artists(spotify_client, time_range)
    if top_artists is None:
        return None

    artist_song_counts = _get_or_create_artist_song_counts(spotify_client, redis_client, user_id)

    for artist in top_artists:
        artist_id = artist.get("id")
        if artist_id:
            artist["library_song_count"] = artist_song_counts.get(artist_id, 0)

    return top_artists


def _get_or_create_artist_song_counts(
    spotify_client: SpotifyClient, redis_client: Redis, user_id: str
) -> Dict[str, int]:
    cache_key = f"user:{user_id}:artist_song_counts"
    cached_counts = redis_client.get(cache_key)

    if cached_counts:
        return json.loads(cached_counts)

    playlists = spotify_client.playlists.get_all_my_playlists()
    if not playlists:
        return {}

    futures = [
        executor.submit(spotify_client.playlists.get_playlist_tracks, pl["id"]) for pl in playlists
    ]
    all_tracks = []
    for f in futures:
        tracks_result = f.result()
        if tracks_result:
            all_tracks.extend(tracks_result)

    artist_song_counts = _build_artist_song_count(all_tracks)

    redis_client.set(cache_key, json.dumps(artist_song_counts), ex=7200)

    return artist_song_counts


def _build_artist_song_count(tracks: List[Dict]) -> Dict[str, int]:
    unique_track_ids: Set[str] = set()
    artist_counts: Dict[str, int] = {}

    for item in tracks:
        track = item.get("track")
        if not track or not isinstance(track, dict):
            continue

        track_id = track.get("id")
        if not track_id or track_id in unique_track_ids:
            continue

        unique_track_ids.add(track_id)
        for artist in track.get("artists", []):
            artist_id = artist.get("id")
            if artist_id:
                artist_counts[artist_id] = artist_counts.get(artist_id, 0) + 1

    return artist_counts
