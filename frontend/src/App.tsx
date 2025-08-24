import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Callback from './pages/Callback';
import Dashboard from './pages/Dashboard';
import DynamicPlaylists from './pages/DynamicPlaylists';
import Index from './pages/Index';
import LanguageRecommendation from './pages/LanguageRecommendation';
import NotFound from './pages/NotFound';
import TopArtists from './pages/TopArtists';
import TopGenresPage from './pages/TopGenres';
import TopTracks from './pages/TopTracks';

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
