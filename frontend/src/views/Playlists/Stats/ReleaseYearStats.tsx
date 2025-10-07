import styled from '@emotion/styled';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BoldText, InfoText, Section, SectionTitle } from '../StyledComponents';

interface ReleaseYearStatsProps {
  releaseYearStats: {
    avgReleaseYear: number;
    oldestTrack: { name: string; year: number };
    newestTrack: { name: string; year: number };
    histogram: { [decade: string]: number };
  };
}

export const ReleaseYearStats = ({ releaseYearStats }: ReleaseYearStatsProps) => {
  const decadeData = Object.entries(releaseYearStats.histogram)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([decade, count]) => ({
      year: decade,
      count,
    }));

  return (
    <Section>
      <SectionTitle>Track Release Years</SectionTitle>
      <InfoText>
        <BoldText>Oldest:</BoldText> {releaseYearStats.oldestTrack.name} (
        {releaseYearStats.oldestTrack.year})
      </InfoText>
      <InfoText>
        <BoldText>Newest:</BoldText> {releaseYearStats.newestTrack.name} (
        {releaseYearStats.newestTrack.year})
      </InfoText>

      <ChartContainer>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={decadeData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <XAxis
              dataKey="year"
              stroke="#b3b3b3"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              stroke="#b3b3b3"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              label={{
                value: 'Count',
                angle: -90,
                position: 'insideLeft',
                fill: '#b3b3b3',
                fontSize: 10,
              }}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: '#282828' }}
              contentStyle={{ backgroundColor: '#212121', border: '1px solid #333', color: '#fff' }}
              labelFormatter={(label) => `Release Year: ${label}`}
              formatter={(value, name) => [value, 'Tracks']}
            />
            <Bar dataKey="count" fill="#1db954" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Section>
  );
};

const ChartContainer = styled.div`
  background-color: #181818;
  padding-top: 1rem;
`;
