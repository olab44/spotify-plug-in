import type { SpotifyUser } from '../interfaces';
import { useSpotifyApi } from './api/api';
import { useApiData } from './api/useApiData';

export const useUserInfo = () => {
  const spotifyApi = useSpotifyApi();
  const { data: user, ...rest } = useApiData<SpotifyUser>(spotifyApi, '/me');

  return { user, ...rest };
};
