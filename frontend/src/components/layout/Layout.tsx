import { Box, Container } from '@mui/material';
import React from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Header />
      <Container
        component="main"
        sx={{
          pt: 12,
          pb: 8,
        }}
      >
        {children}
      </Container>
    </Box>
  );
};
