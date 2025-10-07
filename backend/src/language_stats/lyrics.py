import os
import re
from typing import Optional

import aiohttp
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

GENIUS_API_BASE = os.getenv("GENIUS_API_BASE")
GENIUS_API_KEY = os.getenv("GENIUS_API_KEY")
GENIUS_TOKEN = os.getenv("GENIUS_TOKEN")
BASE_GENIUS_URL = "https://genius.com"


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
            lyrics_url = f"{BASE_GENIUS_URL}{song_path}"

            async with session.get(lyrics_url) as lyric_resp:
                html = await lyric_resp.text()
                soup = BeautifulSoup(html, "html.parser")
                lyrics_divs = soup.find_all("div", class_=lambda x: x and "Lyrics__Container" in x)
                if not lyrics_divs:
                    return None
                lyrics = "\n".join(div.get_text(separator="\n") for div in lyrics_divs)
                clean_lyrics = re.sub(r"\[.*?\]", "", lyrics)
                return clean_lyrics.strip() or None
