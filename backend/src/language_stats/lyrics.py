import re
from typing import Optional

import aiohttp

GENIUS_API_BASE = "https://api.genius.com"
# GENIUS_TOKEN = "YOUR_GENIUS_API_TOKEN"
GENIUS_API_KEY = "J3sGc4gXr3j6v6HU1ErmrPzRbtquoB9n3xq4wjlu4M2av6ecSXLF-ldjSu9il_LD"
GENIUS_TOKEN = "qCKnUNRf19-yzmVfXRZvfM1jKWPm3YcLORkRRNhRRFMGG8JQEmBUbV-7tzlgrVF_"


async def fetch_lyrics(track_name: str, artist_name: str) -> Optional[str]:
    headers = {"Authorization": f"Bearer {GENIUS_TOKEN}"}
    search_url = f"{GENIUS_API_BASE}/search"
    params = {"q": f"{track_name} {artist_name}"}

    async with aiohttp.ClientSession() as session:
        async with session.get(search_url, headers=headers, params=params) as resp:
            resp.raise_for_status()
            data = await resp.json()
            hits = data.get("response", {}).get("hits", [])
            if not hits:
                return None

            song_path = hits[0]["result"]["path"]
            lyrics_url = f"https://genius.com{song_path}"

            async with session.get(lyrics_url) as lyric_resp:
                html = await lyric_resp.text()
                match = re.search(r'<div class="lyrics">(.+?)</div>', html, re.DOTALL)
                if match:
                    lyrics = re.sub(r"<.*?>", "", match.group(1))
                    return lyrics.strip()
    return None
