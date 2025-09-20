import styled from '@emotion/styled';
import { Text } from '../../components/common/StyledComponents';

export const FilterContainer = styled.div`
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Label = styled.label`
  color: #fff;
  font-weight: 600;
`;

export const Select = styled.select`
  background-color: #282828;
  color: #fff;
  border: 1px solid #404040;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  &:focus {
    outline: none;
    border-color: #1db954;
  }
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 24px;
`;

export const StatsOverview = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

export const StatCard = styled.div`
  background-color: #282828;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
`;

export const StatLabel = styled(Text)`
  color: #b3b3b3;
  font-size: 0.9rem;
  margin-bottom: 8px;
`;

export const StatValue = styled(Text)`
  color: #1db954;
  font-size: 1.5rem;
  font-weight: bold;
`;

export const SectionTitle = styled(Text)`
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 16px;
`;

export const LanguageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const LanguageItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const LanguageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const LanguageCode = styled(Text)`
  font-weight: 600;
  color: #fff;
`;

export const ProgressBarContainer = styled.div`
  background-color: #404040;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressBar = styled.div<{ width: number }>`
  width: ${(p) => p.width}%;
  height: 100%;
  background-color: #1db954;
  transition: width 0.3s ease;
`;

export const PercentageText = styled(Text)`
  color: #1db954;
  font-weight: 600;
  text-align: right;
`;

export const ExamplesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
`;

export const ExampleCard = styled.div`
  background-color: #282828;
  border-radius: 8px;
  padding: 16px;
`;

export const ExampleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const Badge = styled.span`
  background-color: #404040;
  color: #b3b3b3;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
`;

export const ExampleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ExampleTrack = styled(Text)`
  color: #b3b3b3;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover {
    color: #fff;
  }
`;
