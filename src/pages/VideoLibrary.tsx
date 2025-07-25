
import React, { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import VideoCard from '@/components/video-library/VideoCard';
import FilterButtons from '@/components/video-library/FilterButtons';
import VideoModal from '@/components/video-library/VideoModal';
import VideoSearch from '@/components/video-library/VideoSearch';
import SubscriptionPaywall from '@/components/subscription/SubscriptionPaywall';
import SubscriptionStatus from '@/components/subscription/SubscriptionStatus';
import { useVideos, Video } from '@/hooks/useVideos';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';

const categories = ['All', 'Warm-up', 'Strength', 'Rehab', 'PVD', 'Med Ball', 'Gym'] as const;

const VideoLibrary = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { videos, loading, error } = useVideos();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { subscribed, loading: subscriptionLoading } = useSubscription();

  // Check for subscription success/cancel in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const subscriptionParam = urlParams.get('subscription');
    
    if (subscriptionParam === 'success') {
      toast.success('Subscription activated! Welcome to the video library!');
      // Remove the URL parameter
      window.history.replaceState({}, '', '/video-library');
    } else if (subscriptionParam === 'cancelled') {
      toast.info('Subscription cancelled. You can try again anytime.');
      // Remove the URL parameter
      window.history.replaceState({}, '', '/video-library');
    }
  }, []);

  const filteredExercises = useMemo(() => {
    let filtered = videos;

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(video => video.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchLower) ||
        video.description.toLowerCase().includes(searchLower) ||
        video.category.toLowerCase().includes(searchLower) ||
        video.target_muscles.some(muscle => muscle.toLowerCase().includes(searchLower)) ||
        video.equipment.some(equip => equip.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, [videos, activeCategory, searchTerm]);

  const handleVideoClick = (video: Video) => {
    setSelectedExercise(video);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedExercise(null);
  };

  // Show loading while checking auth and subscription
  if (authLoading || subscriptionLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="section-padding py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="section-padding py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
            <p className="text-gray-600 mb-6">Please sign in to access the video library.</p>
            <a href="/auth" className="text-primary hover:underline">
              Go to Sign In
            </a>
          </div>
        </main>
      </div>
    );
  }

  // Show paywall for non-subscribers (unless admin) - Temporarily disabled
  /* if (!isAdmin && !subscribed) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <SubscriptionPaywall />
      </div>
    );
  } */

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="section-padding py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading videos...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="section-padding py-20">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading videos: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="section-padding py-20">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="section-heading">
            Video Library
          </h1>
          <p className="section-subheading">
            Comprehensive pole vault training exercises to improve your technique, strength, and performance. 
            Each video includes detailed instructions and professional guidance.
          </p>
          
          {/* Subscription Status for subscribed users */}
          {(subscribed || isAdmin) && (
            <div className="mt-6 flex justify-center">
              <SubscriptionStatus />
            </div>
          )}
        </div>

        {/* Search */}
        <VideoSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Filter Buttons */}
        <FilterButtons
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Results count */}
        {(searchTerm.trim() || activeCategory !== 'All') && (
          <div className="text-center mb-6">
            <p className="text-gray-600">
              {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
              {searchTerm.trim() && ` for "${searchTerm}"`}
              {activeCategory !== 'All' && ` in ${activeCategory}`}
            </p>
          </div>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          {filteredExercises.map((video) => (
            <VideoCard
              key={video.id}
              exercise={video}
              onClick={() => handleVideoClick(video)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm.trim() || activeCategory !== 'All' 
                ? 'No exercises found matching your search criteria.' 
                : 'No exercises found for the selected category.'
              }
            </p>
            {(searchTerm.trim() || activeCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('All');
                }}
                className="mt-4 text-primary hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </main>

      {/* Video Modal */}
      <VideoModal
        exercise={selectedExercise}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default VideoLibrary;
