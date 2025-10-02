# """Tests for the language stats service."""

# from unittest.mock import Mock, patch

# import pytest

# from src.language_stats.service import (
#     aggregate_language_stats,
#     get_playlist_languages,
#     get_track_languages,
# )


# @pytest.mark.asyncio
# async def test_get_track_languages_success():
#     """Test successful language detection for tracks."""
#     # Mock track data
#     tracks = [
#         {
#             "id": "track1",
#             "name": "Track 1",
#             "artists": [{"name": "Artist 1"}],
#             "preview_url": "http://example.com/preview1",
#         },
#         {
#             "id": "track2",
#             "name": "Track 2",
#             "artists": [{"name": "Artist 2"}],
#             "preview_url": None,  # Test handling of missing preview URL
#         },
#     ]

#     # Mock lyrics processing
#     mock_lyrics_text = "Sample lyrics in English"
#     with (
#         patch(
#             "src.language_stats.lyrics.get_track_lyrics", return_value=mock_lyrics_text
#         ) as mock_get_lyrics,
#         patch(
#             "src.language_stats.processor_optimized.detect_language", return_value=("en", 0.95)
#         ) as mock_detect_language,
#     ):
#         result = await get_track_languages(tracks)

#         assert len(result) == 1  # Only one track has preview URL
#         assert result[0]["id"] == "track1"
#         assert result[0]["language"] == "en"
#         assert result[0]["confidence"] == 0.95

#         mock_get_lyrics.assert_called_once()
#         mock_detect_language.assert_called_once_with(mock_lyrics_text)


# @pytest.mark.asyncio
# async def test_get_track_languages_with_errors():
#     """Test language detection with errors."""
#     tracks = [
#         {
#             "id": "track1",
#             "name": "Track 1",
#             "artists": [{"name": "Artist 1"}],
#             "preview_url": "http://example.com/preview1",
#         }
#     ]

#     with patch(
#         "src.language_stats.lyrics.get_track_lyrics",
#         side_effect=Exception("Failed to fetch lyrics"),
#     ):
#         result = await get_track_languages(tracks)
#         assert len(result) == 0


# @pytest.mark.asyncio
# async def test_get_playlist_languages_success(mock_spotify_api):
#     """Test successful language stats for playlist."""
#     # Mock playlist tracks data
#     mock_tracks = {
#         "items": [
#             {
#                 "track": {
#                     "id": "track1",
#                     "name": "Track 1",
#                     "artists": [{"name": "Artist 1"}],
#                     "preview_url": "http://example.com/preview1",
#                 }
#             },
#             {
#                 "track": {
#                     "id": "track2",
#                     "name": "Track 2",
#                     "artists": [{"name": "Artist 2"}],
#                     "preview_url": "http://example.com/preview2",
#                 }
#             },
#         ]
#     }

#     # Configure mocks
#     mock_spotify = Mock()
#     mock_spotify.playlist_tracks.return_value = mock_tracks
#     mock_spotify_api.return_value = mock_spotify

#     with patch(
#         "src.language_stats.service.get_track_languages",
#         return_value=[
#             {"id": "track1", "language": "en", "confidence": 0.95},
#             {"id": "track2", "language": "es", "confidence": 0.90},
#         ],
#     ):
#         result = await get_playlist_languages("playlist_id", "access_token")

#         assert len(result) == 2
#         assert result[0]["language"] == "en"
#         assert result[1]["language"] == "es"
#         mock_spotify.playlist_tracks.assert_called_once_with("playlist_id")


# def test_aggregate_language_stats():
#     """Test language stats aggregation."""
#     tracks = [
#         {"id": "1", "language": "en", "confidence": 0.95},
#         {"id": "2", "language": "en", "confidence": 0.90},
#         {"id": "3", "language": "es", "confidence": 0.85},
#         {"id": "4", "language": "fr", "confidence": 0.80},
#         {"id": "5", "language": "es", "confidence": 0.75},
#     ]

#     stats = aggregate_language_stats(tracks)

#     assert len(stats["languages"]) == 3
#     assert stats["total_tracks"] == 5

#     # Verify language distribution
#     lang_dist = {lang["code"]: lang["count"] for lang in stats["languages"]}
#     assert lang_dist["en"] == 2
#     assert lang_dist["es"] == 2
#     assert lang_dist["fr"] == 1

#     # Verify percentages
#     assert any(
#         lang["percentage"] == 40.0 for lang in stats["languages"] if lang["code"] in ["en", "es"]
#     )
#     assert any(lang["percentage"] == 20.0 for lang in stats["languages"] if lang["code"] == "fr")


# def test_aggregate_language_stats_empty():
#     """Test language stats aggregation with empty data."""
#     stats = aggregate_language_stats([])

#     assert stats["total_tracks"] == 0
#     assert len(stats["languages"]) == 0


# def test_aggregate_language_stats_single_language():
#     """Test language stats aggregation with single language."""
#     tracks = [
#         {"id": "1", "language": "en", "confidence": 0.95},
#         {"id": "2", "language": "en", "confidence": 0.90},
#     ]

#     stats = aggregate_language_stats(tracks)

#     assert stats["total_tracks"] == 2
#     assert len(stats["languages"]) == 1
#     assert stats["languages"][0]["code"] == "en"
#     assert stats["languages"][0]["count"] == 2
#     assert stats["languages"][0]["percentage"] == 100.0
