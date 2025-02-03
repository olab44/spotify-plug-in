import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  // Sample data for charts
  const listeningData = [
    { month: 'Jan', minutes: 1200 },
    { month: 'Feb', minutes: 1500 },
    { month: 'Mar', minutes: 1100 },
  ];

  const genreData = [
    { month: 'Jan', genre: 'Pop', minutes: 600 },
    { month: 'Feb', genre: 'Rock', minutes: 800 },
    { month: 'Mar', genre: 'Jazz', minutes: 500 },
  ];

  const topSongs = [
    { rank: 1, song: 'Song A', streams: 5000 },
    { rank: 2, song: 'Song B', streams: 4500 },
  ];

  const topArtists = [
    { rank: 1, artist: 'Artist A', minutes: 3000 },
    { rank: 2, artist: 'Artist B', minutes: 2500 },
  ];

  const topGenres = [
    { rank: 1, genre: 'Pop', minutes: 10000 },
    { rank: 2, genre: 'Rock', minutes: 8000 },
  ];

  const languageData = [
    { language: 'English', minutes: 12000 },
    { language: 'Spanish', minutes: 8000 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Listening Statistics</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={listeningData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="minutes" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Music Evolution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={genreData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="minutes" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Discovery of the Year/Month</h2>
        <p>Most listened to new song: <strong>Song X</strong></p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Rankings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Top 100 Songs</h3>
            <ul>
              {topSongs.map(song => (
                <li key={song.rank}>{song.rank}. {song.song} - {song.streams} streams</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Top 100 Artists</h3>
            <ul>
              {topArtists.map(artist => (
                <li key={artist.rank}>{artist.rank}. {artist.artist} - {artist.minutes} minutes</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Top 10 Genres</h3>
            <ul>
              {topGenres.map(genre => (
                <li key={genre.rank}>{genre.rank}. {genre.genre} - {genre.minutes} minutes</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Most Listened Playlists</h3>
            <ul>
              {/* Add playlist data here */}
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Language Analysis</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={languageData}>
            <XAxis dataKey="language" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="minutes" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default Dashboard;