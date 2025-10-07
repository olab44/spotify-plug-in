import { useEffect, useState } from 'react';
import { useRecommendationApi } from './api';
import { useAuth } from './useAuth';

interface Artist {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  external_urls: { spotify: string };
}

interface RecommendationRequest {
  target_language: string;
  limit?: number;
  genres?: string[];
  content_types?: string[];
}

export const useGetRecommendations = (requestData: RecommendationRequest | null) => {
  const [recommendations, setRecommendations] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated } = useAuth();
  const recommendationApi = useRecommendationApi();

  useEffect(() => {
    if (!isAuthenticated || !requestData) return;

    let isCancelled = false;
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const response = await recommendationApi.post('/artists', requestData);
        if (!isCancelled) {
          setRecommendations(response.data.recommendations || []);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
        if (!isCancelled) {
          setError('Failed to load recommendations. Please try again.');
          setRecommendations([]);
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchRecommendations();

    return () => {
      isCancelled = true;
    };
  }, [isAuthenticated, recommendationApi, requestData]);

  return { recommendations, loading, error };
};
