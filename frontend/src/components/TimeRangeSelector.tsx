import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import React from 'react';

interface TimeRangeSelectorProps {
  period: string;
  onPeriodChange: (period: string) => void;
  periods: { label: string; value: string }[];
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  period,
  onPeriodChange,
  periods,
}) => {
  const handleChange = (_: React.MouseEvent<HTMLElement>, newValue: string | null) => {
    if (newValue) {
      onPeriodChange(newValue);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <ToggleButtonGroup
        value={period}
        exclusive
        onChange={handleChange}
        aria-label="time range"
        size="small"
        sx={{
          '& .MuiToggleButton-root': {
            color: 'text.secondary',
            borderColor: 'divider',
            '&.Mui-selected': {
              color: 'primary.contrastText',
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            },
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          },
        }}
      >
        {periods.map((p) => (
          <ToggleButton key={p.value} value={p.value} aria-label={p.label}>
            {p.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default TimeRangeSelector;
