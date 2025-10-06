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

const SPOTIFY_DARK_BG = '#121212';
const SPOTIFY_CARD_SURFACE = '#282828';
const SPOTIFY_CARD_HOVER = '#353535';
const SPOTIFY_TEXT_PRIMARY = '#ffffff';
const SPOTIFY_TEXT_SECONDARY = '#b3b3b3';
const SPOTIFY_TEXT_TERTIARY = '#a0a0a0';

const StatsIndex = styled(Box)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '2rem',
  minWidth: '4rem',
  textAlign: 'center',
  color: SPOTIFY_TEXT_PRIMARY,

  padding: '0.5rem 0.25rem',
}));

const StatsImage = styled('img')<{ isCircular: boolean }>(({ theme, isCircular }) => ({
  width: 64,
  height: 64,
  borderRadius: isCircular ? '50%' : '4px',
  objectFit: 'cover',
  flexShrink: 0,
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
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
      elevation={3}
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        cursor: 'pointer',
        transition: theme.transitions.create(['transform', 'box-shadow', 'background-color']),
        bgcolor: SPOTIFY_CARD_SURFACE,
        '&:hover': {
          transform: 'scale(1.005)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.7)',
          bgcolor: SPOTIFY_CARD_HOVER,
        },
        borderRadius: '8px',
      }}
    >
      <StatsIndex>{rank}.</StatsIndex>
      {imageUrl && (
        <Link
          href={spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          sx={{ flexShrink: 0 }}
        >
          <StatsImage
            src={imageUrl}
            alt={primaryText}
            isCircular={isCircularImage}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = 'https://placehold.co/64x64/282828/ffffff?text=X';
            }}
          />
        </Link>
      )}
      <Stack spacing={0} sx={{ flexGrow: 1, minWidth: 0 }}>
        {' '}
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          color={SPOTIFY_TEXT_PRIMARY}
          noWrap
          title={primaryText}
        >
          {primaryText}
        </Typography>
        {secondaryText && (
          <Typography variant="body2" color={SPOTIFY_TEXT_SECONDARY} noWrap title={secondaryText}>
            {secondaryText}
          </Typography>
        )}
        {tertiaryText && (
          <Typography variant="caption" color={SPOTIFY_TEXT_TERTIARY} noWrap title={tertiaryText}>
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
              onClick={(e) => e.stopPropagation()}
            >
              <Avatar
                src={img.url}
                alt={img.name}
                sx={{
                  width: 32,
                  height: 32,
                  border: `2px solid ${SPOTIFY_CARD_SURFACE}`,
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
