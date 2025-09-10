import { useEffect, useState } from 'react';
import { useLanguageApi } from './api/languageApi';

export interface LanguageCount {
  language_code: string;
  count: number;
  percentage: number;
  example_tracks: string[];
}

export interface LanguageStats {
  total_tracks: number;
  languages: LanguageCount[];
  dominant_language: string;
  language_diversity_score: number;
}

export const useLanguageStats = () => {
  const [stats, setStats] = useState<LanguageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useLanguageApi();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<LanguageStats>('/stats');
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching language stats:', err);
        setError('Failed to load language statistics. Please try again.');
        setStats(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [api]);

  return {
    stats,
    error,
    isLoading,
  };
};
