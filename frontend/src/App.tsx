import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Callback } from './views/Callback';
import { Dashboard } from './views/Dashboard';
import DynamicPlaylists from './views/DynamicPlaylists';
import { Index } from './views/Index';
import LanguageRecommendation from './views/LanguageRecommendation';
import { NotFound } from './views/NotFound';
import { TopArtists } from './views/TopArtists';
import { TopGenresPage } from './views/TopGenres';
import { TopTracks } from './views/TopTracks';

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dynamic-playlists" element={<DynamicPlaylists />} />
        <Route path="/language-recommendation" element={<LanguageRecommendation />} />
        <Route path="/top-tracks" element={<TopTracks />} />
        <Route path="/top-artists" element={<TopArtists />} />
        <Route path="/top-genres" element={<TopGenresPage />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
