-- Users table to store Spotify user information
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    spotify_id VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    email VARCHAR(255),
    country VARCHAR(2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Artists table to store artist information
CREATE TABLE artists (
    id SERIAL PRIMARY KEY,
    spotify_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    popularity INTEGER,
    genres TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tracks table to store song information
CREATE TABLE tracks (
    id SERIAL PRIMARY KEY,
    spotify_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    duration_ms INTEGER,
    popularity INTEGER,
    preview_url VARCHAR(255),
    language_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Track Artists junction table
CREATE TABLE track_artists (
    track_id INTEGER REFERENCES tracks(id),
    artist_id INTEGER REFERENCES artists(id),
    PRIMARY KEY (track_id, artist_id)
);

-- Playlists table
CREATE TABLE playlists (
    id SERIAL PRIMARY KEY,
    spotify_id VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Playlist Tracks junction table
CREATE TABLE playlist_tracks (
    playlist_id INTEGER REFERENCES playlists(id),
    track_id INTEGER REFERENCES tracks(id),
    position INTEGER NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (playlist_id, track_id)
);

-- User Top Artists tracking
CREATE TABLE user_top_artists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    artist_id INTEGER REFERENCES artists(id),
    time_range VARCHAR(20) NOT NULL, -- short_term, medium_term, long_term
    rank INTEGER NOT NULL,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Top Tracks tracking
CREATE TABLE user_top_tracks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    track_id INTEGER REFERENCES tracks(id),
    time_range VARCHAR(20) NOT NULL, -- short_term, medium_term, long_term
    rank INTEGER NOT NULL,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Language Statistics table
CREATE TABLE language_statistics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    language_code VARCHAR(10) NOT NULL,
    track_count INTEGER DEFAULT 0,
    listening_time_ms BIGINT DEFAULT 0,
    time_range VARCHAR(20) NOT NULL, -- short_term, medium_term, long_term
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_tracks_language ON tracks(language_code);
CREATE INDEX idx_user_top_artists_user_time ON user_top_artists(user_id, time_range);
CREATE INDEX idx_user_top_tracks_user_time ON user_top_tracks(user_id, time_range);
CREATE INDEX idx_language_stats_user_time ON language_statistics(user_id, time_range);
