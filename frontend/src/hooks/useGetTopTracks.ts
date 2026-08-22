import type { Track } from '../interfaces';
import { useTracksApi } from './api/api';
import { useApiData } from './api/useApiData';

export const useTopTracks = (period: string) => {
  const tracksApi = useTracksApi();
  const { data: tracks, ...rest } = useApiData<Track[]>(tracksApi, `/${period}`);
  return { tracks, ...rest };
};
