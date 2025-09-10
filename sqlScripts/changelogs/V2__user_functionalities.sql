-- Drop existing tables if they exist
DROP TABLE IF EXISTS language_statistics CASCADE;
DROP TABLE IF EXISTS user_top_tracks CASCADE;
DROP TABLE IF EXISTS user_top_artists CASCADE;
DROP TABLE IF EXISTS playlist_tracks CASCADE;
DROP TABLE IF EXISTS playlists CASCADE;
DROP TABLE IF EXISTS track_artists CASCADE;
DROP TABLE IF EXISTS tracks CASCADE;
DROP TABLE IF EXISTS artists CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS recently_played CASCADE;
DROP TABLE IF EXISTS lyrics CASCADE;
DROP TABLE IF EXISTS artist_genres CASCADE;

-- Users table with Spotify authentication data
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    spotify_id VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    email VARCHAR(255),
    profile_image_url VARCHAR(512),
    spotify_url VARCHAR(512),
    country VARCHAR(2),
    product VARCHAR(50),
    access_token TEXT,
    refresh_token TEXT,
    token_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Artists table
CREATE TABLE artists (
    id SERIAL PRIMARY KEY,
    spotify_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    popularity INTEGER,
    spotify_url VARCHAR(512),
    image_url VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Artist Genres junction table
CREATE TABLE artist_genres (
    artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
    genre VARCHAR(255) NOT NULL,
    PRIMARY KEY (artist_id, genre)
);

-- Tracks table with enhanced metadata
CREATE TABLE tracks (
    id SERIAL PRIMARY KEY,
    spotify_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    duration_ms INTEGER,
    popularity INTEGER,
    preview_url VARCHAR(512),
    spotify_url VARCHAR(512),
    album_name VARCHAR(255),
    album_image_url VARCHAR(512),
    release_date DATE,
    explicit BOOLEAN DEFAULT false,
    language_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Track Artists junction table
CREATE TABLE track_artists (
    track_id INTEGER REFERENCES tracks(id) ON DELETE CASCADE,
    artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    PRIMARY KEY (track_id, artist_id)
);

-- Lyrics table
CREATE TABLE lyrics (
    id SERIAL PRIMARY KEY,
    track_id INTEGER REFERENCES tracks(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    language_code VARCHAR(10),
    source VARCHAR(50),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User's Playlists
CREATE TABLE playlists (
    id SERIAL PRIMARY KEY,
    spotify_id VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(512),
    spotify_url VARCHAR(512),
    is_public BOOLEAN DEFAULT true,
    total_tracks INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Playlist Tracks with additional metadata
CREATE TABLE playlist_tracks (
    playlist_id INTEGER REFERENCES playlists(id) ON DELETE CASCADE,
    track_id INTEGER REFERENCES tracks(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    added_by_id INTEGER REFERENCES users(id),
    PRIMARY KEY (playlist_id, track_id)
);

-- User Top Artists with time ranges
CREATE TABLE user_top_artists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
    time_range VARCHAR(20) CHECK (time_range IN ('short_term', 'medium_term', 'long_term')),
    rank INTEGER NOT NULL,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, artist_id, time_range)
);

-- User Top Tracks with time ranges
CREATE TABLE user_top_tracks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    track_id INTEGER REFERENCES tracks(id) ON DELETE CASCADE,
    time_range VARCHAR(20) CHECK (time_range IN ('short_term', 'medium_term', 'long_term')),
    rank INTEGER NOT NULL,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, track_id, time_range)
);

-- Recently Played Tracks
CREATE TABLE recently_played (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    track_id INTEGER REFERENCES tracks(id) ON DELETE CASCADE,
    played_at TIMESTAMP NOT NULL,
    context_type VARCHAR(50),  -- e.g., 'playlist', 'album', 'artist'
    context_id VARCHAR(255),   -- spotify id of the context
    UNIQUE (user_id, track_id, played_at)
);

-- Create indexes for better query performance
CREATE INDEX idx_tracks_language ON tracks(language_code);
CREATE INDEX idx_user_top_artists_user_time ON user_top_artists(user_id, time_range);
CREATE INDEX idx_user_top_tracks_user_time ON user_top_tracks(user_id, time_range);
CREATE INDEX idx_recently_played_user ON recently_played(user_id, played_at DESC);
CREATE INDEX idx_playlist_tracks_playlist ON playlist_tracks(playlist_id, position);
CREATE INDEX idx_artist_genres_genre ON artist_genres(genre);
CREATE INDEX idx_lyrics_track ON lyrics(track_id);
CREATE INDEX idx_track_artists_artist ON track_artists(artist_id);

-- Add triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playlist_updated_at
    BEFORE UPDATE ON playlists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
