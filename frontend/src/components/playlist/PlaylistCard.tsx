import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

interface PlaylistCardProps {
  id: string;
  name: string;
  imageUrl?: string;
  trackCount: number;
  onClick?: () => void;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({
  id,
  name,
  imageUrl,
  trackCount,
  onClick,
}) => {
  return (
    <Card
      component={Link}
      to={`/playlists/${id}`}
      onClick={onClick}
      sx={{
        textDecoration: 'none',
        height: '100%',
        bgcolor: 'background.paper',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[4],
        },
      }}
    >
      <CardActionArea>
        {imageUrl ? (
          <CardMedia
            component="img"
            image={imageUrl}
            alt={name}
            sx={{
              aspectRatio: '1/1',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Box
            sx={{
              aspectRatio: '1/1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'action.hover',
            }}
          >
            <MusicNoteIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
          </Box>
        )}
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography
            variant="subtitle1"
            component="h3"
            gutterBottom
            sx={{
              fontWeight: 600,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {trackCount} songs
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
