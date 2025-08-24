import LoadingIndicator from '@/components/LoadingIndicator';
import LogoutButton from '@/components/LogoutButton';
import { useGetTopGenres } from '@/hooks/useGetTopGenres';
import React, { useState } from 'react';

const TopGenresPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('medium-term');

  const { genres, artists, loading } = useGetTopGenres(selectedPeriod);

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  if (loading) {
    return <LoadingIndicator />;
  }

  const getArtistsForGenre = (genre: string) => {
    const uniqueArtists = Array.from(
      new Set(artists.filter((artist) => artist.genres.includes(genre))),
    );
    return uniqueArtists.slice(0, 4);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Top Genres </h1>

      <div className="flex justify-center space-x-4 mb-8">
        {['short-term', 'medium-term', 'long-term'].map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`py-2 px-4 rounded-lg font-semibold transition-colors duration-200
              ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
          >
            {capitalize(period.replace('-', ' '))}
          </button>
        ))}
      </div>

      {genres.length > 0 ? (
        <div className="space-y-4">
          {' '}
          {genres.map((genreItem, index) => {
            const genreArtists = getArtistsForGenre(genreItem.genre);
            return (
              <div
                key={genreItem.genre}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-2 sm:mb-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-gray-800 w-8 text-center">
                      {index + 1}.
                    </span>
                    <span className="text-xl font-medium text-gray-800">
                      {capitalize(genreItem.genre)}
                    </span>
                  </div>
                  <span className="text-lg text-gray-600 ml-10 sm:ml-0">
                    ({genreItem.count} artists)
                  </span>
                </div>

                {genreArtists.length > 0 && (
                  <div className="flex justify-center sm:justify-end items-center -space-x-2">
                    {genreArtists.map((artist, artistIndex) => (
                      <a
                        key={artist.id}
                        href={artist.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={artist.name}
                      >
                        <img
                          src={artist.images[0]?.url || 'path/to/placeholder-image.png'}
                          alt={artist.name}
                          className="w-10 h-10 rounded-full border-2 border-white object-cover"
                          style={{ zIndex: genreArtists.length - artistIndex }}
                        />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-lg text-gray-600 mt-10">
          No top genres found for this period. Listen to more music!
        </p>
      )}

      <div className="mt-10 flex justify-center">
        <LogoutButton />
      </div>
    </div>
  );
};

export default TopGenresPage;
