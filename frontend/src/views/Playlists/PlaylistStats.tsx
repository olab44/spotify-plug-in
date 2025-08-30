import styled from '@emotion/styled';
import React from 'react';

import { GenreStats } from './GenreStats';
import { HitsAndPopularity } from './HitsAndPopularity';
import { OtherStats } from './OtherStats';
import { ReleaseYearStats } from './ReleaseYearStats';
import { StatsGrid } from './StatsGrid';

interface PlaylistStatsProps {
  stats: any;
  onRemoveDuplicates: () => void;
  isRemoving: boolean;
}

export const PlaylistStats: React.FC<PlaylistStatsProps> = ({
  stats,
  onRemoveDuplicates,
  isRemoving,
}) => {
  return (
    <StatsContainer>
      <StatsGrid stats={stats} />
      <GenreStats genres={stats.genres} diversityScore={stats.diversityScore} />
      <ReleaseYearStats releaseYearStats={stats.releaseYearStats} />
      <HitsAndPopularity
        freshnessScore={stats.freshnessScore}
        tasteSimilarity={stats.tasteSimilarity}
        hitsVsHiddenGems={stats.hitsVsHiddenGems}
      />
      <OtherStats
        explicitContentRatio={stats.explicitContentRatio}
        duplicateTracks={stats.duplicateTracks}
        onRemoveDuplicates={onRemoveDuplicates}
        isRemoving={isRemoving}
      />
    </StatsContainer>
  );
};

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 24px 0;
`;
