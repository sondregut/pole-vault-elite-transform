
import React from "react";
import VideoCard from "./VideoCard";
import { Video } from "@/hooks/useVideoLibrary";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoGridProps {
  videos: Video[];
  isLoading: boolean;
  selectedCategory: string | null;
  onVideoSelect: (video: Video) => void;
}

const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  isLoading,
  selectedCategory,
  onVideoSelect
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
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <div className="max-w-md mx-auto">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Videos Found</h3>
          <p className="text-gray-500 mb-6">
            {selectedCategory 
              ? "No videos found in this category. Try adjusting your filters or search terms."
              : "No videos have been uploaded yet."
            }
          </p>
          <div className="text-sm text-gray-400 space-y-2">
            <p>To add videos to the library:</p>
            <div className="flex items-center justify-center gap-2 text-xs">
              <Upload className="h-4 w-4" />
              <span>Upload videos to the 'video-library' storage bucket in Supabase</span>
            </div>
            <p className="text-xs">Supported formats: MP4, WebM, MOV, QuickTime</p>
          </div>
        </div>
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
          <VideoCard 
            key={video.id} 
            video={video} 
            onClick={() => onVideoSelect(video)}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;
