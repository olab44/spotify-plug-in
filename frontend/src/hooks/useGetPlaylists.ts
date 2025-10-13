import type { Playlist } from '../interfaces';
import { usePlaylistsApi } from './api/api';
import { useApiData } from './api/useApiData';

export const useGetPlaylists = () => {
  const playlistsApi = usePlaylistsApi();
  const { data: playlists, ...rest } = useApiData<Playlist[]>(playlistsApi, '/all');
  return { playlists, ...rest };
};
