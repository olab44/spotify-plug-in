import LeftPanel, { LeftPanelProvider } from '@/components/LeftPanel';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { LogoutButton } from '@/components/LogoutButton';
import { useUserInfo } from '@/hooks/useUserInfo';
import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface User {
  display_name: string;
  email: string;
}

const DashboardContent: React.FC<{ user: User | null }> = ({ user }) => {
  return (
    <StyledDashboardContainer>
      {user ? (
        <>
          <DashboardTitle>Welcome, {user.display_name}!</DashboardTitle>
          <p className="text-gray-700 mb-6">Email: {user.email}</p>
          <DashboardGrid>
            <StyledLink to="/top-tracks">
              <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}></span>
              <span>Top Tracks</span>
            </StyledLink>
            <StyledLink to="/top-artists">
              <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}></span>
              <span>Top Artists</span>
            </StyledLink>
            <StyledLink to="/top-genres">
              <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}></span>
              <span>Top Genres</span>
            </StyledLink>
          </DashboardGrid>
          <LogoutButton />
        </>
      ) : (
        <LoadingIndicator />
      )}
    </StyledDashboardContainer>
  );
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useUserInfo();

  useEffect(() => {
    if (!user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <LeftPanelProvider>
      <LeftPanel />
      <DashboardContent user={user} />
    </LeftPanelProvider>
  );
};

const StyledDashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  padding-left: 5rem;
  transition: all 0.3s ease-in-out;

  @media (max-width: 768px) {
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

const DashboardTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1a202c;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  margin: 2rem 0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const baseButtonStyles = `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  padding: 3rem 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  text-align: center;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const StyledLink = styled(Link)`
  ${baseButtonStyles};
  background-color: #555555;
  &:hover {
    background-color: #777777;
  }
`;
