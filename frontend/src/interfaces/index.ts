export interface ArtistImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyExternalUrls {
  spotify: string;
}

export interface Artist {
  id: string;
  name: string;
  genres: string[];
  images: ArtistImage[];
  uri: string;
  library_song_count?: number;
  external_urls: SpotifyExternalUrls;
}

export interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: ArtistImage[];
  };
  uri: string;
  external_urls: SpotifyExternalUrls;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  images: ArtistImage[];
  tracks: {
    href: string;
    total: number;
  };
}

export interface SpotifyUser {
  display_name: string;
  email: string;
  id: string;
  images: { url: string }[];
}

export interface Genre {
  genre: string;
  count: number;
}

export interface LanguageCount {
  language_code: string;
  count: number;
  percentage: number;
  example_tracks: string[];
}

export interface LanguageStats {
  total_tracks: number;
  languages: LanguageCount[];
  top_languages: string[];
  dominant_language: string;
  language_diversity_score: number;
}

interface ReleaseYearStats {
  avgReleaseYear: number;
  oldestTrack: { name: string; year: number };
  newestTrack: { name: string; year: number };
  histogram: Record<string, number>;
}

interface GenreStats {
  topGenres: Record<string, number>;
  uniqueGenresCount: number;
}

interface HitsVsGems {
  hitsRatio: number;
  gemsRatio: number;
}

export interface PlaylistStats {
  totalTracks: number;
  totalDuration: string;
  avgPopularity: number;
  explicitContentRatio: number;
  duplicateTracks: { name: string; count: number }[];
  releaseYearStats: ReleaseYearStats;
  genres: GenreStats;
  freshnessScore: number;
  diversityScore: number;
  hitsVsHiddenGems: HitsVsGems;
  tasteSimilarity: number;
}

export interface PlaylistDetails {
  tracks: Track[];
  stats: PlaylistStats;
}

export interface DynamicTrack {
  uri: string;
  name: string;
  artist: string;
}

export interface DynamicPlaylistDetails {
  id: string;
  name: string;
  description: string;
  url: string;
  owner: string;
  tracks: Track[];
}
