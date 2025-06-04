
import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VideoCard from '@/components/video-library/VideoCard';
import FilterButtons from '@/components/video-library/FilterButtons';
import VideoModal from '@/components/video-library/VideoModal';
import { videoExercises, categories, VideoExercise } from '@/data/videoLibraryData';

const VideoLibrary = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedExercise, setSelectedExercise] = useState<VideoExercise | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredExercises = useMemo(() => {
    if (activeCategory === 'All') {
      return videoExercises;
    }
    return videoExercises.filter(exercise => exercise.category === activeCategory);
  }, [activeCategory]);

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
            Exercise Video Library
          </h1>
          <p className="section-subheading">
            Comprehensive pole vault training exercises to improve your technique, strength, and performance. 
            Each video includes detailed instructions and professional guidance.
          </p>
        </div>

        {/* Filter Buttons */}
        <FilterButtons
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

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
              No exercises found for the selected category.
            </p>
          </div>
        )}
      </main>

      {/* Video Modal */}
      <VideoModal
        exercise={selectedExercise}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />

      <Footer />
    </div>
  );
};

export default VideoLibrary;
