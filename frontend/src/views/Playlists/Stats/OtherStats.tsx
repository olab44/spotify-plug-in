import { Button } from '@/components/ui/button';
import {
  DuplicatesList,
  InfoText,
  ProgressBar,
  ProgressBarContainer,
  Section,
  SectionTitle,
  StatItem,
  StatLabel,
  StatValueSmall,
} from '../StyledComponents';

interface OtherStatsProps {
  explicitContentRatio: number;
  duplicateTracks: { name: string; count: number }[];
  onRemoveDuplicates: () => void;
  isRemoving: boolean;
}

export const OtherStats = ({
  explicitContentRatio,
  duplicateTracks,
  onRemoveDuplicates,
  isRemoving,
}: OtherStatsProps) => (
  <Section>
    <SectionTitle>Other Stats</SectionTitle>
    <StatItem>
      <StatLabel>Explicit Content</StatLabel>
      <ProgressBarContainer>
        <ProgressBar width={explicitContentRatio * 100} />
      </ProgressBarContainer>
      <StatValueSmall>{(explicitContentRatio * 100).toFixed(1)}%</StatValueSmall>
    </StatItem>
    {duplicateTracks.length > 0 ? (
      <StatItem>
        <StatLabel>Duplicates</StatLabel>
        <DuplicatesList>
          {duplicateTracks.map((dup, index) => (
            <li key={index}>
              {dup.name} (x{dup.count})
            </li>
          ))}
        </DuplicatesList>
        <Button onClick={onRemoveDuplicates} disabled={isRemoving}>
          {isRemoving ? 'Removing...' : 'Remove Duplicates'}
        </Button>
      </StatItem>
    ) : (
      <InfoText>No duplicate tracks found. ✅</InfoText>
    )}
  </Section>
);
