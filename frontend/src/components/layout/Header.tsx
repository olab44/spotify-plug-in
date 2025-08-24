import React from 'react';
import { useNavigate } from 'react-router-dom';

export const MenuIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    className="fixed top-4 left-4 z-50 bg-green-600 text-white rounded-full p-3 shadow-lg hover:bg-green-700 transition-all"
    onClick={onClick}
    aria-label="Open menu"
  >
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  </button>
);

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <h1
            onClick={() => navigate('/')}
            className="text-xl font-semibold tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
          >
            Soundscape
          </h1>
        </div>
        <div className="flex items-center gap-4"></div>
      </div>
    </header>
  );
};
