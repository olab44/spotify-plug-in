import LeftPanel, { LeftPanelProvider } from '@/components/LeftPanel';
import { PageContainer, Title } from '@/components/StyledComponents';
import TimeRangeSelector from '@/components/TimeRangeSelector';
import { TopStatsList } from '@/components/TopStatsList';
import { TopStatsRow } from '@/components/TopStatsRow';
import { useTopTracks } from '@/hooks/useGetTopTracks';
import styled from '@emotion/styled';
import React, { useState } from 'react';

const PERIODS = [
  { label: 'Last 4 weeks', value: 'short-term' },
  { label: 'Last 6 months', value: 'medium-term' },
  { label: 'Last 12 months', value: 'long-term' },
];

export const TopTracks: React.FC = () => {
  const [period, setPeriod] = useState('medium-term');
  const { tracks, loading, error } = useTopTracks(period);

  return (
    <LeftPanelProvider>
      <LeftPanel />
      <PageContainer>
        <Title>Your Top 50 Tracks</Title>
        <TimeRangeSelector period={period} onPeriodChange={setPeriod} periods={PERIODS} />
        <TopStatsList
          loading={loading}
          error={error}
          items={tracks}
          renderRow={(track, idx) => (
            <ClickableCardWrapper
              key={track.id}
              href={track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TopStatsRow
                rank={idx + 1}
                imageUrl={track.album?.images?.[1]?.url || track.album?.images?.[0]?.url}
                primaryText={track.name}
                secondaryText={track.artists.map((a: any) => a.name).join(', ')}
                tertiaryText={track.album.name}
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
    box-shadow: 0 15px 20px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -4px rgba(0, 0, 0, 0.08);
  }
`;
