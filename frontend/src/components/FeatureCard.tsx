import { Box, Card, styled, Typography } from '@mui/material';
import { LucideIcon } from 'lucide-react';
import React from 'react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const IconContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <Card
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        p: 3,
        bgcolor: 'transparent',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <IconContainer>
        <Icon size={48} />
      </IconContainer>
      <Typography
        variant="h6"
        component="h3"
        gutterBottom
        sx={{
          fontWeight: 600,
          mb: 1,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          textAlign: 'center',
        }}
      >
        {description}
      </Typography>
    </Card>
  );
};
