import { ErrorMessage, LoadingMessage } from '@/components/common/StyledComponents';
import React from 'react';
import { FilterContainer, Label, Select } from './Styles';
import { Playlist } from './index';

interface PlaylistFilterProps {
  playlists: Playlist[];
  playlistsLoading: boolean;
  playlistsError: string | null;
  selectedPlaylist: string | null;
  onSelect: (playlistId: string | null) => void;
}

export const PlaylistFilter: React.FC<PlaylistFilterProps> = ({
  playlists,
  playlistsLoading,
  playlistsError,
  selectedPlaylist,
  onSelect,
}) => {
  return (
    <FilterContainer>
      <Label htmlFor="playlist-select">Select Playlist:</Label>
      {playlistsLoading ? (
        <LoadingMessage>Loading playlists...</LoadingMessage>
      ) : playlistsError ? (
        <ErrorMessage>{playlistsError}</ErrorMessage>
      ) : (
        <Select
          id="playlist-select"
          value={selectedPlaylist || ''}
          onChange={(e) => onSelect(e.target.value || null)}
        >
          <option value="">Select a Playlist...</option>
          <option value="all">All Tracks (Global)</option>
          {playlists.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
      )}
    </FilterContainer>
  );
};
