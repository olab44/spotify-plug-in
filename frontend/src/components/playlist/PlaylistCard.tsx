import styled from '@emotion/styled';
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, PlaceholderImage, ResponsiveImage, Text } from '../common/StyledComponents';

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
    <Link to={`/playlists/${id}`} onClick={onClick} style={{ textDecoration: 'none' }}>
      <Card>
        <CardContent>
          {imageUrl ? <ResponsiveImage src={imageUrl} alt={name} /> : <PlaceholderImage />}
          <PlaylistName>{name}</PlaylistName>
          <Text variant="secondary">{trackCount} songs</Text>
        </CardContent>
      </Card>
    </Link>
  );
};

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: center;
`;

const PlaylistName = styled(Text)`
  font-weight: 600;
  font-size: 1.1rem;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
