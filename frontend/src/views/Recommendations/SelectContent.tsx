import React from 'react';
import { Chip, OptionsGroup, SectionCard, SectionHeader } from './theme';

interface SelectContentProps {
  currentSelection: string[];
  onSelect: (newSelection: string[]) => void;
}

const contentOptions: string[] = ['Songs', 'Artists', 'Podcasts', 'Audiobooks'];

export const SelectContent: React.FC<SelectContentProps> = ({ currentSelection, onSelect }) => {
  const toggleSelection = (type: string): void => {
    const newSelection = currentSelection.includes(type)
      ? currentSelection.filter((item) => item !== type)
      : [...currentSelection, type];
    onSelect(newSelection);
  };

  return (
    <SectionCard>
      <SectionHeader>1. Select Content Type</SectionHeader>
      <OptionsGroup>
        {contentOptions.map((type) => (
          <Chip
            key={type}
            active={currentSelection.includes(type)}
            onClick={() => toggleSelection(type)}
          >
            {type}
          </Chip>
        ))}
      </OptionsGroup>
    </SectionCard>
  );
};
