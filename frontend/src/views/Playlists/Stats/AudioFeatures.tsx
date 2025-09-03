import React from 'react';
import { BoldText, InfoText, Section, SectionTitle } from '../StyledComponents';

interface AudioFeaturesStatsProps {
  audioFeatures: {
    avgValence: number;
    avgEnergy: number;
    avgDanceability: number;
    avgTempo: number;
    acousticness: number;
    instrumentalness: number;
    modeDistribution: { [mode: string]: number };
  };
}

export const AudioFeaturesStats: React.FC<AudioFeaturesStatsProps> = ({ audioFeatures }) => {
  return (
    <Section>
      <SectionTitle>Mood & Danceability</SectionTitle>
      <InfoText>
        <BoldText>Energy:</BoldText> {(audioFeatures.avgEnergy * 100).toFixed(0)}%
      </InfoText>
      <InfoText>
        <BoldText>Valence (Happiness):</BoldText> {(audioFeatures.avgValence * 100).toFixed(0)}%
      </InfoText>
      <InfoText>
        <BoldText>Danceability:</BoldText> {(audioFeatures.avgDanceability * 100).toFixed(0)}%
      </InfoText>
      <InfoText>
        <BoldText>Average Tempo:</BoldText> {audioFeatures.avgTempo.toFixed(0)} BPM
      </InfoText>
      <InfoText>
        <BoldText>Acoustic vs. Electronic:</BoldText>{' '}
        {audioFeatures.acousticness > audioFeatures.instrumentalness
          ? 'More Acoustic'
          : 'More Electronic'}
      </InfoText>
      {audioFeatures.modeDistribution && Object.keys(audioFeatures.modeDistribution).length > 0 && (
        <InfoText>
          <BoldText>Mode:</BoldText>
          {Object.entries(audioFeatures.modeDistribution)
            .sort(([, a], [, b]) => b - a)
            .map(([mode, count], index, arr) => (
              <React.Fragment key={mode}>
                {' '}
                {mode.charAt(0).toUpperCase() + mode.slice(1)} ({count})
                {index < arr.length - 1 ? ', ' : ''}
              </React.Fragment>
            ))}
        </InfoText>
      )}
    </Section>
  );
};
