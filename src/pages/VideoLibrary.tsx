
import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import VideoCard from '@/components/video-library/VideoCard';
import FilterButtons from '@/components/video-library/FilterButtons';
import VideoModal from '@/components/video-library/VideoModal';
import VideoSearch from '@/components/video-library/VideoSearch';
import { videoExercises, categories, VideoExercise } from '@/data/videoLibraryData';

const VideoLibrary = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<VideoExercise | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredExercises = useMemo(() => {
    let filtered = videoExercises;

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(exercise => exercise.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(exercise =>
        exercise.title.toLowerCase().includes(searchLower) ||
        exercise.description.toLowerCase().includes(searchLower) ||
        exercise.category.toLowerCase().includes(searchLower) ||
        exercise.targetMuscles.some(muscle => muscle.toLowerCase().includes(searchLower)) ||
        exercise.equipment.some(equip => equip.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, [activeCategory, searchTerm]);

  const handleVideoClick = (exercise: VideoExercise) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedExercise(null);
  };

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
          {filteredExercises.map((exercise) => (
            <VideoCard
              key={exercise.id}
              exercise={exercise}
              onClick={() => handleVideoClick(exercise)}
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
