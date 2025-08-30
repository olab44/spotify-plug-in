import { Button } from '@/components/ui/button';
import styled from '@emotion/styled';
import { ProgressBar, Section, SectionTitle, StatItem } from './StyledComponents';

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
      <ProgressBar width={explicitContentRatio * 100} />
      <StatValueSmall>{(explicitContentRatio * 100).toFixed(1)}%</StatValueSmall>
    </StatItem>
    {duplicateTracks.length > 0 && (
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
    )}
  </Section>
);

const StatLabel = styled.p`...`;
const StatValueSmall = styled.p`...`;
const DuplicatesList = styled.ul`...`;
