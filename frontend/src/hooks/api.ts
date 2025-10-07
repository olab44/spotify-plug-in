import { createApiHook } from './createApiHook';

export const useTracksApi = createApiHook('/top-tracks');
export const useArtistsApi = createApiHook('/top-artists');
export const useGenresApi = createApiHook('/top-genres');
export const usePlaylistsApi = createApiHook('/playlists');
export const useSpotifyApi = createApiHook('/spotify');
export const useLanguageApi = createApiHook('/language');
export const useRecommendationApi = createApiHook('/recommendation');
