import { useCallback, useEffect, useState } from 'react';
import { usePlaylistsApi } from './api';
import { useAuth } from './useAuth';

export const useGetPlaylistTracks = (playlistId: string | undefined) => {
  const [data, setData] = useState<{
    name: { tracks: any[]; stats: any };
    tracks: any[];
    stats: any;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const playlistsApi = usePlaylistsApi();

  const fetchTracks = useCallback(async () => {
    if (!playlistId || !isAuthenticated) return;

    setLoading(true);
    try {
      const response = await playlistsApi.get(`/${playlistId}`);
      if (!response.data || (!response.data.tracks && !response.data.stats)) {
        throw new Error('Invalid response format from API');
      }
      setData(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch playlist data:', err);
      setError('Failed to load playlist data. Please try again.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [playlistId, isAuthenticated, playlistsApi]);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  return { data, loading, error, refetch: fetchTracks };
};
