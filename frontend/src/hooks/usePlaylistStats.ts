import { useMemo } from 'react';
import { usePlaylistsApi } from './api/api';

export interface PlaylistStats {
  totalTracks: number;
  totalDuration: string;
  avgPopularity: number;
  medianPopularity: number;
  explicitContentRatio: number;
  duplicateTracks: { name: string; count: number }[];
  releaseYearStats: {
    avgReleaseYear: number;
    oldestTrack: { name: string; year: number };
    newestTrack: { name: string; year: number };
    histogram: { [decade: string]: number };
  };
  genres: {
    topGenres: { [genre: string]: number };
    uniqueGenresCount: number;
  };
  audioFeatures: {
    avgValence: number;
    avgEnergy: number;
    avgDanceability: number;
    avgTempo: number;
    acousticness: number;
    instrumentalness: number;
    modeDistribution: { [mode: string]: number };
  };
  freshnessScore: number;
  diversityScore: number;
  hitsVsHiddenGems: {
    hitsRatio: number;
    gemsRatio: number;
  };
  tasteSimilarity: number;
}

export const usePlaylistStats = (playlistId: string) => {
  const { data, error, isLoading, mutate } = usePlaylistsApi().get<{
    stats: PlaylistStats;
    tracks: SpotifyApi.TrackObjectFull[];
  }>(`/${playlistId}`);

  const stats = useMemo(() => data?.stats, [data]);
  const tracks = useMemo(() => data?.tracks, [data]);

  return {
    stats,
    tracks,
    error,
    isLoading,
    refresh: mutate,
  };
};

export const usePlaylistSummaryStats = (stats: PlaylistStats | undefined) => {
  return useMemo(() => {
    if (!stats) return null;

    return [
      {
        label: 'Total Tracks',
        value: stats.totalTracks,
        icon: '🎵',
      },
      {
        label: 'Duration',
        value: stats.totalDuration,
        icon: '⏱️',
      },
      {
        label: 'Avg Popularity',
        value: `${Math.round(stats.avgPopularity)}%`,
        icon: '🌟',
      },
      {
        label: 'Unique Genres',
        value: stats.genres.uniqueGenresCount,
        icon: '🎸',
      },
    ];
  }, [stats]);
};
