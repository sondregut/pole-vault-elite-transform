
import React from "react";
import VideoCard from "./VideoCard";
import { Video } from "@/hooks/useVideoLibrary";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoGridProps {
  videos: Video[];
  isLoading: boolean;
  selectedCategory: string | null;
}

const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  isLoading,
  selectedCategory
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No videos found matching your criteria.</p>
        <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          {videos.length} video{videos.length !== 1 ? 's' : ''} found
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;
