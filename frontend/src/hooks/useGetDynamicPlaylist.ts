import { DynamicPlaylistDetails } from '../interfaces';
import { useDynamicPlaylistApi } from './api/api';
import { useApiData } from './api/useApiData';

export const useGetDynamicPlaylist = () => {
  const playlistsApi = useDynamicPlaylistApi();

  const { data: playlist, ...rest } = useApiData<DynamicPlaylistDetails>(
    playlistsApi,
    '/heavy-rotation/load',
  );

  return { playlist, ...rest };
};
