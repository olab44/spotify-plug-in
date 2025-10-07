import { LanguageStats } from '@/views/Languages/LanguageStats';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { theme } from './theme';
import { Callback } from './views/Callback';
import { Dashboard } from './views/Dashboard';
import { Index } from './views/Index';
import { NotFound } from './views/NotFound';
import { PlaylistDetails } from './views/Playlists/PlaylistDetails';
import { Playlists } from './views/Playlists/Playlists';
import { LanguageRecommendations } from './views/Recommendations/LanguageRecommendations';
import { TopArtists } from './views/TopStats/TopArtists';
import { TopGenres } from './views/TopStats/TopGenres';
import { TopTracks } from './views/TopStats/TopTracks';

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlists/:playlistId" element={<PlaylistDetails />} />
          <Route path="/language-stats" element={<LanguageStats />} />
          <Route path="/top-tracks" element={<TopTracks />} />
          <Route path="/top-artists" element={<TopArtists />} />
          <Route path="/top-genres" element={<TopGenres />} />
          <Route path="/recommendations" element={<LanguageRecommendations />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
