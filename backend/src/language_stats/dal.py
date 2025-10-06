from typing import Any, AsyncIterator, Dict, List

import aiohttp
from src.config.constants import SPOTIFY_API_BASE_URL


async def _get_paginated(
    url: str, token: str, session: aiohttp.ClientSession
) -> AsyncIterator[List[Dict[str, Any]]]:
    """Helper function to handle Spotify's offset-based pagination."""
    headers = {"Authorization": f"Bearer {token}"}
    next_url = url
    while next_url:
        try:
            async with session.get(next_url, headers=headers) as resp:
                resp.raise_for_status()
                data = await resp.json()
                items = data.get("items") or data.get("tracks", {}).get("items") or []
                yield items
                next_url = data.get("next")
        except aiohttp.ClientResponseError as e:
            raise e
        except Exception as e:
            raise e


async def stream_playlist_tracks(playlist_id: str, token: str) -> AsyncIterator[Dict[str, Any]]:
    """Streams tracks from a specific playlist."""
    url = f"{SPOTIFY_API_BASE_URL}/playlists/{playlist_id}/tracks"
    async with aiohttp.ClientSession() as session:
        async for items in _get_paginated(url, token, session):
            for item in items:
                track = item.get("track") or item
                if track:
                    yield track


async def stream_saved_tracks(token: str) -> AsyncIterator[Dict[str, Any]]:
    """Streams tracks saved to the user's library."""
    url = f"{SPOTIFY_API_BASE_URL}/me/tracks"
    async with aiohttp.ClientSession() as session:
        async for items in _get_paginated(url, token, session):
            for item in items:
                track = item.get("track") or item
                if track:
                    yield track


async def stream_user_playlists(token: str) -> AsyncIterator[Dict[str, Any]]:
    """Streams the user's playlists."""
    url = f"{SPOTIFY_API_BASE_URL}/me/playlists"
    async with aiohttp.ClientSession() as session:
        async for items in _get_paginated(url, token, session):
            for item in items:
                yield item


async def stream_all_user_tracks(token: str) -> AsyncIterator[Dict[str, Any]]:
    """Streams all tracks: saved tracks and tracks from all owned playlists."""
    async for track in stream_saved_tracks(token):
        yield track

    async for playlist in stream_user_playlists(token):
        playlist_id = playlist.get("id")

        if playlist_id:
            try:
                async for track in stream_playlist_tracks(playlist_id, token):
                    yield track
            except aiohttp.ClientResponseError:
                pass
            except Exception:
                pass
