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
      <MessageContainer
        style={{ backgroundColor: '#fee2e2', color: '#ef4444', borderColor: '#fca5a5' }}
      >
        Error: {error}
      </MessageContainer>
    );
  }

  if (items.length === 0) {
    return <MessageContainer>{noDataMessage}</MessageContainer>;
  }

  return (
    <StatsList>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>{renderRow(item, idx)}</React.Fragment>
      ))}
    </StatsList>
  );
};

export const MessageContainer = styled.div`
  padding: 1.5rem;
  background-color: #e0f2fe;
  color: #3b82f6;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: 500;
  margin-top: 1.5rem;
  border: 1px solid #93c5fd;
`;

export const StatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;
