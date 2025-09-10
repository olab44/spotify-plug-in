import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Container, IconButton, Toolbar, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface MenuButtonProps {
  onClick: () => void;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    aria-label="Open menu"
    sx={{
      position: 'fixed',
      top: 16,
      left: 16,
      zIndex: (theme) => theme.zIndex.appBar + 1,
      backgroundColor: 'primary.main',
      color: 'primary.contrastText',
      '&:hover': {
        backgroundColor: 'primary.dark',
      },
      boxShadow: 4,
    }}
  >
    <MenuIcon />
  </IconButton>
);

export const Header = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        backdropFilter: 'blur(10px)',
        background: (theme) => `${theme.palette.background.default}CC`,
      }}
      elevation={0}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 64 }}>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="h6"
              component="h1"
              onClick={() => navigate('/')}
              sx={{
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '-0.025em',
                '&:hover': {
                  opacity: 0.8,
                },
                transition: 'opacity 0.2s',
              }}
            >
              Soundscape
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }} />
        </Toolbar>
      </Container>
    </AppBar>
  );
};
