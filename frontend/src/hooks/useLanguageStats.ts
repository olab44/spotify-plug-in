import { useEffect, useState } from 'react';
import { useLanguageApi } from './api';

export interface LanguageCount {
  language_code: string;
  count: number;
  percentage: number;
  example_tracks: string[];
}

export interface LanguageStats {
  total_tracks: number;
  languages: LanguageCount[];
  top_languages: string[];
  dominant_language: string;
  language_diversity_score: number;
}

export const useLanguageStats = (scope: 'global' | 'playlist' = 'global', playlistId?: string) => {
  const [stats, setStats] = useState<LanguageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useLanguageApi();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        let url = '/stats?scope=' + scope;
        if (scope === 'playlist' && playlistId) url += '&playlist_id=' + playlistId;
        const response = await api.get<LanguageStats>(url);
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setStats(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [api, scope, playlistId]);

  return { stats, isLoading, error };
};
