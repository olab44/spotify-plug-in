import LoadingIndicator from '@/components/LoadingIndicator';
import LogoutButton from '@/components/LogoutButton';
import { useGetTopGenres } from '@/hooks/useGetTopGenres';
import React, { useState } from "react";

const TopGenresPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("medium-term");

  const { genres, loading } = useGetTopGenres(selectedPeriod);

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Top Genres</h1>

      <div className="flex justify-center space-x-4 mb-8">
        {["short-term", "medium-term", "long-term"].map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`py-2 px-4 rounded-lg font-semibold transition-colors duration-200
              ${selectedPeriod === period
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
          >
            {capitalize(period.replace('-', ' '))}
          </button>
        ))}
      </div>

      {genres.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {genres.map((genreItem, index) => (
            <div
              key={genreItem.genre}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-between"
            >
              <span className="text-xl font-medium text-gray-800">
                {index + 1}. {capitalize(genreItem.genre)}
              </span>
              <span className="text-lg text-gray-600">
                ({genreItem.count} artists)
              </span>
            </div>
          ))}
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