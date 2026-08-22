import { useEffect, useState } from 'react';
import type { Artist, Genre } from '../interfaces';
import { useArtistsApi, useGenresApi } from './api/api';
import { useApiData } from './api/useApiData';

export const useGetTopGenres = (period: string) => {
  const genresApi = useGenresApi();
  const {
    data: genres,
    loading: genresLoading,
    error: genresError,
  } = useApiData<Genre[]>(genresApi, `/${period}`);

  const artistsApi = useArtistsApi();
  const {
    data: artists,
    loading: artistsLoading,
    error: artistsError,
  } = useApiData<Artist[]>(artistsApi, `/${period}`);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(genresLoading || artistsLoading);
    setError(genresError || artistsError);
  }, [genresLoading, artistsLoading, genresError, artistsError]);

  return {
    genres: genres || [],
    artists: artists || [],
    loading,
    error,
  };
};
