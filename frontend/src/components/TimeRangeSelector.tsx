import React from 'react';
import styled from '@emotion/styled';

interface TimeRangeSelectorProps {
  period: string;
  onPeriodChange: (period: string) => void;
  periods: { label: string; value: string }[];
}

const PeriodButtonsContainer = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
`;

const PeriodButton = styled.button<{ isActive: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  background-color: ${(props) => (props.isActive ? "#16a34a" : "#e5e7eb")};
  color: ${(props) => (props.isActive ? "white" : "#4b5563")};
  &:hover {
    background-color: ${(props) => (props.isActive ? "#15803d" : "#d1d5db")};
  }
`;

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ period, onPeriodChange, periods }) => {
  return (
    <PeriodButtonsContainer>
      {periods.map((p) => (
        <PeriodButton key={p.value} isActive={period === p.value} onClick={() => onPeriodChange(p.value)}>
          {p.label}
        </PeriodButton>
      ))}
    </PeriodButtonsContainer>
  );
};

export default TimeRangeSelector;