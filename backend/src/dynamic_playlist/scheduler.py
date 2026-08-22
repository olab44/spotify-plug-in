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

            if len(current_tracks) > PLAYLIST_LIMIT:
                removal_payload = []
                for i in range(PLAYLIST_LIMIT, len(current_tracks)):
                    track_uri = current_tracks[i]["track"]["uri"]
                    removal_payload.append({"uri": track_uri, "positions": [i]})

                if removal_payload:
                    client.playlists.remove_tracks_by_uri_and_position(playlist_id, removal_payload)

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
