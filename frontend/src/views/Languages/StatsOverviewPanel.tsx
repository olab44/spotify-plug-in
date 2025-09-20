import { Panel } from '@/components/common/StyledComponents';
import { LanguageStats } from '@/hooks/useLanguageStats';
import React from 'react';
import { SectionTitle, StatCard, StatLabel, StatValue, StatsOverview } from './Styles';

interface StatsOverviewPanelProps {
  stats: LanguageStats;
}

export const StatsOverviewPanel: React.FC<StatsOverviewPanelProps> = ({ stats }) => {
  return (
    <Panel>
      <SectionTitle>Key Statistics</SectionTitle>
      <StatsOverview>
        <StatCard>
          <StatLabel>Tracks Analyzed</StatLabel>
          <StatValue>{stats.total_tracks || 0}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Primary Language</StatLabel>
          <StatValue>{stats.dominant_language || 'N/A'}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Diversity Score</StatLabel>
          <StatValue>{`${(stats.language_diversity_score * 100).toFixed(0)}%`}</StatValue>
        </StatCard>
      </StatsOverview>
    </Panel>
  );
};
