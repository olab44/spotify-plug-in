import styled from '@emotion/styled';

export const PageContainer = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Inter', sans-serif;
  background-color: #f9fafb; /* Light gray background */
  min-height: 100vh;
  color: #1a202c;
`;

export const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1db954;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  @media (max-width: 640px) {
    font-size: 2rem;
  }
`;

export const StatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const StatsCard = styled.div`
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border: 1px solid #e2e8f0;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 20px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -4px rgba(0, 0, 0, 0.08);
  }
`;

export const StatsIndex = styled.div`
  font-weight: 800;
  font-size: 1.75rem;
  min-width: 3rem;
  text-align: center;
  color: #9ca3af;
  background-color: #f1f5f9; /* Off-white for contrast */
  border-radius: 0.5rem;
  padding: 0.5rem 0.25rem;
`;

export const StatsImage = styled.img<{ isCircular: boolean }>`
  width: 72px;
  height: 72px;
  border-radius: ${(props) => (props.isCircular ? '50%' : '0.5rem')};
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const StatsDetails = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const PrimaryText = styled.div`
  font-weight: 700;
  font-size: 1.25rem;
  color: #1f2937;
  margin-bottom: 0.25rem;
  line-height: 1.3;
`;

export const SecondaryText = styled.div`
  color: #6b7280;
  font-size: 0.95rem;
`;

export const TertiaryText = styled.div`
  color: #9ca3af;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

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

export const SmallImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  -space-x: 0.5rem;
  margin-left: 1rem;
`;

export const SmallImage = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 2px solid white;
  object-fit: cover;
  &:not(:first-of-type) {
    margin-left: -0.5rem;
  }
`;
