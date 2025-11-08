
import React, { useState, useEffect } from 'react';
import { SpinnerIcon } from './icons';
import { LOADING_MESSAGES } from '../constants';

interface ResultDisplayProps {
  isLoading: boolean;
  resultImageUrl: string | null;
  error: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, resultImageUrl, error }) => {
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

  // FIX: Refactored useEffect to correctly handle interval in a browser environment.
  // Using `window.setInterval` ensures TypeScript infers the correct return type (`number`)
  // instead of `NodeJS.Timeout`, which is not available in the browser and was causing an error.
  // The cleanup function is now correctly returned only when the interval is set.
  useEffect(() => {
    if (isLoading) {
      const intervalId = window.setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = LOADING_MESSAGES.indexOf(prev);
          const nextIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
          return LOADING_MESSAGES[nextIndex];
        });
      }, 2500);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isLoading]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <SpinnerIcon className="w-16 h-16 text-blue-600 animate-spin" />
          <p className="mt-4 text-lg font-semibold text-gray-700">Please wait</p>
          <p className="mt-2 text-gray-500 transition-opacity duration-500">{loadingMessage}</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
          <h3 className="font-bold">Generation Failed</h3>
          <p className="text-sm">{error}</p>
        </div>
      );
    }
    if (resultImageUrl) {
      return <img src={resultImageUrl} alt="Generated virtual try-on" className="w-full h-full object-contain rounded-md" />;
    }
    return (
      <div className="text-center text-gray-500">
        <h3 className="text-xl font-semibold">Your Virtual Fitting Room</h3>
        <p className="mt-2">Upload a photo and customize your garment to see the result here.</p>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-200/50 rounded-lg shadow-inner border border-gray-200 p-4">
      {renderContent()}
    </div>
  );
};

export default ResultDisplay;
