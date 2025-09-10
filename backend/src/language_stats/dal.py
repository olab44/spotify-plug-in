from typing import AsyncIterator, Dict

import aiohttp
from src.config.constants import SPOTIFY_API_BASE_URL


async def _get_paginated(url: str, token: str, session: aiohttp.ClientSession):
    headers = {"Authorization": f"Bearer {token}"}
    next_url = url
    while next_url:
        async with session.get(next_url, headers=headers) as resp:
            resp.raise_for_status()
            data = await resp.json()
            items = data.get("items") or data.get("tracks") or []
            yield items
            next_url = data.get("next")


async def stream_playlist_tracks(playlist_id: str, token: str) -> AsyncIterator[Dict]:
    url = f"{SPOTIFY_API_BASE_URL}/playlists/{playlist_id}/tracks"
    async with aiohttp.ClientSession() as session:
        async for items in _get_paginated(url, token, session):
            for item in items:
                track = item.get("track") or item
                if track:
                    yield track


async def stream_saved_tracks(token: str) -> AsyncIterator[Dict]:
    url = f"{SPOTIFY_API_BASE_URL}/me/tracks"
    async with aiohttp.ClientSession() as session:
        async for items in _get_paginated(url, token, session):
            for item in items:
                track = item.get("track") or item
                if track:
                    yield track


async def stream_user_playlists(token: str) -> AsyncIterator[Dict]:
    url = f"{SPOTIFY_API_BASE_URL}/me/playlists"
    async with aiohttp.ClientSession() as session:
        async for items in _get_paginated(url, token, session):
            for item in items:
                yield item


async def stream_all_user_tracks(token: str) -> AsyncIterator[Dict]:
    # saved tracks
    async for track in stream_saved_tracks(token):
        yield track
    # tracks from all playlists
    async for playlist in stream_user_playlists(token):
        playlist_id = playlist.get("id")
        if playlist_id:
            async for track in stream_playlist_tracks(playlist_id, token):
                yield track
