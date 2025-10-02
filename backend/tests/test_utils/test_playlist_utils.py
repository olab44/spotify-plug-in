# """Tests for utility functions."""

# from datetime import datetime, timedelta

# from src.playlists.utils import chunk_list, filter_playlist_tracks, format_playlist_duration


# def test_format_playlist_duration():
#     """Test playlist duration formatting."""
#     # Test various durations
#     assert format_playlist_duration(0) == "0 min"
#     assert format_playlist_duration(30) == "0 min"
#     assert format_playlist_duration(60) == "1 min"
#     assert format_playlist_duration(90) == "2 min"
#     assert format_playlist_duration(3600) == "60 min"
#     assert format_playlist_duration(5400) == "90 min"


# def test_chunk_list():
#     """Test list chunking function."""
#     # Test with empty list
#     assert list(chunk_list([], 10)) == []

#     # Test with list shorter than chunk size
#     data = [1, 2, 3]
#     assert list(chunk_list(data, 5)) == [[1, 2, 3]]

#     # Test with exact multiple of chunk size
#     data = [1, 2, 3, 4, 5, 6]
#     assert list(chunk_list(data, 2)) == [[1, 2], [3, 4], [5, 6]]

#     # Test with non-exact multiple
#     data = [1, 2, 3, 4, 5]
#     assert list(chunk_list(data, 2)) == [[1, 2], [3, 4], [5]]


# def test_filter_playlist_tracks():
#     """Test playlist track filtering."""
#     tracks = [
#         {
#             "track": {
#                 "id": "1",
#                 "name": "Track 1",
#                 "artists": [{"name": "Artist 1"}],
#                 "album": {"name": "Album 1"},
#                 "duration_ms": 180000,
#             },
#             "added_at": (datetime.now() - timedelta(days=10)).isoformat(),
#         },
#         {
#             "track": {
#                 "id": "2",
#                 "name": "Track 2",
#                 "artists": [{"name": "Artist 2"}],
#                 "album": {"name": "Album 2"},
#                 "duration_ms": 240000,
#             },
#             "added_at": (datetime.now() - timedelta(days=5)).isoformat(),
#         },
#         {
#             "track": None,  # Test handling of missing track
#             "added_at": datetime.now().isoformat(),
#         },
#     ]

#     # Test filtering with default parameters
#     filtered = filter_playlist_tracks(tracks)
#     assert len(filtered) == 2  # Should exclude the None track
#     assert filtered[0]["id"] == "1"
#     assert filtered[1]["id"] == "2"

#     # Test filtering with time range
#     filtered = filter_playlist_tracks(
#         tracks,
#         min_date=(datetime.now() - timedelta(days=7)).isoformat(),
#     )
#     assert len(filtered) == 1
#     assert filtered[0]["id"] == "2"


# def test_filter_playlist_tracks_edge_cases():
#     """Test playlist track filtering edge cases."""
#     # Test with empty list
#     assert filter_playlist_tracks([]) == []

#     # Test with invalid dates
#     tracks = [
#         {
#             "track": {
#                 "id": "1",
#                 "name": "Track 1",
#                 "artists": [{"name": "Artist 1"}],
#                 "album": {"name": "Album 1"},
#                 "duration_ms": 180000,
#             },
#             "added_at": "invalid_date",
#         }
#     ]
#     filtered = filter_playlist_tracks(tracks)
#     assert len(filtered) == 1  # Should still include the track

#     # Test with missing added_at
#     tracks = [
#         {
#             "track": {
#                 "id": "1",
#                 "name": "Track 1",
#                 "artists": [{"name": "Artist 1"}],
#                 "album": {"name": "Album 1"},
#                 "duration_ms": 180000,
#             },
#         }
#     ]
#     filtered = filter_playlist_tracks(tracks)
#     assert len(filtered) == 1  # Should still include the track
