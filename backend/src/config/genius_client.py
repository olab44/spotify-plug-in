import os
import re
from functools import lru_cache
from typing import Optional

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

GENIUS_API_BASE = os.getenv("GENIUS_API_BASE", "https://api.genius.com")
GENIUS_TOKEN = os.getenv("GENIUS_TOKEN")


class GeniusClient:
    def __init__(self, access_token: str):
        if not access_token:
            raise ValueError("Genius API token is required.")
        self.headers = {"Authorization": f"Bearer {access_token}"}
        self.base_url = GENIUS_API_BASE

    def fetch_lyrics(self, track_name: str, artist_name: str) -> Optional[str]:
        search_url = f"{self.base_url}/search"
        params = {"q": f"{track_name} {artist_name}"}

        try:
            response = requests.get(search_url, headers=self.headers, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()

            hits = data.get("response", {}).get("hits", [])
            if not hits:
                return None

            lyrics_url = hits[0]["result"]["url"]

            page_response = requests.get(lyrics_url, timeout=10)
            page_response.raise_for_status()

            soup = BeautifulSoup(page_response.text, "html.parser")
            lyrics_divs = soup.find_all("div", attrs={"data-lyrics-container": "true"})
            if not lyrics_divs:
                return None

            lyrics = "\n".join(div.get_text(separator="\n") for div in lyrics_divs)
            clean_lyrics = re.sub(r"\[.*?\]", "", lyrics)
            return clean_lyrics.strip() or None

        except requests.RequestException:
            return None


@lru_cache()
def get_genius_client() -> GeniusClient:
    if not GENIUS_TOKEN:
        raise ValueError("GENIUS_TOKEN environment variable not set.")
    return GeniusClient(access_token=GENIUS_TOKEN)
