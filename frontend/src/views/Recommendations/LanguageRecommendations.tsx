import LeftPanel, { LeftPanelProvider } from '@/components/LeftPanel';
import { useGetRecommendations } from '@/hooks/useArtistsRecommendation';
import styled from '@emotion/styled';
import React, { useState } from 'react';
import { SelectContent } from './SelectContent';
import { SelectFilters } from './SelectFilters';
import { SelectLanguage } from './SelectLanguage';
import { COLORS } from './theme';

const availableGenres = [
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
  const [selections, setSelections] = useState({
    contentTypes: [],
    targetLanguages: [],
    genres: [],
  });
  const [submittedData, setSubmittedData] = useState<any | null>(null);

  const handleGenerate = (): void => {
    const language = selections.targetLanguages[0]?.name;
    if (!language) return;
    setSubmittedData({
      target_language: language,
      genres: selections.genres,
      content_types: selections.contentTypes,
    });
  };

  const { recommendations, loading, error } = useGetRecommendations(submittedData);

  const isGenerateDisabled =
    selections.targetLanguages.length === 0 || selections.contentTypes.length === 0;

  // Debug view: check what’s actually rendering
  console.log({ selections, submittedData, recommendations, loading, error });

  return (
    <LeftPanelProvider>
      <LeftPanel />
      <Container>
        <Title>Language Recommendation Engine</Title>
        <Subtitle>
          Select your goals and let AI build your perfect personalized study playlist.
        </Subtitle>

        {/* Ensure subcomponents are visible */}
        <SelectContent
          currentSelection={selections.contentTypes}
          onSelect={(value) => setSelections((p) => ({ ...p, contentTypes: value }))}
        />

        <SelectLanguage
          currentSelection={selections.targetLanguages}
          onSelect={(value) => setSelections((p) => ({ ...p, targetLanguages: value }))}
        />

        <SelectFilters
          availableGenres={availableGenres}
          currentSelection={selections.genres}
          onSelect={(value) => setSelections((p) => ({ ...p, genres: value }))}
        />

        <Divider />

        <GenerateButton onClick={handleGenerate} disabled={isGenerateDisabled}>
          {loading ? 'Loading...' : 'Generate Recommendations'}
        </GenerateButton>

        {error && <ErrorText>{error}</ErrorText>}

        {!loading && recommendations.length > 0 && (
          <ResultsContainer>
            <h3>Recommended Artists:</h3>
            {recommendations.map((a) => (
              <ArtistCard key={a.id}>
                <a href={a.external_urls.spotify} target="_blank" rel="noreferrer">
                  <strong>{a.name}</strong>
                </a>
                <p>{a.genres.join(', ')}</p>
                <p>Popularity: {a.popularity}</p>
              </ArtistCard>
            ))}
          </ResultsContainer>
        )}
      </Container>
    </LeftPanelProvider>
  );
};

// --- styled components (same as before) ---
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

const ErrorText = styled.p`
  color: red;
  margin-top: 15px;
`;

const ResultsContainer = styled.div`
  margin-top: 30px;
`;

const ArtistCard = styled.div`
  background-color: ${COLORS.spotifyGreen};
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;

  a {
    color: ${COLORS.textColor};
    text-decoration: none;
  }

  p {
    margin: 4px 0;
    font-size: 0.9em;
  }
`;
