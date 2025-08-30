import styled from '@emotion/styled';
import { BoldText, InfoText, Section, SectionTitle } from './StyledComponents';

interface ReleaseYearStatsProps {
  releaseYearStats: {
    avgReleaseYear: number;
    oldestTrack: { name: string; year: number };
    newestTrack: { name: string; year: number };
    histogram: { [decade: string]: number };
  };
}

export const ReleaseYearStats = ({ releaseYearStats }: ReleaseYearStatsProps) => {
  const decadeData = Object.entries(releaseYearStats.histogram).sort(
    ([a], [b]) => parseInt(a) - parseInt(b),
  );
  const maxCount = decadeData.reduce((max, [, count]) => Math.max(max, count), 0);
  const yAxisLabels =
    maxCount > 0 ? Array.from({ length: 5 }, (_, i) => Math.round(maxCount * (1 - i / 4))) : [0];

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
      <HistogramContainer>
        <YAxis>
          {yAxisLabels.map((label, index) => (
            <YAxisLabel key={index}>{label}</YAxisLabel>
          ))}
        </YAxis>
        <Histogram>
          {decadeData.map(([decade, count]) => (
            <HistogramBar key={decade} height={maxCount > 0 ? (count / maxCount) * 100 : 0}>
              <BarLabel>{count}</BarLabel>
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
  );
};

const YAxis = styled.div`...`;
const YAxisLabel = styled.span`...`;
const XAxis = styled.div`...`;
const XAxisLabel = styled.span`...`;
const Histogram = styled.div`...`;
const HistogramBar = styled.div<{ height: number }>`...`;
const BarLabel = styled.span`...`;
const HistogramContainer = styled.div`...`;
