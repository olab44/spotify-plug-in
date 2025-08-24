import { FeatureCard } from '@/components/FeatureCard';
import { LoginButton } from '@/components/LoginButton';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Headphones, Languages, Music } from 'lucide-react';
import React from 'react';

export const Index: React.FC = () => {
  return (
    <SpotlightContainer>
      <ContentContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HeaderSection>
            <Pill>Your Music Journey Starts Here</Pill>
            <Title>
              Discover Your<GradientSpan> Musical Universe</GradientSpan>
            </Title>
            <Subtitle>
              Dive deep into your listening habits, discover new music, and learn languages through
              songs. All in one beautiful experience.
            </Subtitle>
            <LoginButton />
          </HeaderSection>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Music}
            title="Smart Analytics"
            description="Get detailed insights about your music taste and listening habits."
          />
          <FeatureCard
            icon={Headphones}
            title="Discover New Music"
            description="Explore new songs and artists based on your preferences."
          />
          <FeatureCard
            icon={Languages}
            title="Learn Languages"
            description="Improve your language skills through music and lyrics."
          />
        </div>
      </ContentContainer>
    </SpotlightContainer>
  );
};

export const SpotlightContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: var(--background);
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(25, 203, 126, 0.1) 0%, transparent 60%);
    background-position: center top;
    background-repeat: no-repeat;
  }
`;

export const ContentContainer = styled.div`
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding: 5rem 1rem;
  position: relative;
  z-index: 10;
`;

export const HeaderSection = styled.div`
  text-align: center;
  max-width: 768px;
  margin-left: auto;
  margin-right: auto;
`;

export const Pill = styled.div`
  display: inline-block;
  margin-bottom: 1rem;
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  border: 1px solid rgba(25, 203, 126, 0.2);
  background-color: rgba(25, 203, 126, 0.1);
  font-size: 0.875rem;
  font-weight: 500;
  color: #19cb7e;
`;

export const Title = styled.h1`
  font-size: 3rem;
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.05em;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    font-size: 4rem;
  }
`;

export const GradientSpan = styled.span`
  background: linear-gradient(to right, #1db954, #19cb7e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const Subtitle = styled.p`
  color: var(--muted-foreground);
  font-size: 1.125rem;
  line-height: 1.625;
  margin-bottom: 2rem;
`;
