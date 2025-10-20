import redis
from src.config.redis_client import get_redis_client
from src.config.spotify_client import SpotifyClient
from src.dynamic_playlist.service import _calculate_trending_scores

PLAYLIST_LIMIT = 10


def full_refresh(client: SpotifyClient, playlist_id: str, redis_client: redis.Redis):
    scores = _calculate_trending_scores(client)
    if not scores:
        client.playlists._sp.playlist_replace_items(playlist_id, [])
        return

    sorted_tracks = sorted(scores.items(), key=lambda item: item[1]["score"], reverse=True)

    unique_top_track_uris = []
    seen_titles = set()
    for uri, data in sorted_tracks:
        if len(unique_top_track_uris) >= PLAYLIST_LIMIT:
            break
        track_name = data["name"].lower()
        if track_name not in seen_titles:
            seen_titles.add(track_name)
            unique_top_track_uris.append(uri)

    protected_key = f"playlist_protected:{playlist_id}"
    protected_members = {m.decode("utf-8") for m in redis_client.smembers(protected_key)}

    final_list = []
    for uri in protected_members:
        if len(final_list) >= PLAYLIST_LIMIT:
            break
        final_list.append(uri)

    for uri in unique_top_track_uris:
        if len(final_list) >= PLAYLIST_LIMIT:
            break
        if uri in final_list:
            continue
        final_list.append(uri)

    client.playlists._sp.playlist_replace_items(playlist_id, final_list)

    redis_state_set = f"playlist_state:{playlist_id}"
    redis_list_key = f"playlist_list:{playlist_id}"
    redis_client.delete(redis_state_set)
    redis_client.delete(redis_list_key)
    if final_list:
        redis_client.sadd(redis_state_set, *final_list)
        redis_client.rpush(redis_list_key, *final_list)

    if protected_members:
        redis_client.delete(protected_key)


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
