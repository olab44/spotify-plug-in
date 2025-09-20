import { Box, CircularProgress } from '@mui/material';
import React from 'react';

export const LoadingIndicator: React.FC = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ my: 4 }}>
      <CircularProgress color="primary" size={40} />
    </Box>
  );
};
