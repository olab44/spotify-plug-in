import type { Artist } from '../interfaces';
import { useArtistsApi } from './api/api';
import { useApiData } from './api/useApiData';

export const useTopArtists = (period: string) => {
  const artistsApi = useArtistsApi();
  const { data: artists, ...rest } = useApiData<Artist[]>(artistsApi, `/${period}/with-counts`);
  return { artists, ...rest };
};
