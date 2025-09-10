from collections import defaultdict
from math import log2
from typing import AsyncIterable, Dict

from .detector import detect_language_for_track
from .schemas import LanguageCount, LanguageStats


def _init_lang_entry():
    return {"count": 0, "confidence_sum": 0.0, "examples": []}


async def aggregate_from_stream(
    track_stream: AsyncIterable[Dict], max_examples_per_lang: int = 3
) -> Dict[str, dict]:
    language_counts: Dict[str, dict] = defaultdict(_init_lang_entry)
    total = 0
    async for track in track_stream:
        total += 1
        lang, conf = await detect_language_for_track(track)
        entry = language_counts[lang]
        entry["count"] += 1
        entry["confidence_sum"] += conf
        if len(entry["examples"]) < max_examples_per_lang:
            entry["examples"].append(track.get("name", "Unknown"))
    language_counts["__total__"] = {"count": total}
    return language_counts


def finalize_stats(language_counts: Dict[str, dict], top_n: int = 5) -> LanguageStats:
    total = language_counts.get("__total__", {}).get("count", 0)
    langs = []
    for lang, data in language_counts.items():
        if lang == "__total__":
            continue
        count = int(data["count"])
        percentage = (count / total * 100) if total > 0 else 0.0
        langs.append(
            LanguageCount(
                language_code=lang,
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
    dominant = langs[0].language_code if langs else "unknown"
    return LanguageStats(
        total_tracks=total,
        languages=langs,
        top_languages=top_languages,
        dominant_language=dominant,
        language_diversity_score=diversity_score,
    )
