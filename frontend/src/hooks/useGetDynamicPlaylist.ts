import { useDynamicPlaylistApi } from './api/api';
import { useApiData } from './api/useApiData';

// --- Type Definitions ---
// These should match the response from your FastAPI backend.

/**
 * Represents a single track within the playlist.
 */
interface Track {
  uri: string;
  name: string;
  artist: string;
}

/**
 * Represents the full structure of the Heavy Rotation playlist details.
 */
interface PlaylistDetails {
  id: string;
  name: string;
  description: string;
  url: string;
  owner: string;
  tracks: Track[];
}

// --- The Hook ---

/**
 * Fetches the "Heavy Rotation" dynamic playlist data.
 *
 * @returns An object containing the playlist data, loading state, error state,
 * and a refetch function.
 */
export const useGetDynamicPlaylist = () => {
  // 1. Get the specific Axios instance for the '/playlists' endpoint.
  const playlistsApi = useDynamicPlaylistApi();

  // 2. Use the generic data fetching hook to get the playlist.
  // We rename 'data' to 'playlist' for better readability.
  const { data: playlist, ...rest } = useApiData<PlaylistDetails>(
    playlistsApi,
    '/heavy-rotation/refresh', // The specific endpoint to get/refresh the playlist
  );

  // 3. Return the playlist data and the rest of the properties (loading, error, refetch).
  return { playlist, ...rest };
};
