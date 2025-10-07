import asyncio
import json
from collections import defaultdict
from concurrent.futures import ProcessPoolExecutor
from math import log2
from typing import Any, AsyncIterable, Dict, List, Tuple

from langdetect import detect_langs
from redis.asyncio import Redis, from_url

from .language_names import LANGUAGE_NAMES
from .lyrics import fetch_lyrics
from .schemas import LanguageCount, LanguageStats

process_pool = ProcessPoolExecutor()
redis_client: Redis = from_url("redis://redis:6379")


def finalize_stats(language_counts: Dict[str, dict], top_n: int = 5) -> LanguageStats:
    total = language_counts.get("__total__", {}).get("count", 0)
    langs = []
    for lang_code, data in language_counts.items():
        if lang_code == "__total__":
            continue
        count = int(data["count"])
        percentage = (count / total * 100) if total > 0 else 0.0

        lang_name = LANGUAGE_NAMES.get(lang_code, lang_code)

        langs.append(
            LanguageCount(
                language_code=lang_name,
                count=count,
                percentage=round(percentage, 2),
                example_tracks=list(data.get("examples", [])),
            )
        )
    langs.sort(key=lambda x: x.count, reverse=True)

    diversity_score = 0.0
    if len(langs) > 1 and total > 0:
        entropy = -sum(
            (lang_count.count / total) * log2(lang_count.count / total)
            for lang_count in langs
            if lang_count.count > 0
        )
        max_entropy = log2(len(langs))
        diversity_score = round(entropy / max_entropy, 4) if max_entropy > 0 else 0.0

    top_languages = [lang_count.language_code for lang_count in langs[:top_n]]
    dominant_language = langs[0].language_code if langs else "unknown"

    return LanguageStats(
        total_tracks=total,
        languages=langs,
        top_languages=top_languages,
        dominant_language=dominant_language,
        language_diversity_score=diversity_score,
    )


def _get_track_data(track: Dict[str, Any]) -> Tuple[str, str, str, str]:
    track_id = str(track.get("id") or track.get("uri") or "")
    artist_names = " ".join(
        [str(a.get("name", "")) for a in track.get("artists", []) if a and a.get("name")]
    )
    track_name = str(track.get("name", ""))
    album_name = str(track.get("album", {}).get("name", ""))
    return track_id, track_name, artist_names, album_name


async def _process_uncached_track(track_data: Tuple[str, str, str, str]) -> Tuple[str, Dict]:
    track_id, track_name, artist_names, album_name = track_data
    lyrics = await fetch_lyrics(track_name, artist_names)

    text = lyrics or f"{track_name} {artist_names} {album_name}".strip()

    loop = asyncio.get_running_loop()
    lang, conf = await loop.run_in_executor(process_pool, _detect_language_langid, text)

    result = {"language": lang, "confidence": conf}
    if track_id:
        await redis_client.set(track_id, json.dumps(result))
    return track_id, result


def _detect_language_langid(text: str):
    if not text:
        return "unknown", 0.0
    try:
        langs = detect_langs(text)
        best = langs[0]
        return best.lang, best.prob
    except Exception:
        return "unknown", 0.0


async def get_language_stats(track_stream: AsyncIterable[Dict]) -> LanguageStats:
    all_tracks = [track async for track in track_stream]

    track_id_map: Dict[str, Dict] = {}
    for track in all_tracks:
        track_id = track.get("id") or track.get("uri")
        if track_id:
            track_id_map[str(track_id)] = track

    if not track_id_map:
        return finalize_stats({"__total__": {"count": 0}})

    redis_keys = list(track_id_map.keys())
    cached_results_raw = await redis_client.mget(redis_keys)

    language_counts: Dict[str, Dict[str, Any]] = defaultdict(
        lambda: {"count": 0, "confidence_sum": 0.0, "examples": []}
    )
    uncached_track_tuples: List[Tuple[str, str, str, str]] = []

    for i, key in enumerate(redis_keys):
        track = track_id_map.get(key)
        cached_data = cached_results_raw[i]

        track_name = track.get("name", "Unknown Track")

        if cached_data:
            try:
                data = json.loads(cached_data)
                lang = data.get("language", "unknown")
                conf = data.get("confidence", 0.0)

                entry = language_counts[lang]
                entry["count"] += 1
                entry["confidence_sum"] += float(conf)
                if len(entry["examples"]) < 3:
                    entry["examples"].append(track_name)

            except (json.JSONDecodeError, KeyError):
                uncached_track_tuples.append(_get_track_data(track))
        else:
            uncached_track_tuples.append(_get_track_data(track))

    if uncached_track_tuples:
        processed_uncached = await asyncio.gather(
            *[_process_uncached_track(t) for t in uncached_track_tuples], return_exceptions=True
        )

        for track_data_tuple, result in zip(uncached_track_tuples, processed_uncached):
            _, track_name, _, _ = track_data_tuple

            lang, conf = "unknown", 0.0

            if isinstance(result, Exception):
                pass
            elif result is None or not isinstance(result, tuple) or len(result) != 2:
                pass
            else:
                _, result_dict = result
                lang = result_dict.get("language", "unknown")
                conf = result_dict.get("confidence", 0.0)

            entry = language_counts[lang]
            entry["count"] += 1
            entry["confidence_sum"] += float(conf)
            if len(entry["examples"]) < 3:
                entry["examples"].append(track_name)

    total = len(all_tracks)
    language_counts["__total__"] = {"count": total}

    return finalize_stats(language_counts)
