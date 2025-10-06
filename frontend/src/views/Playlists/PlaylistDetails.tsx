/* eslint-disable @typescript-eslint/no-explicit-any */
import LeftPanel, { LeftPanelProvider } from '@/components/LeftPanel';
import { TopStatsList } from '@/components/TopStatsList';
import { TopStatsRow } from '@/components/TopStatsRow';
import { Button } from '@/components/ui/button';
import { usePlaylistsApi } from '@/hooks/api';
import { useGetPlaylistTracks } from '@/hooks/useGetPlaylistTracks';
import styled from '@emotion/styled';
import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PlaylistStats } from './PlaylistStats';

export const PlaylistDetails: React.FC = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const playlistNameFromUrl = searchParams.get('name');

  const { data, loading, error, refetch } = useGetPlaylistTracks(playlistId);
  const playlistsApi = usePlaylistsApi();
  const [isRemoving, setIsRemoving] = useState(false);
  const [removalError, setRemovalError] = useState<string | null>(null);

  const handleRemoveDuplicates = async () => {
    if (!playlistId || isRemoving) return;

    setIsRemoving(true);
    setRemovalError(null);
    try {
      await playlistsApi.post(`/${playlistId}/remove-duplicates`);
      await refetch();
    } catch (err) {
      console.error('Failed to remove duplicates:', err);
      setRemovalError('Failed to remove duplicates. Please try again.');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleGoBack = () => {
    navigate('/playlists');
  };

  return (
    <LeftPanelProvider>
      <LeftPanel />
      <Container>
        <MainContent>
          <Header>
            <BackButton onClick={handleGoBack}>← Back to Playlists</BackButton>
            <PlaylistTitle>
              {playlistNameFromUrl || (typeof data?.name === 'string' ? data.name : 'Playlist')}
            </PlaylistTitle>
          </Header>

          <Grid>
            <Panel>
              <PanelTitle>Playlist Stats</PanelTitle>
              {data?.stats ? (
                <PlaylistStats
                  stats={data.stats}
                  onRemoveDuplicates={handleRemoveDuplicates}
                  isRemoving={isRemoving}
                />
              ) : (
                <NoDataMessage>No stats available for this playlist.</NoDataMessage>
              )}
            </Panel>

            <Panel>
              <PanelTitle>Playlist Tracks</PanelTitle>
              <TopStatsList
                items={(data?.tracks || []).filter((t: any) => t && t.external_urls)}
                noDataMessage="No tracks found in this playlist."
                loading={loading}
                error={error}
                renderRow={(track, idx) => (
                  <TrackLink
                    key={track.id || idx}
                    href={track.external_urls?.spotify || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <TopStatsRow
                      rank={idx + 1}
                      imageUrl={track.album?.images?.[1]?.url || track.album?.images?.[0]?.url}
                      primaryText={track.name || 'Unknown track'}
                      secondaryText={
                        track.artists?.map((a: { name: string }) => a.name).join(', ') ||
                        'Unknown artist'
                      }
                      tertiaryText={track.album?.name || 'Unknown album'}
                    />
                  </TrackLink>
                )}
              />
              {removalError && <ErrorMessage>{removalError}</ErrorMessage>}
            </Panel>
          </Grid>
        </MainContent>
      </Container>
    </LeftPanelProvider>
  );
};

const Container = styled.div`
  display: flex;
  background-color: #121212;
  min-height: 100vh;
  color: #fff;
  font-family: 'Inter', sans-serif;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem 3rem;
  overflow-y: auto;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled(Button)`
  background-color: #1db954 !important;
  color: #000 !important;
  font-weight: 600;
  border-radius: 25px;
  padding: 0.6rem 1.5rem;
  &:hover {
    background-color: #1ed760 !important;
  }
  grid-column: 1 / 2;
  justify-self: start;
`;

const PlaylistTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1db954;
  grid-column: 2 / 3;
  justify-self: center;
  white-space: nowrap;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
`;

const Panel = styled.div`
  background-color: #181818;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #282828;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.3);
`;

const PanelTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1db954;
`;

const TrackLink = styled.a`
  text-decoration: none;
  color: inherit;
  display: block;
  &:hover {
    background-color: #282828;
    border-radius: 8px;
    transition: 0.2s ease;
  }
`;

const NoDataMessage = styled.p`
  color: #b3b3b3;
  text-align: center;
  padding: 2rem 0;
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
`;
