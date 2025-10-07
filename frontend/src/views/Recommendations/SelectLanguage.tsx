import styled from '@emotion/styled';
import React, { useState } from 'react';
import { COLORS, OptionsGroup, SectionCard, SectionHeader } from './theme';

interface LanguageSelection {
  name: string;
  level: string;
}

interface SelectLanguageProps {
  currentSelection: LanguageSelection[];
  onSelect: (newSelection: LanguageSelection[]) => void;
}

const allPossibleLanguages: string[] = [
  'Spanish',
  'German',
  'Korean',
  'French',
  'Japanese',
  'Italian',
  'Mandarin',
  'Arabic',
  'Russian',
  'Portuguese',
  'Hindi',
  'Swahili',
  'Swedish',
  'Dutch',
  'Polish',
  'Turkish',
  'Vietnamese',
  'Greek',
];

const proficiencyLevels: string[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const SelectLanguage: React.FC<SelectLanguageProps> = ({ currentSelection, onSelect }) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>(proficiencyLevels[0]);

  const languagesAvailableForAdding: string[] = allPossibleLanguages.filter(
    (lang) => !currentSelection.some((l) => l.name === lang),
  );

  const filteredSuggestions: string[] = languagesAvailableForAdding.filter((lang) =>
    lang.toLowerCase().includes(searchInput.toLowerCase()),
  );

  const isLanguageValid: boolean = languagesAvailableForAdding.some((lang) => lang === searchInput);

  const handleSuggestionClick = (language: string): void => {
    setSearchInput(language);
  };

  const addLanguage = (): void => {
    if (searchInput && isLanguageValid) {
      const newLanguage: LanguageSelection = { name: searchInput, level: selectedLevel };
      onSelect([...currentSelection, newLanguage]);
      setSearchInput('');
    }
  };

  const removeLanguage = (name: string): void => {
    onSelect(currentSelection.filter((lang) => lang.name !== name));
  };

  return (
    <SectionCard>
      <SectionHeader>2. Select Language & Level</SectionHeader>

      <LanguageInputGroup>
        <InputWrapper>
          <Input
            type="text"
            placeholder="Search or type a language..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          {searchInput.length > 0 && filteredSuggestions.length > 0 && (
            <SuggestionsList>
              {filteredSuggestions.slice(0, 5).map((lang) => (
                <SuggestionItem key={lang} onClick={() => handleSuggestionClick(lang)}>
                  {lang}
                </SuggestionItem>
              ))}
            </SuggestionsList>
          )}
        </InputWrapper>

        <Select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
          {proficiencyLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </Select>

        <AddButton onClick={addLanguage} disabled={!isLanguageValid}>
          Add
        </AddButton>
      </LanguageInputGroup>

      <SelectedLanguagesGroup>
        {currentSelection.map((lang) => (
          <LanguageTag key={lang.name}>
            {lang.name} ({lang.level})
            <RemoveButton onClick={() => removeLanguage(lang.name)}>&times;</RemoveButton>
          </LanguageTag>
        ))}
      </SelectedLanguagesGroup>
    </SectionCard>
  );
};

const LanguageInputGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  position: relative;
`;

const InputWrapper = styled.div`
  flex-grow: 1;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid ${COLORS.disabledColor};
  background-color: ${COLORS.chipDefault};
  color: ${COLORS.textColor};
  box-sizing: border-box;
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid ${COLORS.disabledColor};
  background-color: ${COLORS.chipDefault};
  color: ${COLORS.textColor};
  appearance: none;
  cursor: pointer;
  min-width: 80px;
`;

const AddButton = styled.button`
  padding: 8px 15px;
  border-radius: 4px;
  border: none;
  background-color: ${COLORS.disabledColor};
  color: ${COLORS.textColor};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #6a6a6a;
  }
`;

const SelectedLanguagesGroup = styled(OptionsGroup)`
  margin-top: 10px;
`;

const LanguageTag = styled.span`
  background-color: ${COLORS.dividerColor};
  color: ${COLORS.textColor};
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.9em;
  display: flex;
  align-items: center;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${COLORS.textColor};
  margin-left: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1em;
  padding: 0 4px;
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  list-style: none;
  margin: 0;
  padding: 0;
  background-color: ${COLORS.cardBackground};
  border-radius: 4px;
  border: 1px solid ${COLORS.dividerColor};
  max-height: 200px;
  overflow-y: auto;
  margin-top: 2px;
`;

const SuggestionItem = styled.li`
  padding: 8px 12px;
  cursor: pointer;
  color: ${COLORS.textColor};

  &:hover {
    background-color: ${COLORS.chipDefault};
    color: ${COLORS.spotifyGreen};
  }
`;
