import redis
from src.config.redis_client import get_redis_client
from src.config.spotify_client import SpotifyClient
from src.dynamic_playlist.service import _calculate_trending_scores

PLAYLIST_LIMIT = 10


def full_refresh(client: SpotifyClient, playlist_id: str, redis_client: redis.Redis):
    scores = _calculate_trending_scores(client)
    if not scores:
        client.playlists._sp.playlist_replace_items(playlist_id, [])
        redis_client.delete(f"ranked_songs:{playlist_id}")
        redis_client.delete(f"local_playlist:{playlist_id}")
        return

    sorted_tracks = sorted(scores.items(), key=lambda item: item[1]["score"], reverse=True)

    unique_ranked_uris = []
    seen_titles = set()
    for uri, data in sorted_tracks:
        track_name = data["name"].lower()
        if track_name not in seen_titles:
            seen_titles.add(track_name)
            unique_ranked_uris.append(uri)

    top_10 = unique_ranked_uris[:PLAYLIST_LIMIT]
    client.playlists._sp.playlist_replace_items(playlist_id, top_10)

    ranked_key = f"ranked_songs:{playlist_id}"
    redis_client.delete(ranked_key)
    if unique_ranked_uris:
        redis_client.rpush(ranked_key, *unique_ranked_uris)

    local_list_key = f"local_playlist:{playlist_id}"
    redis_client.delete(local_list_key)
    if top_10:
        redis_client.rpush(local_list_key, *top_10)

    history_key = f"history:{playlist_id}"
    if top_10:
        for uri in top_10:
            redis_client.sadd(history_key, uri)


def run_all_refreshes():
    redis_client = get_redis_client()
    user_ids = redis_client.smembers("managed_users")

    for user_id_bytes in user_ids:
        user_id = user_id_bytes.decode("utf-8")
        user_data = redis_client.hgetall(f"user:{user_id}")

        playlist_id = user_data.get(b"playlist_id", b"").decode("utf-8")
        refresh_token = user_data.get(b"refresh_token", b"").decode("utf-8")

        if not (playlist_id and refresh_token):
            continue

        try:
            from src.config.spotify_client import SpotifyClient

            client = SpotifyClient(refresh_token)
            full_refresh(client, playlist_id, redis_client)
        except Exception as e:
            print(f"Refresher failed for user {user_id} playlist {playlist_id}: {e}")
