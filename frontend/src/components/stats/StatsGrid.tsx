import styled from '@emotion/styled';
import React from 'react';
import { Card, Text } from '../common/StyledComponents';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => {
  return (
    <Card>
      <StatContent>
        {icon && <IconContainer>{icon}</IconContainer>}
        <StatValue>{value}</StatValue>
        <StatLabel>{label}</StatLabel>
      </StatContent>
    </Card>
  );
};

interface StatsGridProps {
  stats: Array<{
    label: string;
    value: string | number;
    icon?: React.ReactNode;
  }>;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <Grid>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </Grid>
  );
};

const StatContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
`;

const IconContainer = styled.div`
  font-size: 1.5rem;
  color: #1db954;
`;

const StatValue = styled(Text)`
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
`;

const StatLabel = styled(Text)`
  font-size: 0.9rem;
  color: #b3b3b3;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
`;
