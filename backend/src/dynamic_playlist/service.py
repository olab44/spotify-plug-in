import re
from collections import defaultdict
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import HTTPException
from src.config.redis_client import get_redis_client
from src.config.spotify_client import SpotifyClient

from .schemas import PlaylistDetails, Track

HEAVY_ROTATION_PLAYLIST_NAME = "Heavy Rotation"
HEAVY_ROTATION_PLAYLIST_DESC = "Your 10 most trending tracks"
PLAYLIST_LIMIT = 10
RECENCY_WEIGHT = 0.7
CONSISTENCY_WEIGHT = 0.3
BACKFILL_BUFFER = 10


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
) -> Dict[str, Dict[str, Any]]:
    recency_scores = defaultdict(float)
    consistency_scores = defaultdict(float)
    final_scores = defaultdict(lambda: {"score": 0.0, "name": ""})
    track_names = {}

    now = datetime.now(timezone.utc)
    recent_plays = _get_all_recent_plays(client)
    for item in recent_plays:
        track = item.get("track")
        played_at_str = item.get("played_at")
        if not (track and track.get("uri") and played_at_str and track.get("name")):
            continue

        uri = track["uri"]
        track_names[uri] = track["name"]
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
                track_names[uri] = track["name"]
                consistency_scores[uri] = float(max_score - i)

    candidate_uris = (
        set(track_uris_to_score)
        if track_uris_to_score is not None
        else set(recency_scores.keys()) | set(consistency_scores.keys())
    )

    for uri in candidate_uris:
        norm_recency = recency_scores[uri] / 200.0
        norm_consistency = consistency_scores[uri] / 50.0
        final_scores[uri] = {
            "score": (norm_recency * RECENCY_WEIGHT) + (norm_consistency * CONSISTENCY_WEIGHT),
            "name": track_names.get(uri, ""),
        }

    return final_scores


def load_playlist(client: SpotifyClient, user_id: str) -> PlaylistDetails:
    redis_client = get_redis_client()
    playlist = _find_or_create_playlist(client, user_id)
    playlist_id = playlist["id"]

    current_tracks = client.playlists.get_playlist_tracks(playlist_id) or []
    spotify_uris = [
        item["track"]["uri"]
        for item in current_tracks
        if item.get("track") and item["track"].get("uri")
    ]

    local_list_key = f"local_playlist:{playlist_id}"

    if len(spotify_uris) <= PLAYLIST_LIMIT:
        redis_client.delete(local_list_key)
        if spotify_uris:
            redis_client.rpush(local_list_key, *spotify_uris)
        return _build_local_playlist_details(client, playlist, spotify_uris)

    history_key = f"history:{playlist_id}"
    history_uris = {u.decode("utf-8") for u in redis_client.smembers(history_key)}

    unknown_uris = [u for u in spotify_uris if u not in history_uris]

    if unknown_uris:
        candidate = unknown_uris[0]
        new_local = [candidate] + [u for u in spotify_uris if u != candidate][: PLAYLIST_LIMIT - 1]
    else:
        new_local = spotify_uris[:PLAYLIST_LIMIT]

    redis_client.delete(local_list_key)
    if new_local:
        redis_client.rpush(local_list_key, *new_local)

    return _build_local_playlist_details(client, playlist, new_local)


def save_playlist(client: SpotifyClient, user_id: str) -> PlaylistDetails:
    redis_client = get_redis_client()
    playlist = _find_or_create_playlist(client, user_id)
    playlist_id = playlist["id"]

    local_list_key = f"local_playlist:{playlist_id}"
    local_uris = [u.decode("utf-8") for u in redis_client.lrange(local_list_key, 0, -1)]

    if not local_uris:
        local_uris = [
            item["track"]["uri"]
            for item in client.playlists.get_playlist_tracks(playlist_id) or []
            if item.get("track")
        ]

    if local_uris:
        client.playlists._sp.playlist_replace_items(playlist_id, local_uris[:PLAYLIST_LIMIT])

    redis_client.delete(local_list_key)
    if local_uris:
        redis_client.rpush(local_list_key, *local_uris[:PLAYLIST_LIMIT])

    return _format_playlist_details(client, playlist)


