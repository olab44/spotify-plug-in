import { LoadingIndicator } from '@/components/LoadingIndicator';
import styled from '@emotion/styled';
import React from 'react';

interface TopStatsListProps<T> {
  loading: boolean;
  error?: string | null;
  items: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
  noDataMessage?: string;
}

const SPOTIFY_RED = '#f03737';
const SPOTIFY_YELLOW = '#ffcc00';

export const TopStatsList = <T,>({
  loading,
  error,
  items,
  renderRow,
  noDataMessage = 'No data found for the selected period.',
}: TopStatsListProps<T>) => {
  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <MessageContainer $type="error">
        Error loading data. Please try again. ({error})
      </MessageContainer>
    );
  }

  if (items.length === 0) {
    return <MessageContainer $type="info">{noDataMessage}</MessageContainer>;
  }

  return (
    <StatsList>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>{renderRow(item, idx)}</React.Fragment>
      ))}
    </StatsList>
  );
};

export const MessageContainer = styled.div<{ $type: 'error' | 'info' }>`
  padding: 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: 600;
  margin-top: 1.5rem;

  background-color: ${(props) => (props.$type === 'error' ? '#251b1b' : '#28281a')};
  color: ${(props) => (props.$type === 'error' ? SPOTIFY_RED : SPOTIFY_YELLOW)};
  border: 1px solid ${(props) => (props.$type === 'error' ? SPOTIFY_RED : SPOTIFY_YELLOW)};
`;

export const StatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Reduced gap slightly for a more compact list */
  margin-bottom: 2rem;
`;
