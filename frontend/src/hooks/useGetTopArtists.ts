import { useEffect, useState } from 'react';
import { useArtistsApi } from './api';
import { useAuth } from './useAuth';

interface Artist {
  id: string;
  name: string;
  genres: string[];
  images: { url: string; height: number; width: number }[];
  uri: string;
}

export const useTopArtists = (period: string) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const artistsApi = useArtistsApi();

  useEffect(() => {
    const fetchArtists = async () => {
      if (!isAuthenticated) return;

      setLoading(true);
      try {
        const response = await artistsApi.get(`/${period}`);
        setArtists(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch artists:', err);
        setError('Failed to fetch top artists');
        setArtists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [period, isAuthenticated, artistsApi]);

  return { artists, loading, error };
};
