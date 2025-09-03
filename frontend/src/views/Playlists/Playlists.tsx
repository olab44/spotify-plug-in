import LeftPanel, { LeftPanelProvider } from '@/components/LeftPanel';
import { PageContainer, Title } from '@/components/StyledComponents';
import { useGetPlaylists } from '@/hooks/useGetPlaylists';
import styled from '@emotion/styled';
import React from 'react';
import { createSearchParams, Link } from 'react-router-dom';

export const Playlists: React.FC = () => {
  const { playlists, loading, error } = useGetPlaylists();

  const content = loading ? (
    <LoadingMessage>Loading your playlists...</LoadingMessage>
  ) : error ? (
    <ErrorMessage>{error}</ErrorMessage>
  ) : playlists.length > 0 ? (
    <PlaylistGrid>
      {playlists.map((playlist) => (
        <PlaylistCard key={playlist.id}>
          <StyledLink
            to={{
              pathname: `/playlists/${playlist.id}`,
              search: createSearchParams({
                name: playlist.name,
              }).toString(),
            }}
          >
            {playlist.images?.[0]?.url ? (
              <PlaylistImage src={playlist.images[0].url} alt={playlist.name} />
            ) : (
              <PlaceholderImage />
            )}
            <PlaylistName>{playlist.name}</PlaylistName>
            <PlaylistDetails>{playlist.tracks.total} songs</PlaylistDetails>
          </StyledLink>
        </PlaylistCard>
      ))}
    </PlaylistGrid>
  ) : (
    <NoPlaylistsMessage>No playlists found. Create some on Spotify!</NoPlaylistsMessage>
  );

  return (
    <LeftPanelProvider>
      <LeftPanel />
      <PageContainer>
        <Title>Your Playlists</Title>
        {content}
      </PageContainer>
    </LeftPanelProvider>
  );
};

const PlaylistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
  padding: 24px 0;
`;

const PlaylistCard = styled.div`
  background-color: #212121;
  border-radius: 8px;
  padding: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
`;

const PlaylistImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 4px;
  object-fit: cover;
  margin-bottom: 12px;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: #404040;
  border-radius: 4px;
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #b3b3b3;
  font-size: 1.5rem;

  &::before {
    content: '♬';
  }
`;

const PlaylistName = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 4px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlaylistDetails = styled.p`
  font-size: 0.875rem;
  color: #b3b3b3;
  margin: 0;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LoadingMessage = styled.p`
  text-align: center;
  color: #b3b3b3;
  font-size: 1.25rem;
  margin-top: 50px;
`;

const ErrorMessage = styled(LoadingMessage)`
  color: #e57373;
`;

const NoPlaylistsMessage = styled(LoadingMessage)``;
