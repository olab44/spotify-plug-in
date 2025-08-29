import { useEffect, useState } from 'react';
import { useArtistsApi, useGenresApi } from './api';
import { useAuth } from './useAuth';

interface ArtistImage {
  url: string;
}

interface GenreArtist {
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
  const [artists, setArtists] = useState<GenreArtist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const genresApi = useGenresApi();
  const artistsApi = useArtistsApi();

  useEffect(() => {
    const fetchTopData = async () => {
      if (!isAuthenticated) return;

      setLoading(true);
      try {
        const genresResponse = await genresApi.get(`/${period}`);
        setGenres(genresResponse.data);

        const artistsResponse = await artistsApi.get(`/${period}`);
        setArtists(artistsResponse.data);

        setError(null);
      } catch (err) {
        console.error('Failed to fetch top genres data:', err);
        setError('Failed to fetch top genres data');
        setGenres([]);
        setArtists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopData();
  }, [period, isAuthenticated, genresApi, artistsApi]);

  return { genres, artists, loading, error };
};
