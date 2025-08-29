import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useGetPlaylists = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      const accessToken = localStorage.getItem('access_token');

      if (!accessToken) {
        navigate('/');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:8000/playlists/all', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setPlaylists(response.data);
      } catch (err) {
        console.error('Failed to fetch playlists:', err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem('access_token');
          navigate('/');
        }
        setError('Failed to load playlists. Please try logging in again.');
        setPlaylists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [navigate]);

  return { playlists, loading, error };
};
