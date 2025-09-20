import { Panel, Text } from '@/components/common/StyledComponents';
import { LanguageStats } from '@/hooks/useLanguageStats';
import React from 'react';
import {
  Badge,
  ExampleCard,
  ExampleHeader,
  ExampleList,
  ExampleTrack,
  ExamplesGrid,
  SectionTitle,
} from './Styles';

interface ExampleTracksPanelProps {
  stats: LanguageStats;
}

export const ExampleTracksPanel: React.FC<ExampleTracksPanelProps> = ({ stats }) => {
  return (
    <Panel style={{ gridColumn: 'span 2' }}>
      <SectionTitle>Example Tracks by Language</SectionTitle>
      <ExamplesGrid>
        {stats.languages.map((lang) => (
          <ExampleCard key={lang.language_code}>
            <ExampleHeader>
              <Text variant="primary">{lang.language_code}</Text>
              <Badge>{lang.count} tracks</Badge>
            </ExampleHeader>
            <ExampleList>
              {lang.example_tracks.map((t, i) => (
                <ExampleTrack key={i}>{t}</ExampleTrack>
              ))}
            </ExampleList>
          </ExampleCard>
        ))}
      </ExamplesGrid>
    </Panel>
  );
};
