import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div 
        className="
          w-10 h-10 border-4 border-gray-400 border-t-transparent 
          rounded-full animate-spin
        "
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingIndicator;