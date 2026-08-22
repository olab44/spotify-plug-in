import math
from concurrent.futures import ThreadPoolExecutor
from typing import Any, Dict, List, Optional, Set

import requests
from redis.client import Redis
from src.config.constants import SPOTIFY_API_BASE_URL

redis_client: Redis = Redis.from_url("redis://redis:6379")

executor = ThreadPoolExecutor(max_workers=8)


def _get_headers(token: str) -> Dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def _get_audio_features(token: str, track_ids: List[str]) -> Dict[str, Dict[str, Any]]:
    """Fetch Spotify audio features for a batch of track IDs."""
    if not track_ids:
        return {}
    headers = _get_headers(token)
    res = requests.get(
        f"{SPOTIFY_API_BASE_URL}/audio-features",
        headers=headers,
        params={"ids": ",".join(track_ids)},
        timeout=10,
    )
    if res.status_code != 200:
        return {}
    data = res.json().get("audio_features", [])
    return {t["id"]: t for t in data if t}


def _get_related_artists(token: str, artist_id: str) -> List[Dict[str, Any]]:
    """Fetch related artists for a given artist."""
    headers = _get_headers(token)
    res = requests.get(
        f"{SPOTIFY_API_BASE_URL}/artists/{artist_id}/related-artists",
        headers=headers,
        timeout=10,
    )
    if res.status_code != 200:
        return []
    return res.json().get("artists", [])


def _get_artist(token: str, artist_id: str) -> Optional[Dict[str, Any]]:
    """Fetch full artist metadata."""
    headers = _get_headers(token)
    res = requests.get(f"{SPOTIFY_API_BASE_URL}/artists/{artist_id}", headers=headers, timeout=10)
    if res.status_code != 200:
        return None
    return res.json()


def _cosine(a: List[float], b: List[float]) -> float:
    """Cosine similarity between two vectors."""
    if not a or not b or len(a) != len(b):
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    na = math.sqrt(sum(x * x for x in a))
    nb = math.sqrt(sum(y * y for y in b))
    if na == 0 or nb == 0:
        return 0.0
    return dot / (na * nb)


def _artist_vector(artist: Dict[str, Any]) -> List[float]:
    """Convert artist metadata to feature vector for similarity."""
    pop = artist.get("popularity", 0) / 100.0
    genre_count = len(artist.get("genres", [])) / 10.0
    # Placeholder: in future, could add genre embedding & audio features
    return [pop, genre_count]


def recommend_artists_for_user(
    token: str, target_language: str, limit: int = 20
) -> Optional[List[Dict[str, Any]]]:
    """Recommend artists for a user in a target language based on Spotify data."""
    if not token:
        return None

    # Step 1: Fetch top artists
    top_artists_res = requests.get(
        f"{SPOTIFY_API_BASE_URL}/me/top/artists",
        headers=_get_headers(token),
        params={"limit": 50},
        timeout=10,
    )
    if top_artists_res.status_code != 200:
        return None
    top_artists = top_artists_res.json().get("items", [])

    if not top_artists:
        return None

    # Step 2: Build user profile vector (average of top artists)
    user_vectors = [_artist_vector(a) for a in top_artists]
    profile_vector = [sum(col) / len(user_vectors) for col in zip(*user_vectors)]

    # Step 3: Collect candidate artists via related artists
    candidate_ids: Set[str] = set()
    candidates: Dict[str, Dict[str, Any]] = {}

    for artist in top_artists:
        aid = artist.get("id")
        if not aid:
            continue
        related = _get_related_artists(token, aid)
        for r in related:
            rid = r.get("id")
            if rid and rid not in candidate_ids:
                candidate_ids.add(rid)
                candidates[rid] = r

    # Include top artists as candidates too
    for a in top_artists:
        if a.get("id"):
            candidates[a["id"]] = a

    # Step 4: Fill missing metadata in parallel
    missing = [cid for cid, c in candidates.items() if not c.get("genres")]
    futures = {executor.submit(_get_artist, token, mid): mid for mid in missing}
    for fut in futures:
        art = fut.result()
        if art:
            candidates[art["id"]] = art

    # Step 5: Filter by target language
    def matches_language(artist: Dict[str, Any]) -> bool:
        genres = " ".join(artist.get("genres", [])).lower()
        return target_language.lower() in genres

    filtered = [a for a in candidates.values() if matches_language(a)]
    if not filtered:
        filtered = list(candidates.values())  # fallback

    # Step 6: Score candidates by cosine similarity to user profile
    scored = [(_cosine(profile_vector, _artist_vector(a)), a) for a in filtered]
    scored.sort(key=lambda x: x[0], reverse=True)

    # Step 7: Return top-N
    return [a for _, a in scored[:limit]]
