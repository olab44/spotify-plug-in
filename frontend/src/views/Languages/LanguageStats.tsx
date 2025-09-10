import LeftPanel, { LeftPanelProvider } from '@/components/LeftPanel';
import {
  ErrorMessage,
  LoadingMessage,
  PageContainer,
  Panel,
  Text,
  Title,
} from '@/components/common/StyledComponents';
import { useLanguageStats } from '@/hooks/useLanguageStats';
import styled from '@emotion/styled';
import React from 'react';

export const LanguageStats: React.FC = () => {
  const { stats, isLoading, error } = useLanguageStats();

  if (isLoading) {
    return (
      <LeftPanelProvider>
        <LeftPanel />
        <PageContainer>
          <LoadingMessage>Analyzing your music languages...</LoadingMessage>
        </PageContainer>
      </LeftPanelProvider>
    );
  }

  if (error) {
    return (
      <LeftPanelProvider>
        <LeftPanel />
        <PageContainer>
          <ErrorMessage>{error}</ErrorMessage>
        </PageContainer>
      </LeftPanelProvider>
    );
  }

  return (
    <LeftPanelProvider>
      <LeftPanel />
      <PageContainer>
        <Title>Your Music Languages</Title>
        <ContentGrid>
          {/* Overview Panel */}
          <Panel>
            <StatsOverview>
              <StatCard>
                <StatLabel>Tracks Analyzed</StatLabel>
                <StatValue>{stats?.total_tracks || 0}</StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>Primary Language</StatLabel>
                <StatValue>{stats?.dominant_language?.toUpperCase() || 'N/A'}</StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>Diversity Score</StatLabel>
                <StatValue>
                  {stats ? `${(stats.language_diversity_score * 100).toFixed(0)}%` : 'N/A'}
                </StatValue>
              </StatCard>
            </StatsOverview>
          </Panel>

          {/* Language Distribution Panel */}
          <Panel>
            <SectionTitle>Language Distribution</SectionTitle>
            <LanguageList>
              {stats?.languages.map((lang) => (
                <LanguageItem key={lang.language_code}>
                  <LanguageHeader>
                    <LanguageCode>{lang.language_code.toUpperCase()}</LanguageCode>
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

          {/* Example Tracks Panel */}
          <Panel style={{ gridColumn: 'span 2' }}>
            <SectionTitle>Example Tracks by Language</SectionTitle>
            <ExamplesGrid>
              {stats?.languages.map((lang) => (
                <ExampleCard key={lang.language_code}>
                  <ExampleHeader>
                    <Text variant="primary">{lang.language_code.toUpperCase()}</Text>
                    <Badge>{lang.count} tracks</Badge>
                  </ExampleHeader>
                  <ExampleList>
                    {lang.example_tracks.map((track, index) => (
                      <ExampleTrack key={index}>{track}</ExampleTrack>
                    ))}
                  </ExampleList>
                </ExampleCard>
              ))}
            </ExamplesGrid>
          </Panel>
        </ContentGrid>
      </PageContainer>
    </LeftPanelProvider>
  );
};

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 24px;
`;

const StatsOverview = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

const StatCard = styled.div`
  background-color: #282828;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
`;

const StatLabel = styled(Text)`
  color: #b3b3b3;
  font-size: 0.9rem;
  margin-bottom: 8px;
`;

const StatValue = styled(Text)`
  color: #1db954;
  font-size: 1.5rem;
  font-weight: bold;
`;

const SectionTitle = styled(Text)`
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 16px;
`;

const LanguageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LanguageItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LanguageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LanguageCode = styled(Text)`
  font-weight: 600;
  color: #fff;
`;

const ProgressBarContainer = styled.div`
  background-color: #404040;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBar = styled.div<{ width: number }>`
  width: ${(props) => props.width}%;
  height: 100%;
  background-color: #1db954;
  transition: width 0.3s ease;
`;

const PercentageText = styled(Text)`
  color: #1db954;
  font-weight: 600;
  text-align: right;
`;

const ExamplesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
`;

const ExampleCard = styled.div`
  background-color: #282828;
  border-radius: 8px;
  padding: 16px;
`;

const ExampleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const Badge = styled.span`
  background-color: #404040;
  color: #b3b3b3;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
`;

const ExampleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ExampleTrack = styled(Text)`
  color: #b3b3b3;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    color: #fff;
  }
`;
