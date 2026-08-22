import type { PlaylistDetails } from '../interfaces';
import { usePlaylistsApi } from './api/api';
import { useApiData } from './api/useApiData';

export const useGetPlaylistDetails = (playlistId: string | undefined) => {
  const playlistsApi = usePlaylistsApi();
  const endpoint = playlistId ? `/${playlistId}` : null;

  const { data, ...rest } = useApiData<PlaylistDetails>(playlistsApi, endpoint);

  return {
    tracks: data?.tracks || [],
    stats: data?.stats,
    ...rest,
  };
};
