import styled from '@emotion/styled';
import React, { useState } from 'react';
import { COLORS } from './theme';

import LeftPanel, { LeftPanelProvider } from '@/components/LeftPanel';
import { SelectContent } from './SelectContent';
import { SelectFilters } from './SelectFilters';
import { SelectLanguage } from './SelectLanguage';

interface LanguageSelection {
  name: string;
  level: string;
}

interface SelectionsState {
  contentTypes: string[];
  targetLanguages: LanguageSelection[];
  genres: string[];
}

const availableGenres: string[] = [
  'Comedy',
  'News',
  'Fiction',
  'Rock',
  'Pop',
  'Self-Help',
  'History',
  'Technology',
];

export const LanguageRecommendations: React.FC = () => {
  const [selections, setSelections] = useState<SelectionsState>({
    contentTypes: [],
    targetLanguages: [],
    genres: [],
  });

  const handleGenerate = (): void => {
    console.log('Generating recommendations with filters:', selections);
    alert('Generating recommendations!');
  };

  const updateSelections = (key: keyof SelectionsState, value: any): void => {
    setSelections((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const isGenerateDisabled: boolean =
    selections.targetLanguages.length === 0 || selections.contentTypes.length === 0;

  return (
    <LeftPanelProvider>
      <LeftPanel />
      <Container>
        <Title>Language Recommendation Engine</Title>
        <Subtitle>
          Select your goals and let AI build your perfect personalized study playlist.
        </Subtitle>

        <SelectContent
          currentSelection={selections.contentTypes}
          onSelect={(value) => updateSelections('contentTypes', value)}
        />

        <SelectLanguage
          currentSelection={selections.targetLanguages}
          onSelect={(value) => updateSelections('targetLanguages', value)}
        />

        <SelectFilters
          availableGenres={availableGenres}
          currentSelection={selections.genres}
          onSelect={(value) => updateSelections('genres', value)}
        />

        <Divider />

        <GenerateButton onClick={handleGenerate} disabled={isGenerateDisabled}>
          Generate Recommendations
        </GenerateButton>
      </Container>
    </LeftPanelProvider>
  );
};

const Container = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  background-color: ${COLORS.darkBackground};
  color: ${COLORS.textColor};
  border-radius: 8px;
  font-family: 'Montserrat', sans-serif;
`;

const Title = styled.h1`
  color: ${COLORS.spotifyGreen};
  margin-bottom: 5px;
  font-size: 1.8em;
`;

const Subtitle = styled.p`
  color: ${COLORS.secondaryTextColor};
  margin-bottom: 30px;
  font-size: 0.9em;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: ${COLORS.dividerColor};
  margin: 30px 0;
`;

const GenerateButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: ${COLORS.spotifyGreen};
  color: ${COLORS.darkBackground};
  font-size: 1.2em;
  font-weight: bold;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: ${COLORS.buttonHoverColor};
  }

  &:disabled {
    background-color: ${COLORS.disabledColor};
    cursor: not-allowed;
  }
`;
