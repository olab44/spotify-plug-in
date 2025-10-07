import React from 'react';
import { Chip, OptionsGroup, SectionCard, SectionHeader } from './theme';

interface SelectFiltersProps {
  availableGenres: string[];
  currentSelection: string[];
  onSelect: (newSelection: string[]) => void;
}

export const SelectFilters: React.FC<SelectFiltersProps> = ({
  availableGenres,
  currentSelection,
  onSelect,
}) => {
  const toggleSelection = (genre: string): void => {
    const newSelection = currentSelection.includes(genre)
      ? currentSelection.filter((item) => item !== genre)
      : [...currentSelection, genre];
    onSelect(newSelection);
  };

  return (
    <SectionCard>
      <SectionHeader>3. Filter by Genre/Topic (Personal Taste)</SectionHeader>
      <OptionsGroup>
        {availableGenres.map((genre) => (
          <Chip
            key={genre}
            active={currentSelection.includes(genre)}
            onClick={() => toggleSelection(genre)}
          >
            {genre}
          </Chip>
        ))}
      </OptionsGroup>
    </SectionCard>
  );
};
