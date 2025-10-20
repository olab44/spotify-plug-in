import logging

from apscheduler.schedulers.background import BackgroundScheduler
from src.config.redis_client import get_redis_client

logging.basicConfig()
logging.getLogger("apscheduler").setLevel(logging.INFO)

PLAYLIST_LIMIT = 10


def run_watcher_job():
    print("Running watcher job")
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
            current_tracks = client.playlists.get_playlist_tracks(playlist_id)
            if not current_tracks:
                continue

            redis_state_key = f"playlist_state:{playlist_id}"
            stored_uris_set = {b.decode("utf-8") for b in redis_client.smembers(redis_state_key)}

            playlist_uris = [
                item["track"]["uri"]
                for item in current_tracks
                if item.get("track") and item["track"].get("uri")
            ]
            external_additions = [uri for uri in playlist_uris if uri not in stored_uris_set]

            if external_additions:
                for uri in external_additions:
                    try:
                        client.playlists._sp.playlist_add_items(playlist_id, [uri], position=0)
                    except TypeError:
                        client.playlists._sp.playlist_add_items(playlist_id, [uri])
                    redis_client.sadd(f"playlist_protected:{playlist_id}", uri)

            if len(playlist_uris) > PLAYLIST_LIMIT:
                from src.dynamic_playlist.service import _calculate_trending_scores

                scores = _calculate_trending_scores(client, track_uris_to_score=playlist_uris)
                if scores:
                    protected = {
                        m.decode("utf-8")
                        for m in redis_client.smembers(f"playlist_protected:{playlist_id}")
                    }
                    candidates = [uri for uri in playlist_uris if uri not in protected]
                    candidates_sorted = sorted(
                        candidates, key=lambda u: scores.get(u, {}).get("score", 0)
                    )
                    to_remove = []
                    while (
                        len(playlist_uris) - len(to_remove) > PLAYLIST_LIMIT and candidates_sorted
                    ):
                        rem = candidates_sorted.pop(0)
                        to_remove.append(rem)

                    removal_payload = []
                    for rem_uri in to_remove:
                        position = next(
                            (
                                i
                                for i, item in enumerate(current_tracks)
                                if item.get("track") and item["track"].get("uri") == rem_uri
                            ),
                            -1,
                        )
                        if position != -1:
                            removal_payload.append({"uri": rem_uri, "positions": [position]})

                    if removal_payload:
                        client.playlists.remove_tracks_by_uri_and_position(
                            playlist_id, removal_payload
                        )
        except Exception as e:
            print(f"Watcher job failed for user {user_id} playlist {playlist_id}: {e}")
            continue


def run_refresher_job():
    print("Running refresher job")
    from src.dynamic_playlist.refresher import run_all_refreshes

    try:
        run_all_refreshes()
    except Exception as e:
        print(f"Refresher job failed: {e}")


scheduler = BackgroundScheduler()

scheduler.add_job(run_watcher_job, "interval", minutes=5, id="watcher_job")
scheduler.add_job(run_refresher_job, "interval", hours=4, id="refresher_job")
