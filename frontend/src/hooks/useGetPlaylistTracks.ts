import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useGetPlaylistTracks = (playlistId: string | undefined) => {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!playlistId) return;

    const fetchTracks = async () => {
      const accessToken = localStorage.getItem('access_token');

      if (!accessToken) {
        navigate('/');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:8000/playlists/${playlistId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTracks(response.data);
      } catch (err) {
        console.error('Failed to fetch tracks:', err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem('access_token');
          navigate('/');
        }
        setError('Failed to load playlist tracks. Please try again.');
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [playlistId, navigate]);

  return { tracks, loading, error };
};
