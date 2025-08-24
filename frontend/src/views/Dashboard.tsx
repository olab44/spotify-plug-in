import { LoadingIndicator } from '@/components/LoadingIndicator';
import { LogoutButton } from '@/components/LogoutButton';
import { useUserInfo } from '@/hooks/useUserInfo';
import React from 'react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, loading } = useUserInfo();

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {user ? (
        <>
          <h1 className="text-3xl font-bold mb-4">Welcome, {user.display_name}!</h1>
          <p className="text-gray-700 mb-6">Email: {user.email}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <Link
              to="/top-tracks"
              className="flex flex-col items-center justify-center bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-12 px-8 rounded-lg shadow-lg text-center transition-all duration-200"
            >
              <span className="text-4xl mb-2"></span>
              <span>Top Tracks</span>
            </Link>
            <Link
              to="/top-artists"
              className="flex flex-col items-center justify-center bg-purple-500 hover:bg-purple-600 text-white text-2xl font-bold py-12 px-8 rounded-lg shadow-lg text-center transition-all duration-200"
            >
              <span className="text-4xl mb-2"></span>
              <span>Top Artists</span>
            </Link>
            <Link
              to="/top-genres"
              className="flex flex-col items-center justify-center bg-blue-500 hover:bg-blue-600 text-white text-2xl font-bold py-12 px-8 rounded-lg shadow-lg text-center transition-all duration-200"
            >
              <span className="text-4xl mb-2"></span>
              <span>Top Genres</span>
            </Link>
          </div>
        </>
      ) : (
        <LoadingIndicator />
      )}
      <LogoutButton />
    </div>
  );
};
