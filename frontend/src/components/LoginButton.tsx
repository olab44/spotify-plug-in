import React from 'react';

export const LoginButton: React.FC = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:8000/spotify/login';
  };

  return (
    <div className="text-center mt-10">
      <button
        onClick={handleLogin}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg"
      >
        🎵 Login with Spotify
      </button>
    </div>
  );
};
