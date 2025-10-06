import { Button } from '@/components/ui/button';
import styled from '@emotion/styled';
import {
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

    <HorizontalRule />

    <StatItem style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
      <StatLabel style={{ marginBottom: 0 }}>Duplicates</StatLabel>
      {duplicateTracks.length > 0 ? (
        <>
          <DuplicatesContainer>
            {' '}
            <DuplicatesList>
              {duplicateTracks.map((dup, index) => (
                <li key={index}>
                  **{dup.name}** (x{dup.count})
                </li>
              ))}
            </DuplicatesList>
            <InfoText style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#b3b3b3' }}>
              Found {duplicateTracks.length} track(s) with duplicates.
            </InfoText>
          </DuplicatesContainer>
          <Button
            onClick={onRemoveDuplicates}
            disabled={isRemoving}
            style={{
              backgroundColor: '#d62828',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            {isRemoving ? 'Removing...' : 'Remove Duplicates'}
          </Button>
        </>
      ) : (
        <InfoText>No duplicate tracks found. ✅</InfoText>
      )}
    </StatItem>
  </Section>
);

const HorizontalRule = styled.hr`
  border: none;
  height: 1px;
  background-color: #282828; /* Dark gray separator */
  margin: 1.5rem 0;
  width: 100%;
`;

const DuplicatesContainer = styled.div`
  background-color: #242424; /* Slightly lighter background for the list */
  border-radius: 8px;
  padding: 1rem;
  width: 100%;
`;

const DuplicatesList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0;
  & li {
    padding: 0.25rem 0;
    font-size: 0.95rem;
  }
`;
