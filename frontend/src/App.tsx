import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import axios from 'axios';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import DynamicPlaylists from "./pages/DynamicPlaylists";
import LanguageRecommendation from "./pages/LanguageRecommendation";
import { Layout } from "@/components/layout/Layout";

const queryClient = new QueryClient();

const Callback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        try {
          const response = await axios.get(`http://localhost:8000/spotify/callback?code=${code}`);
          const userInfo = response.data;
          console.log(userInfo);  // Handle user info (e.g., save to state, local storage, etc.)
          navigate('/dashboard');  // Redirect to dashboard after successful login
        } catch (error) {
          console.error('Failed to fetch user info:', error);
        }
      }
    };

    fetchUserInfo();
  }, [navigate]);

  return <div>Loading...</div>;
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="*" element={<NotFound />} />
            <Route element={<Layout children={undefined} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dynamic-playlists" element={<DynamicPlaylists />} />
              <Route path="/language-recommendation" element={<LanguageRecommendation />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;