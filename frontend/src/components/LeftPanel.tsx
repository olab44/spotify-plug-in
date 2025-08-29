import { MenuIcon } from '@/components/layout/Header';
import React, { createContext, useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Top Tracks', path: '/top-tracks' },
  { label: 'Top Genres', path: '/top-genres' },
  { label: 'Top Artists', path: '/top-artists' },
  { label: 'Playlists', path: '/playlists' },
  { label: 'Language Recommendation', path: '/language-recommendation' },
];

const LeftPanelContext = createContext<{ open: boolean; setOpen: (o: boolean) => void }>({
  open: false,
  setOpen: () => {},
});
export const useLeftPanel = () => useContext(LeftPanelContext);

const LeftPanelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <LeftPanelContext.Provider value={{ open, setOpen }}>{children}</LeftPanelContext.Provider>
  );
};

const LeftPanel: React.FC = () => {
  const { open, setOpen } = useLeftPanel();
  const location = useLocation();

  return (
    <>
      {!open && <MenuIcon onClick={() => setOpen(true)} />}
      <div
        className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 ${
          open ? 'w-64' : 'w-0'
        } bg-gray-900 text-white shadow-lg overflow-hidden`}
        style={{ pointerEvents: open ? 'auto' : 'none' }}
      >
        {open && (
          <>
            <button
              className="absolute top-4 right-4 bg-gray-700 rounded-full p-2 hover:bg-gray-600"
              onClick={() => setOpen(false)}
              aria-label="Hide panel"
            >
              ×
            </button>
            <nav className="mt-16">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-6 py-3 rounded-lg mb-2 text-lg font-semibold transition-colors duration-200 ${
                    location.pathname === item.path ? 'bg-green-600' : 'hover:bg-gray-800'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </>
        )}
      </div>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-30"
          onClick={() => setOpen(false)}
          style={{ cursor: 'pointer' }}
        />
      )}
    </>
  );
};

export { LeftPanelProvider };
export default LeftPanel;
