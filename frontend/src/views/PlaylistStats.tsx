import { Title } from '@/components/StyledComponents';
import styled from '@emotion/styled';
import React from 'react';

interface PlaylistStatsProps {
  stats: {
    totalTracks: number;
    totalDuration: string;
    avgReleaseYear: number;
    releaseYearHistogram: { [decade: string]: number };
    oldestTrack: { name: string; year: number };
    newestTrack: { name: string; year: number };
    avgPopularity: number;
    medianPopularity: number;
    explicitContentRatio: number;
    duplicateTracks: { name: string; count: number }[];
    topGenres: { [genre: string]: number };
  };
}

export const PlaylistStats: React.FC<PlaylistStatsProps> = ({ stats }) => {
  const sortedGenres = Object.entries(stats.topGenres).sort(([, a], [, b]) => b - a);
  const genresToDisplay = sortedGenres.slice(0, 5);

  return (
    <StatsContainer>
      <StatsGrid>
        <StatCard>
          <StatLabel>Number of Tracks</StatLabel>
          <StatValue>{stats.totalTracks}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Total Listening Time</StatLabel>
          <StatValue>{stats.totalDuration}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Average Popularity</StatLabel>
          <StatValue>{stats.avgPopularity.toFixed(1)}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Average Release Year</StatLabel>
          <StatValue>{stats.avgReleaseYear.toFixed(0)}</StatValue>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionTitle>Top Genres</SectionTitle>
        <List>
          {genresToDisplay.map(([genre, count], idx) => (
            <li key={genre}>
              <ListItemText>
                {idx + 1}. {genre.replace('-', ' ')}
              </ListItemText>
            </li>
          ))}
        </List>
      </Section>

      <Section>
        <SectionTitle>Track Release Years</SectionTitle>
        <InfoText>
          Oldest: {stats.oldestTrack.name} ({stats.oldestTrack.year})
        </InfoText>
        <InfoText>
          Newest: {stats.newestTrack.name} ({stats.newestTrack.year})
        </InfoText>
        <Histogram>
          {Object.entries(stats.releaseYearHistogram).map(([decade, count]) => (
            <HistogramBar key={decade} height={(count / stats.totalTracks) * 100}>
              <BarLabel>{decade}</BarLabel>
            </HistogramBar>
          ))}
        </Histogram>
      </Section>

      <Section>
        <SectionTitle>Other Stats</SectionTitle>
        <StatItem>
          <StatLabel>Explicit Content</StatLabel>
          <StatValue>{(stats.explicitContentRatio * 100).toFixed(1)}%</StatValue>
        </StatItem>
        {stats.duplicateTracks.length > 0 && (
          <StatItem>
            <StatLabel>Duplicates</StatLabel>
            <DuplicatesList>
              {stats.duplicateTracks.map((dup, index) => (
                <li key={index}>
                  {dup.name} (x{dup.count})
                </li>
              ))}
            </DuplicatesList>
          </StatItem>
        )}
      </Section>
    </StatsContainer>
  );
};

const StatsContainer = styled.div`...`;
const StatsGrid = styled.div`...`;
const StatCard = styled.div`...`;
const StatLabel = styled.p`...`;
const StatValue = styled.p`...`;
const Section = styled.div`...`;
const SectionTitle = styled(Title)`...`;
const InfoText = styled.p`...`;
const List = styled.ul`...`;
const ListItemText = styled.span`...`;
const ListItemCount = styled.span`...`;
const DuplicatesList = styled.ul`...`;
const Histogram = styled.div`...`;
const HistogramBar = styled.div<{ height: number }>`...`;
const BarLabel = styled.span`...`;

const StatItem = styled.div`...`;
