export interface ArtistImage {
  url: string;
  height: number;
  width: number;
}

export interface Artist {
  id: string;
  name: string;
  genres: string[];
  images: ArtistImage[];
  uri: string;
  library_song_count?: number;
  external_urls: {
    spotify: string;
  };
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
  external_urls: {
    spotify: string;
  };
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  images: ArtistImage[];
  tracks: {
    total: number;
  };
}

export interface PlaylistDetails {
  tracks: any[];
  stats: any;
}

export interface Genre {
  genre: string;
  count: number;
}
