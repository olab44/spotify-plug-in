from typing import Any, Dict, Tuple

from langdetect import DetectorFactory, detect_langs

from .cache import SimpleTTLCache

DetectorFactory.seed = 0
cache = SimpleTTLCache()


async def _langdetect_from_text(text: str) -> Tuple[str, float]:
    try:
        langs = detect_langs(text)
        if not langs:
            return "unknown", 0.0
        top = langs[0]
        return top.lang, float(top.prob)
    except Exception:
        return "unknown", 0.0


async def detect_language_for_track(track: Dict[str, Any]) -> Tuple[str, float]:
    track_id = track.get("id")
    if not track_id:
        return "unknown", 0.0

    cached = await cache.get(track_id)
    if cached:
        return cached.get("language"), cached.get("confidence", 0.0)

    artist_names = " ".join([a.get("name", "") for a in track.get("artists", [])])
    album_name = track.get("album", {}).get("name", "")
    text = f"{track.get('name','')} {artist_names} {album_name}".strip()

    lang, conf = await _langdetect_from_text(text)
    await cache.set(track_id, {"language": lang, "confidence": conf})
    return lang, conf
