import LeftPanel, { LeftPanelProvider } from '@/components/LeftPanel';
import { PageContainer, Title } from '@/components/StyledComponents';
import { TopStatsList } from '@/components/TopStatsList';
import { TopStatsRow } from '@/components/TopStatsRow';
import { useGetPlaylistTracks } from '@/hooks/useGetPlaylistTracks';
import React from 'react';
import { useParams } from 'react-router-dom';

export const PlaylistDetails: React.FC = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const { tracks, loading, error } = useGetPlaylistTracks(playlistId);

  return (
    <LeftPanelProvider>
      <LeftPanel />
      <PageContainer>
        {loading && <Title>Loading tracks...</Title>}
        {error && <Title>Error: {error}</Title>}
        {!loading && !error && (
          <>
            <Title>Playlist Tracks</Title>
            <TopStatsList
              loading={loading}
              error={error}
              items={tracks}
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
                    secondaryText={track.artists.map((a: any) => a.name).join(', ')}
                    tertiaryText={track.album.name}
                  />
                </a>
              )}
            />
          </>
        )}
      </PageContainer>
    </LeftPanelProvider>
  );
};
