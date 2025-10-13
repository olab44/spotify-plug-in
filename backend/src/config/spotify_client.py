from typing import Any, Dict, List, Optional

import spotipy
from spotipy.oauth2 import SpotifyOAuth

from .constants import (
    DEFAULT_SCOPES,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REDIRECT_URI,
)


class AuthAPI:
    def __init__(self):
        self.auth_manager = SpotifyOAuth(
            client_id=SPOTIFY_CLIENT_ID,
            client_secret=SPOTIFY_CLIENT_SECRET,
            redirect_uri=SPOTIFY_REDIRECT_URI,
            scope=DEFAULT_SCOPES,
        )

    def get_auth_url(self) -> str:
        return self.auth_manager.get_authorize_url()

    def get_token_from_code(self, code: str) -> Optional[Dict[str, Any]]:
        try:
            token_info = self.auth_manager.get_access_token(code, as_dict=True, check_cache=False)
            return token_info
        except spotipy.SpotifyException:
            return None


class UsersAPI:
    def __init__(self, sp_instance: spotipy.Spotify):
        self._sp = sp_instance

    def get_profile(self) -> Optional[Dict[str, Any]]:
        try:
            return self._sp.current_user()
        except spotipy.SpotifyException:
            return None

    def get_top_artists(
        self, time_range: str = "medium_term", limit: int = 50
    ) -> Optional[List[Dict[str, Any]]]:
        try:
            results = self._sp.current_user_top_artists(time_range=time_range, limit=limit)
            return results.get("items")
        except spotipy.SpotifyException:
            return None

    def get_top_tracks(
        self, time_range: str = "medium_term", limit: int = 50
    ) -> Optional[List[Dict[str, Any]]]:
        try:
            results = self._sp.current_user_top_tracks(time_range=time_range, limit=limit)
            return results.get("items")
        except spotipy.SpotifyException:
            return None


class PlaylistsAPI:
    def __init__(self, sp_instance: spotipy.Spotify):
        self._sp = sp_instance

    def get_all_my_playlists(self) -> Optional[List[Dict[str, Any]]]:
        all_playlists = []
        try:
            results = self._sp.current_user_playlists()
            all_playlists.extend(results.get("items", []))

            while results and results["next"]:
                results = self._sp.next(results)
                all_playlists.extend(results.get("items", []))

            return all_playlists
        except spotipy.SpotifyException:
            return None

    def get_playlist_tracks(self, playlist_id: str) -> Optional[List[Dict[str, Any]]]:
        all_tracks = []
        try:
            results = self._sp.playlist_items(playlist_id)
            all_tracks.extend(results.get("items", []))

            while results and results["next"]:
                results = self._sp.next(results)
                all_tracks.extend(results.get("items", []))

            return all_tracks
        except spotipy.SpotifyException:
            return None


class SpotifyClient:
    def __init__(self, access_token: str):
        sp_instance = spotipy.Spotify(auth=access_token)

        self.users = UsersAPI(sp_instance)
        self.playlists = PlaylistsAPI(sp_instance)
