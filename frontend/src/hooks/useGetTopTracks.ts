import { useEffect, useState } from 'react';
import { useTracksApi } from './api';
import { useAuth } from './useAuth';

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string; height: number; width: number }[];
  };
  uri: string;
}

export const useTopTracks = (period: string) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const tracksApi = useTracksApi();

  useEffect(() => {
    const fetchTracks = async () => {
      if (!isAuthenticated) return;

      setLoading(true);
      try {
        const response = await tracksApi.get(`/${period}`);
        setTracks(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch tracks:', err);
        setError('Failed to fetch top tracks');
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [period, isAuthenticated, tracksApi]);

  return { tracks, loading, error };
};
