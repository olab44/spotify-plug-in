import styled from '@emotion/styled';

interface StatItemProps {
  label: string;
  value: string | number;
}

const StatItem = ({ label, value }: StatItemProps) => (
  <StatCard>
    <StatLabel>{label}</StatLabel>
    <StatValue>{value}</StatValue>
  </StatCard>
);

interface ReleaseYearStats {
  avgReleaseYear: number;
}

interface StatsGridProps {
  stats: {
    totalTracks: number;
    totalDuration: string | number;
    avgPopularity: number;
    releaseYearStats: ReleaseYearStats;
  };
}

export const StatsGrid = ({ stats }: StatsGridProps) => (
  <GridContainer>
    <StatItem label="Number of Tracks" value={stats.totalTracks} />
    <StatItem label="Total Listening Time" value={stats.totalDuration} />
    <StatItem label="Average Popularity" value={stats.avgPopularity.toFixed(1)} />
    <StatItem
      label="Average Release Year"
      value={stats.releaseYearStats.avgReleaseYear.toFixed(0)}
    />
  </GridContainer>
);

const GridContainer = styled.div`
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
