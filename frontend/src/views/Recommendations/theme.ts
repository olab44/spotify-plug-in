import styled from '@emotion/styled';

export const COLORS = {
  spotifyGreen: '#1DB954',
  darkBackground: '#121212',
  cardBackground: '#1a1a1a',
  textColor: '#ffffff',
  secondaryTextColor: '#b3b3b3',
  dividerColor: '#282828',
  buttonHoverColor: '#1ed760',
  disabledColor: '#535353',
  chipDefault: '#333333',
};

interface ChipProps {
  active: boolean;
}

export const SectionCard = styled.div`
  background-color: ${COLORS.cardBackground};
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 6px;
`;

export const SectionHeader = styled.h3`
  color: ${COLORS.textColor};
  border-bottom: 1px solid ${COLORS.dividerColor};
  padding-bottom: 10px;
  margin-bottom: 15px;
  font-size: 1.2em;
`;

export const OptionsGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const Chip = styled.button<ChipProps>`
  background-color: ${(props) => (props.active ? COLORS.spotifyGreen : COLORS.chipDefault)};
  color: ${(props) => (props.active ? COLORS.darkBackground : COLORS.textColor)};
  border: 1px solid ${(props) => (props.active ? COLORS.spotifyGreen : COLORS.chipDefault)};
  padding: 8px 15px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: bold;

  &:hover {
    background-color: ${(props) => (props.active ? COLORS.buttonHoverColor : '#454545')};
    border-color: ${(props) => (props.active ? COLORS.buttonHoverColor : '#454545')};
  }
`;
