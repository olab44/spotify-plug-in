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
  const otherGenresCount = sortedGenres.slice(5).reduce((sum, [, count]) => sum + count, 0);
  const totalGenresCount = sortedGenres.reduce((sum, [, count]) => sum + count, 0);
  const decadeData = Object.entries(stats.releaseYearHistogram).sort(
    ([a], [b]) => parseInt(a) - parseInt(b),
  );
  const maxCount = decadeData.reduce((max, [, count]) => Math.max(max, count), 0);

  const yAxisLabels =
    maxCount > 0 ? Array.from({ length: 5 }, (_, i) => Math.round(maxCount * (1 - i / 4))) : [0];

  const pieChartData = [
    ...genresToDisplay.map(([genre, count]) => ({
      genre,
      percentage: (count / totalGenresCount) * 100,
    })),
    { genre: 'Other', percentage: (otherGenresCount / totalGenresCount) * 100 },
  ];

  const pieColors = ['#1DB954', '#5D41FF', '#FF415D', '#41CFFF', '#FFC941', '#B3B3B3'];

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
        <GenreChartContainer>
          <PieChart viewBox="0 0 100 100">
            {pieChartData.map((data, index) => {
              const startAngle = pieChartData
                .slice(0, index)
                .reduce((sum, d) => sum + (d.percentage / 100) * 360, 0);
              const endAngle = startAngle + (data.percentage / 100) * 360;
              const largeArcFlag = data.percentage > 50 ? 1 : 0;
              const radius = 50;
              const x1 = 50 + radius * Math.cos((Math.PI * startAngle) / 180);
              const y1 = 50 + radius * Math.sin((Math.PI * startAngle) / 180);
              const x2 = 50 + radius * Math.cos((Math.PI * endAngle) / 180);
              const y2 = 50 + radius * Math.sin((Math.PI * endAngle) / 180);

              return (
                <path
                  key={data.genre}
                  d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={pieColors[index]}
                />
              );
            })}
          </PieChart>
          <Legend>
            {pieChartData.map((data, index) => (
              <LegendItem key={data.genre}>
                <LegendColor color={pieColors[index]} />
                {data.genre.replace('-', ' ')}
              </LegendItem>
            ))}
          </Legend>
        </GenreChartContainer>
      </Section>

      <Section>
        <SectionTitle>Track Release Years</SectionTitle>
        <InfoText>
          <BoldText>Oldest:</BoldText> {stats.oldestTrack.name} ({stats.oldestTrack.year})
        </InfoText>
        <InfoText>
          <BoldText>Newest:</BoldText> {stats.newestTrack.name} ({stats.newestTrack.year})
        </InfoText>

        <HistogramContainer>
          <YAxis>
            {yAxisLabels.map((label, index) => (
              <YAxisLabel key={index}>{label}</YAxisLabel>
            ))}
          </YAxis>
          <Histogram>
            {decadeData.map(([decade, count]) => (
              <HistogramBar key={decade} height={maxCount > 0 ? (count / maxCount) * 100 : 0}>
                <BarLabel>{count}</BarLabel> {/* Display the count on top of the bar */}
              </HistogramBar>
            ))}
          </Histogram>
        </HistogramContainer>
        <XAxis>
          {decadeData.map(([decade]) => (
            <XAxisLabel key={decade}>{decade}</XAxisLabel>
          ))}
        </XAxis>
      </Section>

      <Section>
        <SectionTitle>Other Stats</SectionTitle>
        <StatItem>
          <StatLabel>Explicit Content</StatLabel>
          <ProgressBarContainer>
            <ProgressBar width={stats.explicitContentRatio * 100} />
          </ProgressBarContainer>
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

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 24px 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
`;

const StatCard = styled.div`
  background-color: #212121;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
`;

const StatLabel = styled.p`
  color: #b3b3b3;
  font-size: 0.9rem;
  margin: 0 0 8px;
`;

const StatValue = styled.p`
  color: #fff;
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
`;

const Section = styled.div`
  background-color: #212121;
  padding: 24px;
  border-radius: 8px;
`;

const SectionTitle = styled(Title)`
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 16px;
`;

const InfoText = styled.p`
  color: #b3b3b3;
  margin: 8px 0;
  font-size: 0.9rem;
`;

const BoldText = styled.span`
  font-weight: bold;
  color: #fff;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #333;
  &:last-of-type {
    border-bottom: none;
  }
`;

const DuplicatesList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  text-align: right;
  color: #fff;
  font-size: 0.9rem;
`;

const ProgressBarContainer = styled.div`
  flex-grow: 1;
  background-color: #404040;
  height: 10px;
  border-radius: 5px;
  margin: 0 16px;
  overflow: hidden;
`;

const ProgressBar = styled.div<{ width: number }>`
  height: 100%;
  width: ${(props) => props.width}%;
  background-color: #1db954;
  border-radius: 5px;
  transition: width 0.5s ease;
`;

const GenreChartContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  justify-content: center;
  padding: 16px;
`;

const PieChart = styled.svg`
  width: 150px;
  height: 150px;
  transform: rotate(-90deg);
  border-radius: 50%;
`;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 0.9rem;
`;

const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  background-color: ${(props) => props.color};
  border-radius: 2px;
  margin-right: 8px;
`;

const YAxis = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding-right: 8px;
  border-right: 1px solid #333;
`;

const YAxisLabel = styled.span`
  color: #b3b3b3;
  font-size: 0.75rem;
  text-align: right;
`;

const XAxis = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  padding: 0 16px;
`;

const XAxisLabel = styled.span`
  color: #b3b3b3;
  font-size: 0.75rem;
  text-align: center;
  flex-grow: 1;
`;

const Histogram = styled.div`
  display: flex;
  flex-grow: 1;
  height: 100%;
  align-items: flex-end;
  gap: 4px;
`;

const HistogramBar = styled.div<{ height: number }>`
  flex-grow: 1;
  background-color: #1db954;
  height: ${(props) => Math.max(0, props.height)}%;
  position: relative;
  display: flex;
  justify-content: center;
  border-radius: 4px;
`;

const BarLabel = styled.span`
  position: absolute;
  top: -20px;
  color: #fff;
  font-size: 0.75rem;
  font-weight: bold;
`;

const HistogramContainer = styled.div`
  display: flex;
  height: 150px; /* Increased height for better visibility */
  gap: 8px;
  align-items: flex-end;
  padding: 0 16px;
  position: relative;
`;
