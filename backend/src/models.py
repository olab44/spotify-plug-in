from datetime import datetime

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.config.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    spotify_id = Column(String(255), unique=True, nullable=False)
    display_name = Column(String(255))
    email = Column(String(255))
    profile_image_url = Column(String(512))
    spotify_url = Column(String(512))
    country = Column(String(2))
    product = Column(String(50))
    access_token = Column(Text)
    refresh_token = Column(Text)
    token_expiry = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    playlists = relationship("Playlist", back_populates="user")
    top_artists = relationship("UserTopArtist", back_populates="user")
    top_tracks = relationship("UserTopTrack", back_populates="user")
    recently_played = relationship("RecentlyPlayed", back_populates="user")


class Artist(Base):
    __tablename__ = "artists"

    id = Column(Integer, primary_key=True)
    spotify_id = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    popularity = Column(Integer)
    spotify_url = Column(String(512))
    image_url = Column(String(512))
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    genres = relationship("ArtistGenre", back_populates="artist")
    tracks = relationship("TrackArtist", back_populates="artist")
    top_user_appearances = relationship("UserTopArtist", back_populates="artist")


class ArtistGenre(Base):
    __tablename__ = "artist_genres"

    artist_id = Column(
        Integer, ForeignKey("artists.id", ondelete="CASCADE"), primary_key=True
    )
    genre = Column(String(255), primary_key=True)

    # Relationship
    artist = relationship("Artist", back_populates="genres")


class Track(Base):
    __tablename__ = "tracks"

    id = Column(Integer, primary_key=True)
    spotify_id = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    duration_ms = Column(Integer)
    popularity = Column(Integer)
    preview_url = Column(String(512))
    spotify_url = Column(String(512))
    album_name = Column(String(255))
    album_image_url = Column(String(512))
    release_date = Column(Date)
    explicit = Column(Boolean, default=False)
    language_code = Column(String(10))
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    artists = relationship("TrackArtist", back_populates="track")
    lyrics = relationship("Lyrics", back_populates="track", uselist=False)
    playlist_appearances = relationship("PlaylistTrack", back_populates="track")
    top_user_appearances = relationship("UserTopTrack", back_populates="track")
    recently_played = relationship("RecentlyPlayed", back_populates="track")


class TrackArtist(Base):
    __tablename__ = "track_artists"

    track_id = Column(
        Integer, ForeignKey("tracks.id", ondelete="CASCADE"), primary_key=True
    )
    artist_id = Column(
        Integer, ForeignKey("artists.id", ondelete="CASCADE"), primary_key=True
    )
    is_primary = Column(Boolean, default=False)

    # Relationships
    track = relationship("Track", back_populates="artists")
    artist = relationship("Artist", back_populates="tracks")


class Lyrics(Base):
    __tablename__ = "lyrics"

    id = Column(Integer, primary_key=True)
    track_id = Column(Integer, ForeignKey("tracks.id", ondelete="CASCADE"), unique=True)
    content = Column(Text, nullable=False)
    language_code = Column(String(10))
    source = Column(String(50))
    last_updated = Column(DateTime, server_default=func.now())

    # Relationship
    track = relationship("Track", back_populates="lyrics")


class Playlist(Base):
    __tablename__ = "playlists"

    id = Column(Integer, primary_key=True)
    spotify_id = Column(String(255), unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    name = Column(String(255), nullable=False)
    description = Column(Text)
    image_url = Column(String(512))
    spotify_url = Column(String(512))
    is_public = Column(Boolean, default=True)
    total_tracks = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="playlists")
    tracks = relationship("PlaylistTrack", back_populates="playlist")


class PlaylistTrack(Base):
    __tablename__ = "playlist_tracks"

    playlist_id = Column(
        Integer, ForeignKey("playlists.id", ondelete="CASCADE"), primary_key=True
    )
    track_id = Column(
        Integer, ForeignKey("tracks.id", ondelete="CASCADE"), primary_key=True
    )
    position = Column(Integer, nullable=False)
    added_at = Column(DateTime, server_default=func.now())
    added_by_id = Column(Integer, ForeignKey("users.id"))

    # Relationships
    playlist = relationship("Playlist", back_populates="tracks")
    track = relationship("Track", back_populates="playlist_appearances")
    added_by = relationship("User")


class UserTopArtist(Base):
    __tablename__ = "user_top_artists"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    artist_id = Column(Integer, ForeignKey("artists.id", ondelete="CASCADE"))
    time_range = Column(String(20))
    rank = Column(Integer, nullable=False)
    calculated_at = Column(DateTime, server_default=func.now())

    # Constraints
    __table_args__ = (
        UniqueConstraint("user_id", "artist_id", "time_range"),
        CheckConstraint(
            time_range.in_(["short_term", "medium_term", "long_term"]),
            name="valid_time_range_artist",
        ),
    )

    # Relationships
    user = relationship("User", back_populates="top_artists")
    artist = relationship("Artist", back_populates="top_user_appearances")


class UserTopTrack(Base):
    __tablename__ = "user_top_tracks"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    track_id = Column(Integer, ForeignKey("tracks.id", ondelete="CASCADE"))
    time_range = Column(String(20))
    rank = Column(Integer, nullable=False)
    calculated_at = Column(DateTime, server_default=func.now())

    # Constraints
    __table_args__ = (
        UniqueConstraint("user_id", "track_id", "time_range"),
        CheckConstraint(
            time_range.in_(["short_term", "medium_term", "long_term"]),
            name="valid_time_range_track",
        ),
    )

    # Relationships
    user = relationship("User", back_populates="top_tracks")
    track = relationship("Track", back_populates="top_user_appearances")


class RecentlyPlayed(Base):
    __tablename__ = "recently_played"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    track_id = Column(Integer, ForeignKey("tracks.id", ondelete="CASCADE"))
    played_at = Column(DateTime, nullable=False)
    context_type = Column(String(50))
    context_id = Column(String(255))

    # Constraints
    __table_args__ = (UniqueConstraint("user_id", "track_id", "played_at"),)

    # Relationships
    user = relationship("User", back_populates="recently_played")
    track = relationship("Track", back_populates="recently_played")
