import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ArtistImage {
  url: string;
}

interface Artist {
  id: string;
  name: string;
  genres: string[];
  images: ArtistImage[];
  external_urls: {
    spotify: string;
  };
}

interface GenreItem {
  genre: string;
  count: number;
}

export const useGetTopGenres = (period: string) => {
  const [genres, setGenres] = useState<GenreItem[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopData = async () => {
      const accessToken = localStorage.getItem('access_token');

      if (!accessToken) {
        console.error('useGetTopGenres: No access token found. Redirecting to login.');
        navigate('/');
        return;
      }

      setLoading(true);
      try {
        const genresResponse = await axios.get(`http://localhost:8000/top-genres/${period}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setGenres(genresResponse.data);

        const artistsResponse = await axios.get(`http://localhost:8000/top-artists/${period}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setArtists(artistsResponse.data);
      } catch (err) {
        console.error('useGetTopGenres: Failed to fetch data:', err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem('access_token');
          navigate('/');
        }
        setGenres([]);
        setArtists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopData();
  }, [period, navigate]);

  return { genres, artists, loading };
};
