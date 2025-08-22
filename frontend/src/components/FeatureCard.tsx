// src/components/FeatureCard.tsx
import React from 'react';
import styled from '@emotion/styled';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const IconWrapper = styled.div`
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: var(--muted-foreground);
  text-align: center;
`;

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <CardContainer>
      <IconWrapper>
        <Icon size={48} />
      </IconWrapper>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </CardContainer>
  );
};

export default FeatureCard;