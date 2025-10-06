import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Backdrop,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogoutButton } from './LogoutButton';

type LeftPanelContextType = {
  open: boolean;
  setOpen: (o: boolean) => void;
};

const LeftPanelContext = createContext<LeftPanelContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
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
  const theme = useTheme();
  const isActive = location.pathname === path;

  return (
    <ListItem
      component={Link}
      to={path}
      onClick={onClick}
      sx={{
        borderRadius: 1,
        mb: 1,
        mx: 1,
        color: 'text.primary',
        bgcolor: isActive ? 'primary.main' : 'transparent',
        '&:hover': {
          bgcolor: isActive ? 'primary.dark' : 'action.hover',
        },
      }}
    >
      <ListItemText
        primary={
          <Typography variant="subtitle1" component="span" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
        }
      />
    </ListItem>
  );
};

const LeftPanel: React.FC = () => {
  const { open, setOpen } = useLeftPanel();
  const theme = useTheme();

  const closePanel = () => setOpen(false);

  return (
    <>
      {!open && (
        <IconButton
          color="inherit"
          aria-label="open menu"
          onClick={() => setOpen(true)}
          edge="start"
          sx={{ ml: 2 }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        variant="temporary"
        anchor="left"
        open={open}
        onClose={closePanel}
        sx={{
          '& .MuiDrawer-paper': {
            width: 256,
            bgcolor: 'background.paper',
            backgroundImage: 'none',
          },
        }}
      >
        <Box sx={{ position: 'relative', height: '100%' }}>
          <IconButton
            onClick={closePanel}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'text.secondary',
            }}
            aria-label="close menu"
          >
            <CloseIcon />
          </IconButton>
          <List sx={{ mt: 8 }}>
            {NAV_ITEMS.map((item) => (
              <NavLinkItem key={item.path} {...item} onClick={closePanel} />
            ))}

            <ListItemButton sx={{ borderRadius: 1, mb: 1, mx: 1 }}>
              <ListItemText primary={<LogoutButton />} />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
      <Backdrop open={open} onClick={closePanel} sx={{ zIndex: theme.zIndex.drawer - 1 }} />
    </>
  );
};

export default LeftPanel;
