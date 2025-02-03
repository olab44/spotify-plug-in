import React from 'react';

const LoginButton: React.FC = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:8000/spotify/login';
  };

  return (
    <button onClick={handleLogin} className="bg-spotify-green hover:bg-spotify-green/90 text-white rounded-full px-8 py-2">
      Login with Spotify
    </button>
  );
};

export default LoginButton;