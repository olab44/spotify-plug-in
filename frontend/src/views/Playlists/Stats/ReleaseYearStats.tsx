import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'; // Import Recharts components
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
      decade,
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
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={decadeData}>
          <XAxis dataKey="decade" stroke="#b3b3b3" tickLine={false} axisLine={false} />
          <YAxis stroke="#b3b3b3" tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ backgroundColor: '#212121', border: 'none' }} />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#1db954"
            strokeWidth={2}
            dot={{ r: 5, fill: '#1db954', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Section>
  );
};
