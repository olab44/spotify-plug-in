import LeftPanel, { LeftPanelProvider } from '@/components/LeftPanel';
import {
  ErrorMessage,
  LoadingMessage,
  PageContainer,
  Text,
  Title,
} from '@/components/common/StyledComponents';
import { useGetPlaylists } from '@/hooks/useGetPlaylists';
import { useLanguageStats } from '@/hooks/useLanguageStats';
import React, { useState } from 'react';
import { ExampleTracksPanel } from './ExampleTracksPanel';
import { LanguageDistributionPanel } from './LanguageDistributionPanel';
import { PlaylistFilter } from './PlaylistFilter';
import { StatsOverviewPanel } from './StatsOverviewPanel';
import { ContentGrid } from './Styles';

export interface Playlist {
  id: string;
  name: string;
}

export const LanguageStats: React.FC = () => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const { playlists, loading: playlistsLoading, error: playlistsError } = useGetPlaylists();

  const scope = selectedPlaylist === 'all' ? 'global' : 'playlist';
  const { stats, isLoading, error } = useLanguageStats(
    scope,
    selectedPlaylist && selectedPlaylist !== 'all' ? selectedPlaylist : undefined,
  );

  return (
    <LeftPanelProvider>
      <LeftPanel />
      <PageContainer>
        <Title>Your Music Languages</Title>

        <PlaylistFilter
          playlists={playlists}
          playlistsLoading={playlistsLoading}
          playlistsError={playlistsError}
          selectedPlaylist={selectedPlaylist}
          onSelect={setSelectedPlaylist}
        />

        {isLoading && <LoadingMessage>Analyzing your music languages...</LoadingMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {!isLoading && !error && stats && (
          <ContentGrid>
            <StatsOverviewPanel stats={stats} />
            <LanguageDistributionPanel stats={stats} />
            <ExampleTracksPanel stats={stats} />
          </ContentGrid>
        )}
        {!isLoading && !error && !stats && (
          <Text>Please select a playlist from the dropdown above to view language statistics.</Text>
        )}
      </PageContainer>
    </LeftPanelProvider>
  );
};
