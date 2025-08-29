import { useEffect, useState } from 'react';
import { usePlaylistsApi } from './api';
import { useAuth } from './useAuth';

interface PlaylistTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string; height: number; width: number }[];
  };
  duration_ms: number;
  uri: string;
}

export const useGetPlaylistTracks = (playlistId: string | undefined) => {
  const [tracks, setTracks] = useState<PlaylistTrack[]>([]);
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
        setTracks(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch tracks:', err);
        setError('Failed to load playlist tracks. Please try again.');
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [playlistId, isAuthenticated, playlistsApi]);

  return { tracks, loading, error };
};
