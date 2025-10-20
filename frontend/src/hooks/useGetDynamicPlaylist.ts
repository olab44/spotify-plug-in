import { PlaylistDetails } from '../interfaces';
import { useDynamicPlaylistApi } from './api/api';
import { useApiData } from './api/useApiData';

export const useGetDynamicPlaylist = () => {
  const playlistsApi = useDynamicPlaylistApi();

  const { data: playlist, ...rest } = useApiData<PlaylistDetails>(
    playlistsApi,
    '/heavy-rotation/refresh',
  );

  return { playlist, ...rest };
};
