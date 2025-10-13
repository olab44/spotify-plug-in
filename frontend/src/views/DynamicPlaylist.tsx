import { useState } from 'react';
import { useDynamicPlaylistApi } from '../hooks/api/api';
import { useGetDynamicPlaylist } from '../hooks/useGetDynamicPlaylist';

const LoadingSpinner = () => (
  <div style={styles.centered as React.CSSProperties}>Loading playlist...</div>
);

const ErrorDisplay = ({ error, onRetry }) => (
  <div style={styles.centered as React.CSSProperties}>
    <p>Error: {error}</p>
    <button onClick={onRetry} style={styles.button}>
      Try Again
    </button>
  </div>
);

const AddTrackForm = ({ onAddTrack, isAdding }) => {
  const [newTrackUri, setNewTrackUri] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTrackUri.trim()) {
      onAddTrack(newTrackUri.trim());
      setNewTrackUri('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        value={newTrackUri}
        onChange={(e) => setNewTrackUri(e.target.value)}
        placeholder="spotify:track:..."
        style={styles.input}
        disabled={isAdding}
      />
      <button type="submit" style={styles.button} disabled={isAdding}>
        {isAdding ? 'Adding...' : 'Add Track'}
      </button>
    </form>
  );
};

export const DynamicPlaylist = () => {
  const { playlist, loading, error, refetch } = useGetDynamicPlaylist();

  const [isAdding, setIsAdding] = useState(false);
  const dynamicPlaylistApi = useDynamicPlaylistApi();

  const addTrack = async (trackUri) => {
    setIsAdding(true);
    try {
      await dynamicPlaylistApi.post('/heavy-rotation/add', {
        track_uri: trackUri,
      });
      refetch();
    } catch (err) {
      alert('Failed to add track. Please check the URI and try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const isBusy = loading || isAdding;

  if (loading && !playlist) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={refetch} />;
  }

  if (!playlist) {
    return <div style={styles.centered as React.CSSProperties}>No playlist data available.</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2>{playlist.name}</h2>
          <p style={styles.description}>{playlist.description}</p>
        </div>
        <button onClick={refetch} disabled={isBusy} style={styles.button}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <AddTrackForm onAddTrack={addTrack} isAdding={isAdding} />

      <ul style={styles.trackList}>
        {playlist.tracks.map((track, index) => (
          <li key={track.uri} style={styles.trackItem}>
            <span style={styles.trackNumber}>{index + 1}</span>
            <div>
              <div style={styles.trackName}>{track.name}</div>
              <div style={styles.artistName}>{track.artist}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'sans-serif',
    width: '100%',
    maxWidth: '500px',
    margin: 'auto',
    background: '#191414',
    color: '#fff',
    borderRadius: '8px',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  description: { color: '#b3b3b3', fontSize: '0.9em', marginTop: '-10px' },
  button: {
    background: '#1DB954',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  form: { display: 'flex', gap: '10px', marginBottom: '20px' },
  input: {
    flexGrow: 1,
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #535353',
    background: '#282828',
    color: '#fff',
  },
  trackList: { listStyle: 'none', padding: 0 },
  trackItem: { display: 'flex', alignItems: 'center', marginBottom: '15px' },
  trackNumber: { fontSize: '1.2em', color: '#b3b3b3', width: '30px' },
  trackName: { fontWeight: 'bold' },
  artistName: { color: '#b3b3b3', fontSize: '0.9em' },
  centered: { textAlign: 'center', padding: '40px' },
};
