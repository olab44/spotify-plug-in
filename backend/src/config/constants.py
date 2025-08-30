import os

from dotenv import load_dotenv

load_dotenv()

SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1"

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
SPOTIFY_REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI")
SECRET_KEY = os.getenv("SECRET_KEY", "secret")

DEFAULT_SCOPES = "user-read-private user-read-email user-library-read playlist-read-private user-top-read user-read-playback-position playlist-modify-private playlist-modify-public"
