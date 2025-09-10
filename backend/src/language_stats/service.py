import asyncio
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple

import langdetect
import requests
from langdetect import DetectorFactory
from src.config.constants import SPOTIFY_API_BASE_URL
from src.top_tracks.service import get_top_tracks

from .schemas import CachedLanguageData, LanguageCount, LanguageStats

# Set seed for consistent language detection
DetectorFactory.seed = 0

# Cache dictionary to store language detection results
language_cache: Dict[str, CachedLanguageData] = {}


def detect_language(text: str) -> Tuple[str, float]:
    """
    Detect the language of a given text using langdetect.
    Returns a tuple of (language_code, confidence_score)
    """
    try:
        detector = langdetect.detect_langs(text)[0]
        return detector.lang, detector.prob
    except:
        return "unknown", 0.0


def get_track_language(
    track_id: str, track_name: str, artist_names: List[str]
) -> Tuple[str, float]:
    """
    Get the language of a track, either from cache or by detection.
    """
    # Check cache first
    cached_data = language_cache.get(track_id)
    if cached_data and (
        datetime.now(timezone.utc).timestamp() - float(cached_data.timestamp) < 86400
    ):  # 24 hours cache
        return cached_data.language, cached_data.confidence_score

    # Combine track name and artist names for better language detection
    text = f"{track_name} {' '.join(artist_names)}"
    lang, confidence = detect_language(text)

    # Cache the result
    language_cache[track_id] = CachedLanguageData(
        track_id=track_id,
        language=lang,
        confidence_score=confidence,
        timestamp=str(datetime.now(timezone.utc).timestamp()),
    )

    return lang, confidence


def calculate_language_stats(tracks: List[dict]) -> LanguageStats:
    """
    Calculate language statistics from a list of tracks.
    """
    language_counts: Dict[str, dict] = {}
    total_tracks = len(tracks)

    for track in tracks:
        artist_names = [artist["name"] for artist in track["artists"]]
        lang, confidence = get_track_language(track["id"], track["name"], artist_names)

        if lang not in language_counts:
            language_counts[lang] = {
                "count": 0,
                "example_tracks": [],
                "confidence_sum": 0,
            }

        language_counts[lang]["count"] += 1
        language_counts[lang]["confidence_sum"] += confidence
        if len(language_counts[lang]["example_tracks"]) < 3:
            language_counts[lang]["example_tracks"].append(track["name"])

    # Convert counts to LanguageCount objects
    languages = []
    for lang, data in language_counts.items():
        percentage = (data["count"] / total_tracks) * 100
        languages.append(
            LanguageCount(
                language_code=lang,
                count=data["count"],
                percentage=round(percentage, 2),
                example_tracks=data["example_tracks"],
            )
        )

    # Sort languages by count
    languages.sort(key=lambda x: x.count, reverse=True)

    # Calculate language diversity score (0-1)
    # Using normalized entropy of language distribution
    from math import log2

    diversity_score = 0
    if len(languages) > 1:
        entropy = sum(
            -(l.percentage / 100) * log2(l.percentage / 100)
            for l in languages
            if l.percentage > 0
        )
        max_entropy = log2(len(languages))
        diversity_score = round(entropy / max_entropy if max_entropy > 0 else 0, 2)

    return LanguageStats(
        total_tracks=total_tracks,
        languages=languages,
        dominant_language=languages[0].language_code if languages else "unknown",
        language_diversity_score=diversity_score,
    )


async def get_language_stats(access_token: str) -> Optional[LanguageStats]:
    """
    Get language statistics for a user's top tracks.
    """
    try:
        tracks = get_top_tracks(access_token, "long_term")
        if not tracks:
            return None

        return calculate_language_stats(tracks)
    except Exception as e:
        print(f"Error getting language stats: {e}")
        return None
