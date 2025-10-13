from collections import defaultdict
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional

from fastapi import HTTPException, status
from src.config.spotify_client import SpotifyClient

from .schemas import PlaylistDetails, Track

HEAVY_ROTATION_PLAYLIST_NAME = "Heavy Rotation"
HEAVY_ROTATION_PLAYLIST_DESC = (
    "Your 10 most trending tracks, balancing recent plays and long-term favorites. "
    "Updates automatically. Managed by YourAppName."
)
PLAYLIST_LIMIT = 10
RECENCY_WEIGHT = 0.7
CONSISTENCY_WEIGHT = 0.3


def _get_all_recent_plays(client: SpotifyClient, limit: int = 100) -> List[Dict[str, Any]]:
    all_plays = []
    try:
        results = client.playlists._sp.current_user_recently_played(limit=50)
        if results and "items" in results:
            all_plays.extend(results["items"])
            if results.get("next"):
                results = client.playlists._sp.next(results)
                if results and "items" in results:
                    all_plays.extend(results["items"])
        return all_plays[:limit]
    except Exception:
        return []


def _calculate_trending_scores(
    client: SpotifyClient, track_uris_to_score: Optional[List[str]] = None
) -> Dict[str, float]:
    recency_scores = defaultdict(float)
    consistency_scores = defaultdict(float)
    final_scores = defaultdict(float)

    now = datetime.now(timezone.utc)
    recent_plays = _get_all_recent_plays(client)
    for item in recent_plays:
        track = item.get("track")
        played_at_str = item.get("played_at")
        if not (track and track.get("uri") and played_at_str):
            continue

        uri = track["uri"]
        played_at = datetime.fromisoformat(played_at_str.replace("Z", "+00:00"))
        hours_ago = (now - played_at).total_seconds() / 3600

        score = 0
        if hours_ago <= 24:
            score = 10
        elif hours_ago <= 72:
            score = 5
        elif hours_ago <= 168:
            score = 2
        else:
            score = 1
        recency_scores[uri] += score

    top_tracks = client.users.get_top_tracks(time_range="short_term", limit=50)
    if top_tracks:
        max_score = len(top_tracks)
        for i, track in enumerate(top_tracks):
            if uri := track.get("uri"):
                consistency_scores[uri] = float(max_score - i)

    candidate_uris = (
        set(track_uris_to_score)
        if track_uris_to_score is not None
        else set(recency_scores.keys()) | set(consistency_scores.keys())
    )

    for uri in candidate_uris:
        norm_recency = recency_scores[uri] / 200.0
        norm_consistency = consistency_scores[uri] / 50.0

        final_scores[uri] = (norm_recency * RECENCY_WEIGHT) + (
            norm_consistency * CONSISTENCY_WEIGHT
        )

    return final_scores


def refresh_playlist(client: SpotifyClient, user_id: str) -> PlaylistDetails:
    playlist = _find_or_create_playlist(client, user_id)
    playlist_id = playlist["id"]

    scores = _calculate_trending_scores(client)

    if not scores:
        client.playlists._sp.playlist_replace_items(playlist_id, [])
        return _format_playlist_details(client, playlist)

    sorted_tracks = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    top_track_uris = [uri for uri, score in sorted_tracks[:PLAYLIST_LIMIT]]

    client.playlists._sp.playlist_replace_items(playlist_id, top_track_uris)
    return _format_playlist_details(client, playlist)


def add_track_and_prune(client: SpotifyClient, user_id: str, track_uri: str) -> PlaylistDetails:
    playlist = _find_or_create_playlist(client, user_id)
    playlist_id = playlist["id"]

    current_tracks = client.playlists.get_playlist_tracks(playlist_id)
    if current_tracks is None:
        raise HTTPException(status_code=500, detail="Could not fetch current playlist tracks.")

    current_track_uris = {item["track"]["uri"] for item in current_tracks if item.get("track")}
    if track_uri in current_track_uris:
        return _format_playlist_details(client, playlist)

    client.playlists._sp.playlist_add_items(playlist_id, [track_uri])

    updated_tracks = client.playlists.get_playlist_tracks(playlist_id)
    if updated_tracks and len(updated_tracks) > PLAYLIST_LIMIT:
        uris_to_score = [item["track"]["uri"] for item in updated_tracks if item.get("track")]
        scores = _calculate_trending_scores(client, track_uris_to_score=uris_to_score)

        if scores:
            track_to_remove_uri = min(scores, key=scores.get)

            position = next(
                (
                    i
                    for i, item in enumerate(updated_tracks)
                    if item.get("track") and item["track"]["uri"] == track_to_remove_uri
                ),
                -1,
            )

            if position != -1:
                removal_payload = [{"uri": track_to_remove_uri, "positions": [position]}]
                client.playlists.remove_tracks_by_uri_and_position(playlist_id, removal_payload)

    return _format_playlist_details(client, playlist)


def _find_or_create_playlist(client: SpotifyClient, user_id: str) -> Dict[str, Any]:
    my_playlists = client.playlists.get_all_my_playlists()
    if not my_playlists:
        raise HTTPException(status_code=404, detail="Could not fetch user playlists.")

    playlist = next(
        (
            p
            for p in my_playlists
            if p["name"] == HEAVY_ROTATION_PLAYLIST_NAME and p["owner"]["id"] == user_id
        ),
        None,
    )

    if playlist:
        return playlist
    try:
        return client.playlists._sp.user_playlist_create(
            user_id,
            HEAVY_ROTATION_PLAYLIST_NAME,
            public=False,
            description=HEAVY_ROTATION_PLAYLIST_DESC,
        )
    except Exception:
        raise HTTPException(status_code=500, detail="Could not create playlist on Spotify.")


def _format_playlist_details(
    client: SpotifyClient, playlist_data: Dict[str, Any]
) -> PlaylistDetails:
    playlist_tracks = client.playlists.get_playlist_tracks(playlist_data["id"])
    tracks_out = []
    if playlist_tracks:
        for item in playlist_tracks:
            track = item.get("track")
            if track and track.get("artists"):
                tracks_out.append(
                    Track(uri=track["uri"], name=track["name"], artist=track["artists"][0]["name"])
                )
    return PlaylistDetails(
        id=playlist_data["id"],
        name=playlist_data["name"],
        description=playlist_data.get("description", ""),
        url=playlist_data["external_urls"]["spotify"],
        owner=playlist_data["owner"]["display_name"],
        tracks=tracks_out,
    )
