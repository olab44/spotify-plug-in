import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Callback } from './views/Callback';
import { Dashboard } from './views/Dashboard';
import { Index } from './views/Index';
import LanguageRecommendation from './views/LanguageRecommendation';
import { NotFound } from './views/NotFound';
import { PlaylistDetails } from './views/PlaylistDetails';
import { Playlists } from './views/Playlists';
import { TopArtists } from './views/TopArtists';
import { TopGenres } from './views/TopGenres';
import { TopTracks } from './views/TopTracks';

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/playlists/:playlistId" element={<PlaylistDetails />} />
        <Route path="/language-recommendation" element={<LanguageRecommendation />} />
        <Route path="/top-tracks" element={<TopTracks />} />
        <Route path="/top-artists" element={<TopArtists />} />
        <Route path="/top-genres" element={<TopGenres />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
