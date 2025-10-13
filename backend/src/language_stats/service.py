import json
from collections import defaultdict
from concurrent.futures import ProcessPoolExecutor
from math import log2
from typing import Dict, List, Tuple

from langdetect import LangDetectException, detect
from redis.client import Redis
from src.config.genius_client import get_genius_client
from src.config.redis_client import get_redis_client
from src.config.spotify_client import SpotifyClient

from .language_names import LANGUAGE_NAMES
from .schemas import LanguageCount, LanguageStats

process_pool = ProcessPoolExecutor()


def get_language_stats_for_playlist(
    playlist_id: str,
    spotify_client: SpotifyClient,
    redis_client: Redis,
) -> LanguageStats:
    items = spotify_client.playlists.get_playlist_tracks(playlist_id)
    if not items:
        return _finalize_stats({}, total_tracks=0)

    all_tracks = [item["track"] for item in items if item.get("track")]

    language_counts = _process_tracks_in_batches(all_tracks, redis_client)

    return _finalize_stats(language_counts, total_tracks=len(all_tracks))


def _process_tracks_in_batches(tracks: List[Dict], redis_client: Redis) -> Dict[str, Dict]:
    language_counts = defaultdict(lambda: {"count": 0, "examples": []})
    track_id_map = {str(track["id"]): track for track in tracks if track.get("id")}
    if not track_id_map:
        return {}

    cached_results = redis_client.mget(list(track_id_map.keys()))

    uncached_track_args: List[Tuple[str, str, str]] = []
    for i, track_id in enumerate(track_id_map.keys()):
        track = track_id_map[track_id]
        if cached_results[i]:
            lang = json.loads(cached_results[i]).get("language", "unknown")
            _update_counts(language_counts, lang, track)
        else:
            artist_name = track.get("artists", [{}])[0].get("name", "")
            track_name = track.get("name", "")
            uncached_track_args.append((track_id, track_name, artist_name))

    if uncached_track_args:
        results = list(process_pool.map(_detect_and_cache_language, uncached_track_args))

        for args, lang in zip(uncached_track_args, results):
            track_id = args[0]
            track = track_id_map[track_id]
            _update_counts(language_counts, lang, track)

    return dict(language_counts)


def _detect_and_cache_language(args: Tuple[str, str, str]) -> str:
    track_id, track_name, artist_name = args

    genius_client = get_genius_client()
    redis_client = get_redis_client()
    lyrics = genius_client.fetch_lyrics(track_name, artist_name)

    text_to_analyze = lyrics or f"{track_name} {artist_name}"
    try:
        lang = detect(text_to_analyze)
    except LangDetectException:
        lang = "unknown"
    if track_id:
        redis_client.set(track_id, json.dumps({"language": lang}), ex=86400 * 30)

    return lang


def _update_counts(counts: Dict, lang: str, track: Dict):
    entry = counts[lang]
    entry["count"] += 1
    if len(entry["examples"]) < 3:
        entry["examples"].append(track.get("name", "Unknown Track"))


def _finalize_stats(language_counts: Dict, total_tracks: int, top_n: int = 5) -> LanguageStats:
    if not total_tracks and language_counts:
        total_tracks = sum(data["count"] for data in language_counts.values())

    langs = []
    for lang_code, data in language_counts.items():
        count = data["count"]
        percentage = (count / total_tracks * 100) if total_tracks > 0 else 0.0
        lang_name = LANGUAGE_NAMES.get(lang_code, lang_code.capitalize())
        langs.append(
            LanguageCount(
                language_code=lang_name,
                count=count,
                percentage=round(percentage, 2),
                example_tracks=data["examples"],
            )
        )
    langs.sort(key=lambda x: x.count, reverse=True)

    diversity_score = 0.0
    if len(langs) > 1 and total_tracks > 0:
        entropy = -sum((lc.count / total_tracks) * log2(lc.count / total_tracks) for lc in langs)
        max_entropy = log2(len(langs))
        diversity_score = round(entropy / max_entropy, 4) if max_entropy > 0 else 0.0

    return LanguageStats(
        total_tracks=total_tracks,
        languages=langs,
        top_languages=[lc.language_code for lc in langs[:top_n]],
        dominant_language=langs[0].language_code if langs else "None",
        language_diversity_score=diversity_score,
    )
