import type { LanguageStats } from '../interfaces';
import { useLanguageApi } from './api/api';
import { useApiData } from './api/useApiData';

export const useLanguageStats = (scope: 'global' | 'playlist' = 'global', playlistId?: string) => {
  const languageApi = useLanguageApi();
  const endpoint =
    scope === 'playlist' && !playlistId
      ? null
      : `/stats?scope=${scope}${scope === 'playlist' ? `&playlist_id=${playlistId}` : ''}`;

  const { data: stats, ...rest } = useApiData<LanguageStats>(languageApi, endpoint);

  return { stats, ...rest };
};
