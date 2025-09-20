import { Panel } from '@/components/common/StyledComponents';
import { LanguageStats } from '@/hooks/useLanguageStats';
import React from 'react';
import {
  LanguageCode,
  LanguageHeader,
  LanguageItem,
  LanguageList,
  PercentageText,
  ProgressBar,
  ProgressBarContainer,
  SectionTitle,
  Text,
} from './Styles';

interface LanguageDistributionPanelProps {
  stats: LanguageStats;
}

export const LanguageDistributionPanel: React.FC<LanguageDistributionPanelProps> = ({ stats }) => {
  return (
    <Panel>
      <SectionTitle>Language Distribution</SectionTitle>
      <LanguageList>
        {stats.languages.map((lang) => (
          <LanguageItem key={lang.language_code}>
            <LanguageHeader>
              <LanguageCode>{lang.language_code}</LanguageCode>
              <Text variant="secondary">{lang.count} tracks</Text>
            </LanguageHeader>
            <ProgressBarContainer>
              <ProgressBar width={lang.percentage} />
            </ProgressBarContainer>
            <PercentageText>{lang.percentage.toFixed(1)}%</PercentageText>
          </LanguageItem>
        ))}
      </LanguageList>
    </Panel>
  );
};
