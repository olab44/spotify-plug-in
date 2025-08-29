import { useEffect, useState } from 'react';
import { usePlaylistsApi } from './api';
import { useAuth } from './useAuth';

interface Playlist {
  id: string;
  name: string;
  description: string;
  images: { url: string; height: number; width: number }[];
  tracks: {
    total: number;
  };
}

export const useGetPlaylists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const playlistsApi = usePlaylistsApi();

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!isAuthenticated) return;

      setLoading(true);
      try {
        const response = await playlistsApi.get('/all');
        setPlaylists(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch playlists:', err);
        setError('Failed to load playlists. Please try logging in again.');
        setPlaylists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [isAuthenticated, playlistsApi]);

  return { playlists, loading, error };
};
