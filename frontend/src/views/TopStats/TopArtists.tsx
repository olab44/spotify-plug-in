import LeftPanel, { LeftPanelProvider } from '@/components/LeftPanel';
import { PageContainer, Title } from '@/components/StyledComponents';
import TimeRangeSelector from '@/components/TimeRangeSelector';
import { TopStatsList } from '@/components/TopStatsList';
import { TopStatsRow } from '@/components/TopStatsRow';
import { useTopArtists } from '@/hooks/useGetTopArtists';
import styled from '@emotion/styled';
import React, { useState } from 'react';

const PERIODS = [
  { label: 'Last 4 weeks', value: 'short-term' },
  { label: 'Last 6 months', value: 'medium-term' },
  { label: 'Last 12 months', value: 'long-term' },
];

export const TopArtists: React.FC = () => {
  const [period, setPeriod] = useState('medium-term');
  const { artists, loading, error } = useTopArtists(period);

  return (
    <LeftPanelProvider>
      <LeftPanel />
      <PageContainer>
        <Title>Your Top Artists</Title>
        <TimeRangeSelector period={period} onPeriodChange={setPeriod} periods={PERIODS} />
        <TopStatsList
          loading={loading}
          error={error}
          items={artists}
          renderRow={(artist, idx) => (
            <ClickableCardWrapper
              key={artist.id}
              href={artist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TopStatsRow
                rank={idx + 1}
                imageUrl={artist.images?.[1]?.url || artist.images?.[0]?.url}
                primaryText={artist.name}
                secondaryText={[
                  artist.genres.slice(0, 3).join(', '),
                  artist.library_song_count
                    ? `${artist.library_song_count} songs in your library`
                    : null,
                ]
                  .filter(Boolean)
                  .join(' • ')}
              />
            </ClickableCardWrapper>
          )}
        />
      </PageContainer>
    </LeftPanelProvider>
  );
};

const ClickableCardWrapper = styled.a`
  display: block;
  text-decoration: none;
  color: inherit;
  cursor: pointer;

  &:hover > div {
    transform: translateY(-5px);
    box-shadow:
      0 15px 20px -5px rgba(0, 0, 0, 0.15),
      0 8px 10px -4px rgba(0, 0, 0, 0.08);
  }
`;
