import {
  BoldText,
  InfoText,
  ProgressBar,
  ProgressBarContainer,
  Section,
  SectionTitle,
  StatItem,
  StatLabel,
  StatValueSmall,
} from '../StyledComponents';

interface HitsAndPopularityProps {
  freshnessScore: number;
  tasteSimilarity: number;
  hitsVsHiddenGems: {
    hitsRatio: number;
    gemsRatio: number;
  };
}

export const HitsAndPopularity = ({
  freshnessScore,
  tasteSimilarity,
  hitsVsHiddenGems,
}: HitsAndPopularityProps) => (
  <Section>
    <SectionTitle>Hits & Popularity</SectionTitle>
    <InfoText>
      <BoldText>Freshness Score:</BoldText> {freshnessScore.toFixed(1)}/100
    </InfoText>
    <InfoText>
      <BoldText>Playlist vs. Your Taste:</BoldText> {(tasteSimilarity * 100).toFixed(0)}% similar
    </InfoText>
    <InfoText>
      <BoldText>Hits vs. Hidden Gems:</BoldText>
    </InfoText>
    <StatItem>
      <StatLabel>Hits</StatLabel>
      <ProgressBarContainer>
        <ProgressBar width={hitsVsHiddenGems.hitsRatio * 100} />
      </ProgressBarContainer>
      <StatValueSmall>{(hitsVsHiddenGems.hitsRatio * 100).toFixed(1)}%</StatValueSmall>
    </StatItem>
    <StatItem>
      <StatLabel>Hidden Gems</StatLabel>
      <ProgressBarContainer>
        <ProgressBar width={hitsVsHiddenGems.gemsRatio * 100} />
      </ProgressBarContainer>
      <StatValueSmall>{(hitsVsHiddenGems.gemsRatio * 100).toFixed(1)}%</StatValueSmall>
    </StatItem>
  </Section>
);
