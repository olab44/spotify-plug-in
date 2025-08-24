import LoadingIndicator from '@/components/LoadingIndicator';
import TimeRangeSelector from '@/components/TimeRangeSelector';
import { useTopTracks } from '@/hooks/useGetTopTracks';
import styled from '@emotion/styled';
import React, { useState } from 'react';

const PERIODS = [
  { label: 'Last 4 weeks', value: 'short-term' },
  { label: 'Last 6 months', value: 'medium-term' },
  { label: 'All time', value: 'long-term' },
];

const TopTracks: React.FC = () => {
  const [period, setPeriod] = useState('medium-term');
  const { tracks, loading } = useTopTracks(period);

  return (
    <PageContainer>
      <Title>Your Top 50 Tracks</Title>
      <TimeRangeSelector period={period} onPeriodChange={setPeriod} periods={PERIODS} />
      {loading ? (
        <LoadingIndicator />
      ) : (
        <TracksList>
          {tracks.map((track, idx) => (
            <TrackCard key={track.id}>
              <TrackIndex>{idx + 1}.</TrackIndex>
              <TrackImage
                src={track.album?.images?.[1]?.url || track.album?.images?.[0]?.url}
                alt={track.name}
              />
              <TrackDetails>
                <TrackName>{track.name}</TrackName>
                <TrackArtists>{track.artists.map((a: any) => a.name).join(', ')}</TrackArtists>
                <TrackAlbum>{track.album.name}</TrackAlbum>
              </TrackDetails>
            </TrackCard>
          ))}
        </TracksList>
      )}
    </PageContainer>
  );
};

export default TopTracks;

const PageContainer = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const TracksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TrackCard = styled.div`
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TrackImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 0.25rem;
`;

const TrackDetails = styled.div`
  flex-grow: 1;
`;

const TrackName = styled.div`
  font-weight: bold;
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
`;

const TrackArtists = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const TrackAlbum = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
`;

const TrackIndex = styled.div`
  font-weight: bold;
  font-size: 1.25rem;
  min-width: 2rem;
  text-align: right;
  color: #4b5563;
`;
