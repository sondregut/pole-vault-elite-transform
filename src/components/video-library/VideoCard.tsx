
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Eye } from "lucide-react";
import { Video } from "@/hooks/useVideoLibrary";

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "Unknown";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getVideoUrl = () => {
    return `https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/video-library/${video.file_path}`;
  };

  const getThumbnailUrl = () => {
    if (video.thumbnail_path) {
      return `https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/video-thumbnails/${video.thumbnail_path}`;
    }
    // Fallback to a default thumbnail or video first frame
    return "https://via.placeholder.com/400x225/e5e7eb/6b7280?text=Video";
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <CardContent className="p-0">
        {/* Video Thumbnail */}
        <div className="relative aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
          <img
            src={getThumbnailUrl()}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          {/* Duration Badge */}
          {video.duration && (
            <Badge className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white">
              <Clock className="h-3 w-3 mr-1" />
              {formatDuration(video.duration)}
            </Badge>
          )}
        </div>

        {/* Video Info */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
          
          {video.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>
          )}

          {/* Category and Subcategory */}
          <div className="flex flex-wrap gap-2 mb-3">
            {video.category && (
              <Badge variant="secondary" className="text-xs">
                {video.category.name}
              </Badge>
            )}
            {video.subcategory && (
              <Badge variant="outline" className="text-xs">
                {video.subcategory}
              </Badge>
            )}
          </div>

          {/* Tags */}
          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {video.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {video.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{video.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Equipment */}
          {video.equipment_needed && video.equipment_needed.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Equipment needed:</p>
              <div className="flex flex-wrap gap-1">
                {video.equipment_needed.slice(0, 2).map((equipment, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {equipment}
                  </Badge>
                ))}
                {video.equipment_needed.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{video.equipment_needed.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* View Count */}
          <div className="flex items-center text-gray-500 text-sm">
            <Eye className="h-4 w-4 mr-1" />
            {video.view_count || 0} views
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
