import styled from '@emotion/styled';

// Layout Components
export const PageContainer = styled.div`
  padding: 24px;
  flex: 1;
  overflow-y: auto;
`;

export const ContentGrid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns || 2}, 1fr);
  gap: 24px;
`;

export const Panel = styled.div`
  padding: 16px;
  background-color: #121212;
  border-radius: 8px;
`;

// Typography Components
export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 24px;
`;

export const Subtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 16px;
`;

export const Text = styled.p<{ variant?: 'primary' | 'secondary' | 'error' }>`
  font-size: 1rem;
  color: ${(props) => {
    switch (props.variant) {
      case 'primary':
        return '#fff';
      case 'error':
        return '#e57373';
      default:
        return '#b3b3b3';
    }
  }};
  margin: 0;
`;

// Card Components
export const Card = styled.div`
  background-color: #212121;
  border-radius: 8px;
  padding: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  }
`;

// Image Components
export const ResponsiveImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 4px;
  object-fit: cover;
`;

export const PlaceholderImage = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: #404040;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #b3b3b3;
  font-size: 1.5rem;

  &::before {
    content: '♬';
  }
`;

// Grid Components
export const Grid = styled.div<{ minWidth?: string }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${(props) => props.minWidth || '180px'}, 1fr));
  gap: 24px;
  padding: 24px 0;
`;

// Status Messages
export const LoadingMessage = styled(Text)`
  text-align: center;
  font-size: 1.25rem;
  margin-top: 50px;
`;

export const ErrorMessage = styled(LoadingMessage)`
  color: #e57373;
`;

export const EmptyMessage = styled(LoadingMessage)`
  color: #b3b3b3;
`;

// Progress and Stats Components
export const ProgressBarContainer = styled.div`
  background-color: #404040;
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
`;

export const ProgressBar = styled.div<{ progress: number }>`
  height: 100%;
  width: ${(props) => props.progress}%;
  background-color: #1db954;
  border-radius: 5px;
  transition: width 0.5s ease;
`;

// List Components
export const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

export const ListItem = styled.li`
  padding: 12px 0;
  border-bottom: 1px solid #333;

  &:last-child {
    border-bottom: none;
  }
`;

// Link Components
export const StyledLink = styled.a`
  text-decoration: none;
  color: inherit;
  display: block;

  &:hover {
    text-decoration: none;
  }
`;
