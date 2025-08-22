import React from 'react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`text-center max-w-3xl mx-auto ${className}`}
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
    </motion.div>
  );
};

export default HeroSection;