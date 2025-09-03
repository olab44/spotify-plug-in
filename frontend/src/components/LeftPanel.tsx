import { MenuIcon } from '@/components/layout/Header';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

type LeftPanelContextType = {
  open: boolean;
  setOpen: (o: boolean) => void;
};

const LeftPanelContext = createContext<LeftPanelContextType | undefined>(undefined);

export const useLeftPanel = () => {
  const context = useContext(LeftPanelContext);
  if (!context) throw new Error('useLeftPanel must be used within LeftPanelProvider');
  return context;
};

export const LeftPanelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <LeftPanelContext.Provider value={{ open, setOpen }}>{children}</LeftPanelContext.Provider>
  );
};

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Top Tracks', path: '/top-tracks' },
  { label: 'Top Genres', path: '/top-genres' },
  { label: 'Top Artists', path: '/top-artists' },
  { label: 'Playlists', path: '/playlists' },
  { label: 'Language Stats', path: '/language-stats' },
  { label: 'Recommendations', path: '/recommendations' },
];

const NavLinkItem: React.FC<{ label: string; path: string; onClick: () => void }> = ({
  label,
  path,
  onClick,
}) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      onClick={onClick}
      className={`block px-6 py-3 rounded-lg mb-2 text-lg font-semibold transition-colors duration-200 ${
        isActive ? 'bg-green-600' : 'hover:bg-gray-800'
      }`}
    >
      {label}
    </Link>
  );
};

const LeftPanel: React.FC = () => {
  const { open, setOpen } = useLeftPanel();

  const closePanel = () => setOpen(false);

  return (
    <>
      {!open && <MenuIcon onClick={() => setOpen(true)} />}
      <aside
        className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 ${
          open ? 'w-64' : 'w-0'
        } bg-gray-900 text-white shadow-lg overflow-hidden`}
        style={{ pointerEvents: open ? 'auto' : 'none' }}
      >
        {open && (
          <>
            <button
              className="absolute top-4 right-4 bg-gray-700 rounded-full p-2 hover:bg-gray-600"
              onClick={closePanel}
              aria-label="Hide panel"
            >
              ×
            </button>
            <nav className="mt-16">
              {NAV_ITEMS.map((item) => (
                <NavLinkItem key={item.path} {...item} onClick={closePanel} />
              ))}
            </nav>
          </>
        )}
      </aside>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-30 cursor-pointer"
          onClick={closePanel}
        />
      )}
    </>
  );
};

export default LeftPanel;
