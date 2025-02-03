import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Music, Headphones, Languages } from 'lucide-react';
import LoginButton from '@/components/LoginButton';

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full spotlight" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-spotify-green/20 bg-spotify-green/10">
            <span className="text-sm font-medium text-spotify-green">
              Your Music Journey Starts Here
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Discover Your
            <span className="text-gradient"> Musical Universe</span>
          </h1>
          
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Dive deep into your listening habits, discover new music, and learn languages through songs. All in one beautiful experience.
          </p>
          
          <LoginButton />
        </motion.div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <Music className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
            <p className="text-muted-foreground text-center">
              Get detailed insights about your music taste and listening habits.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Headphones className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Discover New Music</h3>
            <p className="text-muted-foreground text-center">
              Explore new songs and artists based on your preferences.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Languages className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Learn Languages</h3>
            <p className="text-muted-foreground text-center">
              Improve your language skills through music and lyrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;