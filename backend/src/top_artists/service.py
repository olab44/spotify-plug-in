import asyncio
from collections import Counter

import httpx
from src.config.constants import SPOTIFY_API_BASE_URL


async def get_top_artists(
    access_token: str, time_range: str = "medium_term", limit: int = 50
):
    if not access_token:
        return None

    headers = {"Authorization": f"Bearer {access_token}"}
    params = {"time_range": time_range, "limit": limit}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{SPOTIFY_API_BASE_URL}/me/top/artists", headers=headers, params=params
            )
            response.raise_for_status()
            top_artists = response.json()["items"]

            artist_song_counts = await get_unique_song_counts_by_artist(
                access_token, client
            )

            for artist in top_artists:
                artist_id = artist["id"]
                song_count = artist_song_counts.get(artist_id, 0)
                artist["playlist_song_count"] = song_count

            return top_artists
        except httpx.HTTPError as e:
            print(f"Error fetching top artists: {e}")
            return None


async def get_all_user_playlists(access_token: str, client: httpx.AsyncClient):
    """Fetches all of the user's playlists and all their tracks concurrently."""
    if not access_token:
        return None

    headers = {"Authorization": f"Bearer {access_token}"}

    playlist_urls = []
    playlists_url = f"{SPOTIFY_API_BASE_URL}/me/playlists?limit=50"
    while playlists_url:
        try:
            response = await client.get(playlists_url, headers=headers)
            response.raise_for_status()
            data = response.json()
            playlist_urls.extend(
                [item["tracks"]["href"] for item in data.get("items", [])]
            )
            playlists_url = data.get("next")
        except httpx.HTTPError as e:
            print(f"Error during playlist URL pagination: {e}")
            return None

    track_urls_to_fetch = []
    for playlist_track_url in playlist_urls:
        track_urls_to_fetch.append(playlist_track_url)
        track_data = await client.get(playlist_track_url, headers=headers)
        if "next" in track_data.json():
            next_track_url = track_data.json().get("next")
            while next_track_url:
                next_track_data = await client.get(next_track_url, headers=headers)
                next_track_url = next_track_data.json().get("next")
                track_urls_to_fetch.append(next_track_data.json()["href"])

    track_responses = await asyncio.gather(
        *[client.get(url, headers=headers) for url in track_urls_to_fetch],
        return_exceptions=True,
    )

    all_tracks = []
    for res in track_responses:
        if isinstance(res, httpx.HTTPError):
            print(f"Error fetching tracks: {res}")
            continue

        try:
            data = res.json()
            for item in data.get("items", []):
                track = item.get("track")
                if track:
                    all_tracks.append(track)
        except Exception as e:
            print(f"Error parsing track data: {e}")
            continue

    return all_tracks


async def get_unique_song_counts_by_artist(
    access_token: str, client: httpx.AsyncClient
):
    """
    Counts the number of unique songs per artist across all user playlists.
    Optimized by building a single hash map.
    """
    all_tracks = await get_all_user_playlists(access_token, client)
    if not all_tracks:
        return {}

    artist_song_counts = Counter()
    processed_songs = set()

    for track in all_tracks:
        song_key = f"{track['name'].lower()}"

        for artist in track.get("artists", []):
            artist_id = artist["id"]
            artist_song_key = f"{artist_id}-{song_key}"

            if artist_song_key not in processed_songs:
                artist_song_counts[artist_id] += 1
                processed_songs.add(artist_song_key)

    return dict(artist_song_counts)


async def get_top_artists_short_term(access_token: str):
    return await get_top_artists(access_token, time_range="short_term")


async def get_top_artists_medium_term(access_token: str):
    return await get_top_artists(access_token, time_range="medium_term")


async def get_top_artists_long_term(access_token: str):
    return await get_top_artists(access_token, time_range="long_term")
