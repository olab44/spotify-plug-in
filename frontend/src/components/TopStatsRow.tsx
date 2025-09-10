import { Avatar, Box, Link, Paper, Stack, styled, Typography, useTheme } from '@mui/material';
import React from 'react';

interface SmallImageProps {
  id: string;
  url: string;
  name: string;
  spotifyUrl: string;
}

interface TopStatsRowProps {
  rank: number;
  imageUrl?: string;
  primaryText: string;
  secondaryText?: string;
  tertiaryText?: string;
  isCircularImage?: boolean;
  spotifyUrl?: string;
  smallImages?: SmallImageProps[];
}

const StatsIndex = styled(Box)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '1.75rem',
  minWidth: '3rem',
  textAlign: 'center',
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  padding: '0.5rem 0.25rem',
}));

const StatsImage = styled('img')<{ isCircular: boolean }>(({ theme, isCircular }) => ({
  width: 72,
  height: 72,
  borderRadius: isCircular ? '50%' : theme.shape.borderRadius,
  objectFit: 'cover',
  flexShrink: 0,
  boxShadow: theme.shadows[1],
}));

const SmallImageWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: theme.spacing(1),
  '& > *:not(:first-of-type)': {
    marginLeft: theme.spacing(-0.5),
  },
}));

export const TopStatsRow: React.FC<TopStatsRowProps> = ({
  rank,
  imageUrl,
  primaryText,
  secondaryText,
  tertiaryText,
  isCircularImage = false,
  spotifyUrl,
  smallImages,
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        cursor: 'pointer',
        transition: theme.transitions.create(['transform', 'box-shadow']),
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[4],
        },
        bgcolor: 'background.paper',
        borderRadius: 2,
      }}
    >
      <StatsIndex>{rank}.</StatsIndex>
      {imageUrl && (
        <Link href={spotifyUrl} target="_blank" rel="noopener noreferrer" sx={{ flexShrink: 0 }}>
          <StatsImage
            src={imageUrl}
            alt={primaryText}
            isCircular={isCircularImage}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = 'https://placehold.co/72x72/E0E0E0/333333?text=No+Image';
            }}
          />
        </Link>
      )}
      <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
          {primaryText}
        </Typography>
        {secondaryText && (
          <Typography variant="body2" color="text.secondary">
            {secondaryText}
          </Typography>
        )}
        {tertiaryText && (
          <Typography variant="caption" color="text.disabled">
            {tertiaryText}
          </Typography>
        )}
      </Stack>
      {smallImages && smallImages.length > 0 && (
        <SmallImageWrapper>
          {smallImages.map((img, idx) => (
            <Link
              key={img.id}
              href={img.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={img.name}
            >
              <Avatar
                src={img.url}
                alt={img.name}
                sx={{
                  width: 32,
                  height: 32,
                  border: `2px solid ${theme.palette.background.paper}`,
                  zIndex: smallImages.length - idx,
                }}
              />
            </Link>
          ))}
        </SmallImageWrapper>
      )}
    </Paper>
  );
};