def refresh_playlist(client: SpotifyClient, user_id: str) -> PlaylistDetails:
    redis_client = get_redis_client()
    playlist = _find_or_create_playlist(client, user_id)
    playlist_id = playlist["id"]

    redis_client.sadd("managed_users", user_id)
    redis_client.hset(f"user:{user_id}", "playlist_id", playlist_id)

    scores = _calculate_trending_scores(client)

    if not scores:
        client.playlists._sp.playlist_replace_items(playlist_id, [])
        redis_client.delete(f"ranked_songs:{playlist_id}")
        redis_client.delete(f"local_playlist:{playlist_id}")
        return _format_playlist_details(client, playlist)

    sorted_tracks = sorted(scores.items(), key=lambda item: item[1]["score"], reverse=True)

    unique_ranked_uris = []
    seen_titles = set()

    for uri, data in sorted_tracks:
        track_name = data["name"].lower()
        if track_name in seen_titles:
            continue
        seen_titles.add(track_name)
        unique_ranked_uris.append(uri)

    top_10 = unique_ranked_uris[:PLAYLIST_LIMIT]

    client.playlists._sp.playlist_replace_items(playlist_id, top_10)

    ranked_key = f"ranked_songs:{playlist_id}"
    redis_client.delete(ranked_key)
    if unique_ranked_uris:
        ranked_to_store = unique_ranked_uris[: PLAYLIST_LIMIT + BACKFILL_BUFFER]
        redis_client.rpush(ranked_key, *ranked_to_store)

    local_list_key = f"local_playlist:{playlist_id}"
    redis_client.delete(local_list_key)
    if top_10:
        redis_client.rpush(local_list_key, *top_10)

    history_key = f"history:{playlist_id}"
    if top_10:
        for uri in top_10:
            redis_client.sadd(history_key, uri)

    return _format_playlist_details(client, playlist)


def add_track_local(client: SpotifyClient, user_id: str, track_uri: str) -> PlaylistDetails:
    playlist = _find_or_create_playlist(client, user_id)
    playlist_id = playlist["id"]
    redis_client = get_redis_client()

    def _extract_track_id(track_ref: str) -> Optional[str]:
        if not track_ref:
            return None
        track_ref = track_ref.strip()
        if track_ref.startswith("spotify:track:"):
            return track_ref.split(":")[-1]
        if "open.spotify.com/track/" in track_ref:
            part = track_ref.split("track/")[-1]
            part = part.split("?")[0]
            return part
        m = re.match(r"^[A-Za-z0-9]{22}$", track_ref)
        if m:
            return track_ref
        return None

    track_id = _extract_track_id(track_uri)
    if not track_id:
        try:
            search_res = client.playlists._sp.search(q=track_uri, type="track", limit=1)
            items = search_res.get("tracks", {}).get("items", [])
            if items:
                track_id = items[0]["id"]
            else:
                raise HTTPException(status_code=400, detail="Invalid track URI provided.")
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid track URI provided.")

    try:
        new_track_details = client.playlists._sp.track(track_id)
        if not new_track_details or not new_track_details.get("name"):
            raise HTTPException(status_code=400, detail="Invalid track URI provided.")
        new_track_uri = new_track_details["uri"]
    except Exception:
        raise HTTPException(status_code=400, detail="Could not validate the provided track URI.")

    local_list_key = f"local_playlist:{playlist_id}"
    local_uris = [u.decode("utf-8") for u in redis_client.lrange(local_list_key, 0, -1)]

    if not local_uris:
        current_tracks = client.playlists.get_playlist_tracks(playlist_id) or []
        local_uris = [
            item["track"]["uri"]
            for item in current_tracks
            if item.get("track") and item["track"].get("uri")
        ]

    if new_track_uri in local_uris:
        raise HTTPException(status_code=409, detail="Track already present in playlist local view.")

    redis_client.lrem(local_list_key, 0, new_track_uri)
    redis_client.lpush(local_list_key, new_track_uri)
    redis_client.ltrim(local_list_key, 0, PLAYLIST_LIMIT - 1)

    history_key = f"history:{playlist_id}"
    redis_client.sadd(history_key, new_track_uri)

    updated_local = [u.decode("utf-8") for u in redis_client.lrange(local_list_key, 0, -1)]
    return _build_local_playlist_details(client, playlist, updated_local)


