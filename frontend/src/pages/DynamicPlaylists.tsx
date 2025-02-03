import React from 'react';

const DynamicPlaylists: React.FC = () => {
  const discoveryPlaylist = [
    { song: 'New Song A', artist: 'Artist A' },
    { song: 'New Song B', artist: 'Artist B' },
  ];

  const bestSongsPlaylist = [
    { song: 'Top Song A', artist: 'Artist A' },
    { song: 'Top Song B', artist: 'Artist B' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dynamic Playlists</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-2">Discovery Playlist</h3>
          <p>Automatically updated every 12 hours. Contains 15-20 new songs (most listened to recently).</p>
          <ul>
            {discoveryPlaylist.map((song, index) => (
              <li key={index}>{song.song} - {song.artist}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Best Songs Playlist</h3>
          <p>A permanent playlist containing the 100 most listened songs in the user's history. Updated automatically based on Spotify data.</p>
          <ul>
            {bestSongsPlaylist.map((song, index) => (
              <li key={index}>{song.song} - {song.artist}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DynamicPlaylists;