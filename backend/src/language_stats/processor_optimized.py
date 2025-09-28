import asyncio
import json
import logging
from collections import defaultdict
from concurrent.futures import ProcessPoolExecutor
from math import log2
from typing import Any, AsyncIterable, Dict, List, Tuple

import aiohttp
import langid
from redis.asyncio import Redis, from_url

from .lyrics import fetch_lyrics
from .schemas import LanguageCount, LanguageStats

logger = logging.getLogger(__name__)


process_pool = ProcessPoolExecutor()
redis_client: Redis = from_url("redis://redis:6379")


LANGUAGE_NAMES = {
    "en": "English",
    "pl": "Polish",
    "de": "German",
    "es": "Spanish",
    "fr": "French",
    "it": "Italian",
    "ja": "Japanese",
    "ko": "Korean",
    "zh": "Chinese",
    "ru": "Russian",
    "pt": "Portuguese",
    "sv": "Swedish",
    "nl": "Dutch",
    "tr": "Turkish",
    "ar": "Arabic",
    "hi": "Hindi",
    "id": "Indonesian",
    "uk": "Ukrainian",
    "ro": "Romanian",
    "hu": "Hungarian",
    "cs": "Czech",
    "fi": "Finnish",
    "da": "Danish",
    "no": "Norwegian",
    "el": "Greek",
    "th": "Thai",
    "vi": "Vietnamese",
    "he": "Hebrew",
    "ms": "Malay",
    "ca": "Catalan",
    "sk": "Slovak",
    "bg": "Bulgarian",
    "hr": "Croatian",
    "sl": "Slovenian",
    "sr": "Serbian",
    "lt": "Lithuanian",
    "lv": "Latvian",
    "et": "Estonian",
    "is": "Icelandic",
    "ga": "Irish",
    "sq": "Albanian",
    "mk": "Macedonian",
    "mt": "Maltese",
    "tl": "Tagalog",
    "ur": "Urdu",
    "fa": "Persian",
    "ne": "Nepali",
    "pa": "Punjabi",
    "te": "Telugu",
    "bn": "Bengali",
    "gu": "Gujarati",
    "kn": "Kannada",
    "ml": "Malayalam",
    "mr": "Marathi",
    "ta": "Tamil",
    "cy": "Welsh",
    "gd": "Scottish Gaelic",
    "gv": "Manx",
    "mi": "Maori",
    "unknown": "Unknown",
    "af": "Afrikaans",
    "eu": "Basque",
    "wa": "Walloon",
    "br": "Breton",
    "an": "Aragonese",
    "sw": "Swahili",
    "xh": "Xhosa",
    "nn": "Norwegian Nynorsk",
    "ht": "Haitian Creole",
    "fo": "Faroese",
    "nb": "Norwegian Bokmål",
}


def finalize_stats(language_counts: Dict[str, dict], top_n: int = 5) -> LanguageStats:
    """Calculates final language stats including percentages, entropy, and diversity score."""
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
    """Helper to extract relevant data from a track object. Now a synchronous function."""
    track_id = track.get("id") or track.get("uri")
    artist_names = " ".join([a.get("name", "") for a in track.get("artists", [])])
    track_name = track.get("name", "")
    album_name = track.get("album", {}).get("name", "")
    return track_id, track_name, artist_names, album_name


async def _process_uncached_track(track_data: Tuple) -> Tuple[str, Dict]:
    """
    Fetches lyrics and detects language for a single uncached track.
    This runs in the asyncio event loop.
    """
    track_id, track_name, artist_names, album_name = track_data
    lyrics = None
    try:
        logger.debug(f"Fetching lyrics for: {track_name} by {artist_names}")
        lyrics = await fetch_lyrics(track_name, artist_names)
    except aiohttp.ClientResponseError as e:
        logger.warning(f"Failed to fetch lyrics for {track_name}: {e}")
    except Exception as e:
        logger.error(f"An unexpected error occurred for {track_name}: {e}", exc_info=True)

    text = lyrics or f"{track_name} {artist_names} {album_name}".strip()

    loop = asyncio.get_running_loop()
    lang, conf = await loop.run_in_executor(process_pool, _detect_language_langid, text)

    result = {"language": lang, "confidence": conf}
    await redis_client.set(track_id, json.dumps(result))
    logger.debug(f"Detected language {lang} for {track_name} and cached.")
    return track_id, result


def _detect_language_langid(text: str) -> Tuple[str, float]:
    """
    Performs language detection using langid.
    This runs in a separate process via ProcessPoolExecutor.
    """
    if not text:
        return "unknown", 0.0

    try:
        lang, conf = langid.classify(text)
        return lang, float(conf)
    except Exception as e:
        logger.error(f"Langid failed to classify text. Error: {e}", exc_info=True)
        return "unknown", 0.0


async def get_language_stats(track_stream: AsyncIterable[Dict]) -> LanguageStats:
    logger.info("Starting language stats pipeline...")
    all_tracks = [track async for track in track_stream]
    track_ids = [t.get("id") or t.get("uri") for t in all_tracks]

    cached_results = await redis_client.mget(track_ids)

    uncached_tracks: List[Tuple] = []
    language_counts = defaultdict(lambda: {"count": 0, "confidence_sum": 0.0, "examples": []})

    for i, track in enumerate(all_tracks):
        track_id = track.get("id") or track.get("uri")
        cached_data = cached_results[i]

        if cached_data:
            data = json.loads(cached_data)
            lang, conf = data["language"], data["confidence"]
            entry = language_counts[lang]
            entry["count"] += 1
            entry["confidence_sum"] += conf
            if len(entry["examples"]) < 3:
                entry["examples"].append(track.get("name", "Unknown"))
            logger.debug(f"Track {track_id} found in cache. Language: {lang}")
        else:
            uncached_tracks.append(_get_track_data(track))
            logger.debug(f"Track {track_id} not in cache. Will process.")

    if uncached_tracks:
        logger.info(f"Processing {len(uncached_tracks)} uncached tracks concurrently...")
        processed_uncached = await asyncio.gather(
            *[_process_uncached_track(t) for t in uncached_tracks]
        )

        for (track_id, track_name, _, _), (_, result_dict) in zip(
            uncached_tracks, processed_uncached
        ):
            lang, conf = result_dict["language"], result_dict["confidence"]
            entry = language_counts[lang]
            entry["count"] += 1
            entry["confidence_sum"] += conf
            if len(entry["examples"]) < 3:
                entry["examples"].append(track_name)

    total = len(all_tracks)
    language_counts["__total__"] = {"count": total}
    logger.info("Finalizing stats...")
    return finalize_stats(language_counts)
