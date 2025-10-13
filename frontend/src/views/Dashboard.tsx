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
          <p className="text-gray-400 mb-8">Email: {user.email}</p>{' '}
          <DashboardGrid>
            <StyledLink to="/top-tracks" $accentColor="#1db954">
              {' '}
              <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}></span>
              <span>Top Tracks</span>
            </StyledLink>
            <StyledLink to="/top-artists" $accentColor="#FF5733">
              {' '}
              <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}></span>
              <span>Top Artists</span>
            </StyledLink>
            <StyledLink to="/top-genres" $accentColor="#33A1FF">
              {' '}
              <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}></span>
              <span>Top Genres</span>
            </StyledLink>
            <StyledLink to="/playlists" $accentColor="#FFC300">
              {' '}
              <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}></span>
              <span>Playlists Stats</span>
            </StyledLink>
            <StyledLink to="/language-stats" $accentColor="#A133FF">
              {' '}
              <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}></span>
              <span>Language Stats</span>
            </StyledLink>
            <StyledLink to="/recommendations" $accentColor="#1db954">
              {' '}
              <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}></span>
              <span>Recommendations</span>
            </StyledLink>
            <StyledLink to="/dynamic-playlist" $accentColor="#FF33A8">
              {' '}
              <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}></span>
              <span>Dynamic Playlist</span>
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
  /* Assuming the parent/root element sets the dark background */

  @media (max-width: 768px) {
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

const DashboardTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #ffffff; /* 💡 Fixed text color for visibility on a dark background */
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  margin: 2rem 0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const baseButtonStyles = `
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 🔄 Align content to the start (left) */
  justify-content: flex-end; /* 🔄 Push content to the bottom */
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  padding: 1.5rem; /* 📐 Smaller, more compact padding */
  height: 120px; /* 📐 Fixed height for uniform cards */
  border-radius: 0.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5); /* 🌑 Deeper shadow for dark theme */
  text-align: left;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02); /* ✨ Slight scale up on hover */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
  }

  span:first-of-type {
    position: absolute; /* 🎨 Position icon/accent element */
    top: 1rem;
    right: 1rem;
    font-size: 3rem !important; /* Larger icon size */
    opacity: 0.8;
  }

  span:last-child {
    font-size: 1.25rem; /* Slightly smaller text for better card fit */
    margin-top: auto; /* Push text to the bottom */
  }
`;

interface StyledLinkProps {
  $accentColor: string;
}

const StyledLink = styled(Link)<StyledLinkProps>`
  ${baseButtonStyles};
  background: linear-gradient(135deg, #282828 0%, #181818 100%); /* 🖤 Dark, gradient background */

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 60px; /* 🎨 Accent color strip */
    height: 60px;
    background-color: ${(props) => props.$accentColor}; /* Use the passed accent color */
    transform: rotate(45deg) translate(25%, -25%);
    transform-origin: top right;
    border-radius: 0 0.5rem 0 0;
    opacity: 0.9;
  }

  &:hover {
    background: linear-gradient(135deg, #303030 0%, #1a1a1a 100%); /* Slightly lighter on hover */
  }
`;
