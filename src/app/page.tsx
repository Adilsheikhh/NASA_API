'use client';

import React, { useState, useEffect } from 'react';
import { Telescope, Calendar, RefreshCw, Info } from 'lucide-react';
import { format, subDays } from 'date-fns';
import ImageCard from '@/components/ImageCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { NASAImage, GPTExplanation } from '@/types';

export default function Home() {
  const [images, setImages] = useState<NASAImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [explanations, setExplanations] = useState<Record<string, GPTExplanation>>({});
  const [loadingExplanations, setLoadingExplanations] = useState<Record<string, boolean>>({});

  // Fetch recent images on component mount
  useEffect(() => {
    fetchRecentImages();
  }, []);

  const fetchRecentImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endDate = format(new Date(), 'yyyy-MM-dd');
      const startDate = format(subDays(new Date(), 6), 'yyyy-MM-dd'); // Last 7 days
      
      const response = await fetch(`/api/nasa?start_date=${startDate}&end_date=${endDate}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch NASA images');
      }
      
      const data = await response.json();
      setImages(Array.isArray(data) ? data.reverse() : [data]); // Show newest first
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchTodaysImage = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/nasa');
      
      if (!response.ok) {
        throw new Error('Failed to fetch today&apos;s NASA image');
      }
      
      const data = await response.json();
      setImages([data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleExplainImage = async (image: NASAImage) => {
    const imageKey = image.date;
    
    if (explanations[imageKey]) {
      return; // Already have explanation
    }

    try {
      setLoadingExplanations(prev => ({ ...prev, [imageKey]: true }));
      
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate explanation');
      }
      
      const explanation = await response.json();
      setExplanations(prev => ({ ...prev, [imageKey]: explanation }));
    } catch (err) {
      console.error('Error getting explanation:', err);
      // Show error to user
      alert('Failed to generate AI explanation. Please try again.');
    } finally {
      setLoadingExplanations(prev => ({ ...prev, [imageKey]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading NASA images...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={fetchRecentImages}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Telescope className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">NASA Image Explorer</h1>
                <p className="text-gray-600">Discover the cosmos with AI-enhanced explanations</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={fetchTodaysImage}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Today&apos;s Image</span>
              </button>
              
              <button
                onClick={fetchRecentImages}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recent Images</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {images.length === 0 ? (
          <div className="text-center py-12">
            <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No images found</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <ImageCard
                key={image.date}
                image={image}
                gptExplanation={explanations[image.date]}
                onExplainClick={handleExplainImage}
                isLoading={loadingExplanations[image.date] || false}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              Images courtesy of{' '}
              <a 
                href="https://api.nasa.gov/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                NASA API
              </a>
            </p>
            <p className="text-sm">
              Enhanced with AI explanations to make astronomy accessible to everyone
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
