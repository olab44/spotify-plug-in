import type { PlaylistDetails } from '../interfaces';
import { usePlaylistsApi } from './api/api';
import { useApiData } from './api/useApiData';

export const useGetPlaylistTracks = (playlistId: string | undefined) => {
  const playlistsApi = usePlaylistsApi();
  const endpoint = playlistId ? `/${playlistId}` : null;

  return useApiData<PlaylistDetails>(playlistsApi, endpoint);
};
