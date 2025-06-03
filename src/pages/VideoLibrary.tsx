import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import VideoGrid from "@/components/video-library/VideoGrid";
import VideoFilters from "@/components/video-library/VideoFilters";
import VideoSearch from "@/components/video-library/VideoSearch";
import CategoryNavigation from "@/components/video-library/CategoryNavigation";
import VideoPlayer from "@/components/video-library/VideoPlayer";
import VideoUploadHelper from "@/components/video-library/VideoUploadHelper";
import { useVideoLibrary, Video } from "@/hooks/useVideoLibrary";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

const VideoLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [showUploadHelper, setShowUploadHelper] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");

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

  const filterCategories = [
    { id: "all", name: "All Exercises" },
    { id: "warmup", name: "Warm-up" },
    { id: "technique", name: "Technique" },
    { id: "strength", name: "Strength" },
    { id: "drills", name: "Drills" },
    { id: "flexibility", name: "Flexibility" }
  ];

  const filteredVideos = filterCategory === "all" 
    ? videos 
    : videos.filter(video => video.category?.name.toLowerCase() === filterCategory);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Header with animated background */}
          <div className="text-center text-white py-16 mb-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-full scale-150 animate-pulse opacity-30"></div>
            <div className="relative z-10">
              <div className="flex justify-center items-center gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Pole Vault Exercise Library
                </h1>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUploadHelper(!showUploadHelper)}
                  className="gap-2 bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <HelpCircle className="h-4 w-4" />
                  Upload Guide
                </Button>
              </div>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Comprehensive training videos for athletes at all levels
              </p>
            </div>
          </div>

          {/* Upload Helper */}
          {showUploadHelper && (
            <div className="mb-8">
              <VideoUploadHelper />
            </div>
          )}

          {/* Filter Buttons */}
          <div className="flex justify-center gap-3 mb-12 flex-wrap">
            {filterCategories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setFilterCategory(category.id)}
                variant={filterCategory === category.id ? "default" : "outline"}
                className={`
                  px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg
                  ${filterCategory === category.id 
                    ? 'bg-secondary text-white hover:bg-secondary/90 shadow-xl' 
                    : 'bg-white text-primary border-white hover:bg-gray-50'
                  }
                `}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Search and Advanced Filters - Hidden in new design but keeping functionality */}
          <div className="hidden">
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <VideoSearch
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                </div>
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
          </div>

          {/* Video Grid */}
          {error ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-red-600 text-lg">Error loading videos: {error}</p>
              <p className="text-gray-500 mt-2">Please try refreshing the page</p>
            </div>
          ) : (
            <VideoGrid
              videos={filteredVideos}
              isLoading={isLoading}
              selectedCategory={filterCategory}
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
