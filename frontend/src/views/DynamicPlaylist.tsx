import LeftPanel, { LeftPanelProvider } from '@/components/LeftPanel';
import {
  ErrorMessage,
  LoadingMessage,
  PageContainer,
  Panel,
  Text,
  Title,
} from '@/components/common/StyledComponents';
import { useDynamicPlaylistApi } from '@/hooks/api/api';
import styled from '@emotion/styled';
import React, { useState } from 'react';
import { useGetDynamicPlaylist } from '../hooks/useGetDynamicPlaylist';

export const DynamicPlaylist: React.FC = () => {
  const { playlist, loading, error, refetch } = useGetDynamicPlaylist();
  const playlistsApi = useDynamicPlaylistApi();

  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newTrackUri, setNewTrackUri] = useState('');

  const isBusy = loading || isAdding || !!isRemoving || isSaving || isRefreshing;

  type TrackShape = {
    uri?: string;
    id?: string;
    name?: string;
    artist?: string;
    artists?: { name: string }[];
    track?: { uri?: string; id?: string; artists?: { name: string }[] };
  };

  const getTrackKey = (t: TrackShape) => t.uri || t.id || t.track?.uri || t.track?.id || '';
  const getTrackArtist = (t: TrackShape) =>
    t.artists?.[0]?.name || t.artist || t.track?.artists?.[0]?.name || 'Unknown';

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await playlistsApi.post('/heavy-rotation/save', {});
      await refetch();
    } catch (e) {
      console.error('Failed to save playlist', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await playlistsApi.get('/heavy-rotation/refresh');
      await refetch();
    } catch (e) {
      console.error('Failed to refresh playlist', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading && !playlist) {
    return (
      <LeftPanelProvider>
        <LeftPanel />
        <PageContainer>
          <LoadingMessage>Loading playlist...</LoadingMessage>
        </PageContainer>
      </LeftPanelProvider>
    );
  }

  if (error) {
    return (
      <LeftPanelProvider>
        <LeftPanel />
        <PageContainer>
          <ErrorMessage>{error}</ErrorMessage>
          <button onClick={refetch}>Try Again</button>
        </PageContainer>
      </LeftPanelProvider>
    );
  }

  if (!playlist) {
    return (
      <LeftPanelProvider>
        <LeftPanel />
        <PageContainer>
          <Text>No playlist data available.</Text>
        </PageContainer>
      </LeftPanelProvider>
    );
  }

  return (
    <LeftPanelProvider>
      <LeftPanel />
      <Container>
        <MainContent>
          <Header>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Thumbnail src="/placeholder.svg" alt="trending" />
              <div>
                <Title>{playlist.name}</Title>
                <Text style={{ color: '#b3b3b3' }}>{playlist.description}</Text>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                placeholder="spotify:track:... or track uri"
                value={newTrackUri}
                onChange={(e) => setNewTrackUri(e.target.value)}
                style={{
                  padding: '0.4rem',
                  borderRadius: 6,
                  border: '1px solid #333',
                  background: '#0f0f0f',
                  color: '#fff',
                }}
                disabled={isBusy}
              />
              <RefreshButton
                onClick={async () => {
                  setIsAdding(true);
                  try {
                    await playlistsApi.post('/heavy-rotation/add', { track_uri: newTrackUri });
                    setNewTrackUri('');
                    await refetch();
                  } catch (e) {
                    console.error('Failed to add track', e);
                  } finally {
                    setIsAdding(false);
                  }
                }}
                disabled={isBusy || !newTrackUri}
              >
                Add
              </RefreshButton>
              <RefreshButton onClick={handleSave} disabled={isBusy}>
                {isSaving ? 'Saving...' : 'Save'}
              </RefreshButton>
              <RefreshButton onClick={handleRefresh} disabled={isBusy}>
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </RefreshButton>
            </div>
          </Header>

          <Panel>
            <PanelTitle>Tracks</PanelTitle>
            <TrackList>
              {playlist.tracks.map((track: TrackShape, index: number) => (
                <TrackItem key={getTrackKey(track)}>
                  <TrackNumber>{index + 1}</TrackNumber>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>{track.name}</div>
                    <div style={{ color: '#b3b3b3' }}>{getTrackArtist(track)}</div>
                  </div>
                  <RemoveButton
                    onClick={async () => {
                      setIsRemoving(track.uri);
                      try {
                        await playlistsApi.post('/heavy-rotation/remove', { track_uri: track.uri });
                        await refetch();
                      } catch (e) {
                        console.error('Failed to remove track', e);
                      } finally {
                        setIsRemoving(null);
                      }
                    }}
                    disabled={isBusy}
                  >
                    {isRemoving === track.uri ? 'Removing...' : 'Remove'}
                  </RemoveButton>
                </TrackItem>
              ))}
            </TrackList>
          </Panel>
        </MainContent>
      </Container>
    </LeftPanelProvider>
  );
};

const Container = styled.div`
  display: flex;
  background-color: #121212;
  min-height: 100vh;
  color: #fff;
  font-family: 'Inter', sans-serif;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem 3rem;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const RefreshButton = styled.button`
  background-color: #1db954;
  color: #000;
  font-weight: 600;
  border-radius: 25px;
  padding: 0.6rem 1.5rem;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #1ed760;
  }
`;

const PanelTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #1db954;
`;

const TrackList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TrackItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const TrackNumber = styled.span`
  font-size: 1.2em;
  color: #b3b3b3;
  width: 30px;
  margin-right: 12px;
`;

const Thumbnail = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  background: transparent;
  color: #ff4d4f;
  border: 1px solid rgba(255, 77, 79, 0.15);
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