def remove_track_local(client: SpotifyClient, user_id: str, track_uri: str) -> PlaylistDetails:
    playlist = _find_or_create_playlist(client, user_id)
    playlist_id = playlist["id"]
    redis_client = get_redis_client()

    local_list_key = f"local_playlist:{playlist_id}"
    local_uris = [u.decode("utf-8") for u in redis_client.lrange(local_list_key, 0, -1)]

    if not local_uris:
        current_tracks = client.playlists.get_playlist_tracks(playlist_id) or []
        local_uris = [
            item["track"]["uri"]
            for item in current_tracks
            if item.get("track") and item["track"].get("uri")
        ]

    if track_uri not in local_uris:
        raise HTTPException(status_code=404, detail="Track not found in playlist local view.")

    redis_client.lrem(local_list_key, 0, track_uri)

    if len(local_uris) - 1 < PLAYLIST_LIMIT:
        ranked_key = f"ranked_songs:{playlist_id}"
        ranked_uris = [u.decode("utf-8") for u in redis_client.lrange(ranked_key, 0, -1)]
        current_local = [u.decode("utf-8") for u in redis_client.lrange(local_list_key, 0, -1)]

        for ranked_uri in ranked_uris:
            if ranked_uri not in current_local:
                redis_client.rpush(local_list_key, ranked_uri)
                break

    updated_local = [
        u.decode("utf-8") for u in redis_client.lrange(local_list_key, 0, PLAYLIST_LIMIT - 1)
    ]
    return _build_local_playlist_details(client, playlist, updated_local)


def get_playlist_history(client: SpotifyClient, user_id: str) -> List[Track]:
    playlist = _find_or_create_playlist(client, user_id)
    playlist_id = playlist["id"]
    redis_client = get_redis_client()

    history_key = f"history:{playlist_id}"
    history_uris = {u.decode("utf-8") for u in redis_client.smembers(history_key)}

    tracks_out = []
    for uri in history_uris:
        try:
            track = client.playlists._sp.track(uri.split(":")[-1])
            if track:
                tracks_out.append(
                    Track(uri=track["uri"], name=track["name"], artist=track["artists"][0]["name"])
                )
        except Exception:
            continue

    return tracks_out


def _build_local_playlist_details(
    client: SpotifyClient, playlist_data: Dict[str, Any], uris: List[str]
) -> PlaylistDetails:
    tracks_out = []
    for uri in uris:
        try:
            track = client.playlists._sp.track(uri.split(":")[-1])
            if track and track.get("artists"):
                tracks_out.append(
                    Track(uri=track["uri"], name=track["name"], artist=track["artists"][0]["name"])
                )
        except Exception:
            continue
    return PlaylistDetails(
        id=playlist_data["id"],
        name=playlist_data["name"],
        description=playlist_data.get("description", ""),
        url=playlist_data["external_urls"]["spotify"],
        owner=playlist_data["owner"]["display_name"],
        tracks=tracks_out,
    )


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
        new_playlist_minimal = client.playlists._sp.user_playlist_create(
            user_id,
            HEAVY_ROTATION_PLAYLIST_NAME,
            public=False,
            description=HEAVY_ROTATION_PLAYLIST_DESC,
        )
        full_playlist = client.playlists._sp.playlist(new_playlist_minimal["id"])
        return full_playlist
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not create playlist on Spotify: {e}")


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
