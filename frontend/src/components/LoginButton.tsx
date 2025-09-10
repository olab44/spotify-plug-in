import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { Box, Button } from '@mui/material';
import React from 'react';

export const LoginButton: React.FC = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:8000/spotify/login';
  };

  return (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogin}
        size="large"
        startIcon={<MusicNoteIcon />}
        sx={{
          fontSize: '1.125rem',
          py: 1.5,
          px: 4,
        }}
      >
        Login with Spotify
      </Button>
    </Box>
  );
};
