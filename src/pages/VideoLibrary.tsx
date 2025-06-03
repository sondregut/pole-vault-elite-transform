
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import VideoGrid from "@/components/video-library/VideoGrid";
import VideoFilters from "@/components/video-library/VideoFilters";
import VideoSearch from "@/components/video-library/VideoSearch";
import CategoryNavigation from "@/components/video-library/CategoryNavigation";
import VideoPlayer from "@/components/video-library/VideoPlayer";
import { useVideoLibrary, Video } from "@/hooks/useVideoLibrary";

const VideoLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const {
    videos,
    categories,
    isLoading,
    error
  } = useVideoLibrary({
    categoryId: selectedCategory,
    subcategory: selectedSubcategory,
    searchQuery,
    sortBy,
    tags: selectedTags,
    equipment: selectedEquipment
  });

  const handleVideoSelect = (video: Video) => {
    console.log("Selected video:", video);
    console.log("Video file path:", video.file_path);
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  const handleClosePlayer = () => {
    setIsPlayerOpen(false);
    setSelectedVideo(null);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Video Library</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive collection of pole vault training videos, drills, and exercises
            </p>
          </div>

          {/* Category Navigation */}
          <div className="mb-8">
            <CategoryNavigation
              categories={categories}
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
              onCategorySelect={setSelectedCategory}
              onSubcategorySelect={setSelectedSubcategory}
            />
          </div>

          {/* Search and Filters Row */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Search - Takes up 2 columns on large screens */}
              <div className="lg:col-span-2">
                <VideoSearch
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              </div>
              
              {/* Filters - Takes up 1 column on large screens */}
              <div>
                <VideoFilters
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  selectedTags={selectedTags}
                  onTagsChange={setSelectedTags}
                  selectedEquipment={selectedEquipment}
                  onEquipmentChange={setSelectedEquipment}
                />
              </div>
            </div>
          </div>

          {/* Video Grid */}
          {error ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-red-600 text-lg">Error loading videos: {error}</p>
              <p className="text-gray-500 mt-2">Please try refreshing the page</p>
            </div>
          ) : (
            <VideoGrid
              videos={videos}
              isLoading={isLoading}
              selectedCategory={selectedCategory}
              onVideoSelect={handleVideoSelect}
            />
          )}
        </div>
      </div>

      {/* Video Player Modal */}
      <VideoPlayer
        video={selectedVideo}
        isOpen={isPlayerOpen}
        onClose={handleClosePlayer}
      />
    </>
  );
};

export default VideoLibrary;
