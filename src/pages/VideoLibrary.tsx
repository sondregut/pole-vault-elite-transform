
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoGrid from "@/components/video-library/VideoGrid";
import VideoFilters from "@/components/video-library/VideoFilters";
import VideoSearch from "@/components/video-library/VideoSearch";
import CategoryNavigation from "@/components/video-library/CategoryNavigation";
import { useVideoLibrary } from "@/hooks/useVideoLibrary";

const VideoLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Video Library</h1>
            <p className="text-xl text-gray-600">
              Comprehensive collection of pole vault training videos, drills, and exercises
            </p>
          </div>

          {/* Category Navigation */}
          <CategoryNavigation
            categories={categories}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            onCategorySelect={setSelectedCategory}
            onSubcategorySelect={setSelectedSubcategory}
          />

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="flex-1">
              <VideoSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
            <VideoFilters
              sortBy={sortBy}
              onSortChange={setSortBy}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              selectedEquipment={selectedEquipment}
              onEquipmentChange={setSelectedEquipment}
            />
          </div>

          {/* Video Grid */}
          {error ? (
            <div className="text-center py-12">
              <p className="text-red-600">Error loading videos: {error}</p>
            </div>
          ) : (
            <VideoGrid
              videos={videos}
              isLoading={isLoading}
              selectedCategory={selectedCategory}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VideoLibrary;
