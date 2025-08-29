import { useEffect, useState } from 'react';
import { usePlaylistsApi } from './api';
import { useAuth } from './useAuth';

export const useGetPlaylistTracks = (playlistId: string | undefined) => {
  const [data, setData] = useState<{ tracks: any[]; stats: any } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const playlistsApi = usePlaylistsApi();

  useEffect(() => {
    if (!playlistId || !isAuthenticated) return;

    const fetchTracks = async () => {
      setLoading(true);
      try {
        const response = await playlistsApi.get(`/${playlistId}`);
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch playlist data:', err);
        setError('Failed to load playlist data. Please try again.');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [playlistId, isAuthenticated, playlistsApi]);

  return { data, loading, error };
};
