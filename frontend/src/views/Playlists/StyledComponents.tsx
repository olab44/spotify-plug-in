import { Title as PageTitle } from '@/components/StyledComponents';
import styled from '@emotion/styled';

export const Title = styled(PageTitle)`
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 16px;
`;

export const Section = styled.div`
  background-color: #212121;
  padding: 24px;
  border-radius: 8px;
`;

export const InfoText = styled.p`
  color: #b3b3b3;
  margin: 8px 0;
  font-size: 0.9rem;
`;

export const BoldText = styled.span`
  font-weight: bold;
  color: #fff;
`;

export const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #333;
  &:last-of-type {
    border-bottom: none;
  }
`;

export const StatLabel = styled.p`
  color: #b3b3b3;
  font-size: 0.9rem;
  margin: 0 0 8px;
`;

export const StatValueSmall = styled.p`
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
`;

export const DuplicatesList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  text-align: right;
  color: #fff;
  font-size: 0.9rem;
`;

export const ProgressBarContainer = styled.div`
  flex-grow: 1;
  background-color: #404040;
  height: 10px;
  border-radius: 5px;
  margin: 0 16px;
  overflow: hidden;
`;

export const ProgressBar = styled.div<{ width: number }>`
  height: 100%;
  width: ${(props) => props.width}%;
  background-color: #1db954;
  border-radius: 5px;
  transition: width 0.5s ease;
`;

export const TopGenresList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 16px 0;
`;

export const GenreName = styled.span`
  color: #fff;
  font-weight: bold;
`;

export const YAxis = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding-right: 8px;
  border-right: 1px solid #333;
`;

export const YAxisLabel = styled.span`
  color: #b3b3b3;
  font-size: 0.75rem;
  text-align: right;
`;

export const XAxis = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  padding: 0 16px;
`;

export const XAxisLabel = styled.span`
  color: #b3b3b3;
  font-size: 0.75rem;
  text-align: center;
  flex-grow: 1;
`;

export const Histogram = styled.div`
  display: flex;
  flex-grow: 1;
  height: 100%;
  align-items: flex-end;
  gap: 4px;
`;

export const HistogramBar = styled.div<{ height: number }>`
  flex-grow: 1;
  background-color: #1db954;
  height: ${(props) => Math.max(0, props.height)}%;
  position: relative;
  display: flex;
  justify-content: center;
  border-radius: 4px;
`;

export const BarLabel = styled.span`
  position: absolute;
  top: -20px;
  color: #fff;
  font-size: 0.75rem;
  font-weight: bold;
`;

export const HistogramContainer = styled.div`
  display: flex;
  height: 150px;
  gap: 8px;
  align-items: flex-end;
  padding: 0 16px;
  position: relative;
`;

export const SectionTitle = styled(Title)`
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 16px;
`;
