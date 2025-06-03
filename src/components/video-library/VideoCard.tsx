
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Eye, AlertCircle } from "lucide-react";
import { Video } from "@/hooks/useVideoLibrary";
import { supabase } from "@/integrations/supabase/client";

interface VideoCardProps {
  video: Video;
  onClick: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  const [thumbnailUrl, setThumbnailUrl] = React.useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = React.useState(false);

  React.useEffect(() => {
    const generateThumbnailUrl = async () => {
      if (video.thumbnail_path) {
        try {
          const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from('video-thumbnails')
            .createSignedUrl(video.thumbnail_path, 3600);

          if (signedUrlData?.signedUrl && !signedUrlError) {
            setThumbnailUrl(signedUrlData.signedUrl);
            return;
          }

          const { data: publicUrlData } = supabase.storage
            .from('video-thumbnails')
            .getPublicUrl(video.thumbnail_path);

          if (publicUrlData?.publicUrl) {
            setThumbnailUrl(publicUrlData.publicUrl);
            return;
          }

          setThumbnailUrl(`https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/video-thumbnails/${video.thumbnail_path}`);
        } catch (err) {
          console.error('Error generating thumbnail URL:', err);
          setThumbnailError(true);
        }
      }
    };

    generateThumbnailUrl();
  }, [video.thumbnail_path]);

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "Unknown";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyLevel = () => {
    // Mock difficulty based on category for demo
    const difficultyMap: { [key: string]: number } = {
      'warmup': 1,
      'flexibility': 1,
      'technique': 2,
      'drills': 2,
      'strength': 3
    };
    return difficultyMap[video.category?.name.toLowerCase() || ''] || 2;
  };

  const difficulty = getDifficultyLevel();

  const handleThumbnailError = () => {
    setThumbnailError(true);
  };

  return (
    <Card 
      className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border-0" 
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Video Thumbnail with enhanced styling */}
        <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-t-2xl overflow-hidden">
          {thumbnailError ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark">
              <div className="text-center text-white">
                <div className="text-6xl mb-2">📹</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-6xl opacity-70 animate-pulse">▶</div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {!thumbnailUrl ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-2">📹</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-6xl opacity-70 animate-pulse">▶</div>
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={handleThumbnailError}
                />
              )}
            </>
          )}
          
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <Play className="h-16 w-16 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100" />
          </div>
          
          {/* Duration Badge */}
          {video.duration && (
            <Badge className="absolute bottom-3 right-3 bg-black/80 text-white border-0 backdrop-blur-sm">
              <Clock className="h-3 w-3 mr-1" />
              {formatDuration(video.duration)}
            </Badge>
          )}
        </div>

        {/* Video Info */}
        <div className="p-6">
          <h3 className="font-bold text-xl mb-3 text-primary line-clamp-2 leading-tight">{video.title}</h3>
          
          {/* Category Badge */}
          {video.category && (
            <Badge className="mb-3 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-1 rounded-full text-sm font-semibold">
              {video.category.name}
            </Badge>
          )}

          {video.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{video.description}</p>
          )}

          {/* Difficulty Level */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-gray-600 text-sm font-medium">Difficulty:</span>
            <div className="flex gap-1">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index < difficulty ? 'bg-secondary' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Tags */}
          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {video.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs border-gray-300 text-gray-600">
                  {tag}
                </Badge>
              ))}
              {video.tags.length > 3 && (
                <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                  +{video.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* View Count */}
          <div className="flex items-center text-gray-400 text-sm">
            <Eye className="h-4 w-4 mr-1" />
            {video.view_count || 0} views
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
