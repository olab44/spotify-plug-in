import LeftPanel, { LeftPanelProvider } from '@/components/LeftPanel';
import { PageContainer, Title } from '@/components/StyledComponents';
import { TopStatsList } from '@/components/TopStatsList';
import { TopStatsRow } from '@/components/TopStatsRow';
import { usePlaylistsApi } from '@/hooks/api';
import { useGetPlaylistTracks } from '@/hooks/useGetPlaylistTracks';
import styled from '@emotion/styled';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PlaylistStats } from './PlaylistStats';

export const PlaylistDetails: React.FC = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
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

  return (
    <LeftPanelProvider>
      <LeftPanel />
      <PageContainer>
        {loading && <Title>Loading tracks...</Title>}
        {error && <Title>Error: {error}</Title>}
        {!loading && !error && data && (
          <ContentGrid>
            <StatsPanel>
              <Title>Playlist Stats</Title>
              {data.stats ? (
                <PlaylistStats
                  stats={data.stats}
                  onRemoveDuplicates={handleRemoveDuplicates}
                  isRemoving={isRemoving}
                />
              ) : (
                <p>No stats available for this playlist.</p>
              )}
            </StatsPanel>
            <TracksPanel>
              <Title>Playlist Tracks</Title>
              <TopStatsList
                items={data.tracks.map((item: any) => item.track)}
                noDataMessage="No tracks found in this playlist."
                renderRow={(track, idx) => (
                  <a
                    key={track.id}
                    href={track.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <TopStatsRow
                      rank={idx + 1}
                      imageUrl={track.album?.images?.[1]?.url || track.album?.images?.[0]?.url}
                      primaryText={track.name}
                      secondaryText={track.artists.map((a: { name: string }) => a.name).join(', ')}
                      tertiaryText={track.album.name}
                    />
                  </a>
                )}
                loading={false}
              />
              {removalError && <ErrorMessage>{removalError}</ErrorMessage>}
            </TracksPanel>
          </ContentGrid>
        )}
      </PageContainer>
    </LeftPanelProvider>
  );
};

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
`;

const StatsPanel = styled.div`
  padding: 16px;
  background-color: #121212;
  border-radius: 8px;
`;

const TracksPanel = styled.div`
  padding: 16px;
  background-color: #121212;
  border-radius: 8px;
`;

const ErrorMessage = styled.p`
  color: #e57373;
  text-align: center;
  margin-top: 16px;
`;
