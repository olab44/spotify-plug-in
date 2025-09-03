export interface SpotifyImage {
  url: string;
  height?: number;
  width?: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  uri: string;
  href: string;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  release_date: string;
  release_date_precision: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  href: string;
  duration_ms: number;
  popularity: number;
  explicit: boolean;
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: SpotifyImage[];
  tracks: {
    total: number;
    items: {
      track: SpotifyTrack;
    }[];
  };
  external_urls: {
    spotify: string;
  };
}

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
