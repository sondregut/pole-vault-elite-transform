
import React, { useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Play, Pause, Volume2, VolumeX, Maximize, Minimize, AlertCircle } from "lucide-react";
import { Video } from "@/hooks/useVideoLibrary";
import { supabase } from "@/integrations/supabase/client";

interface VideoPlayerProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  // Generate video URL with proper error handling
  const generateVideoUrl = async (video: Video): Promise<string | null> => {
    try {
      // If file_path starts with http, it's already a full URL
      if (video.file_path.startsWith('http')) {
        return video.file_path;
      }

      // Try to get a signed URL first (more reliable)
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('video-library')
        .createSignedUrl(video.file_path, 3600); // 1 hour expiry

      if (signedUrlData?.signedUrl && !signedUrlError) {
        return signedUrlData.signedUrl;
      }

      // Fallback to public URL
      const { data: publicUrlData } = supabase.storage
        .from('video-library')
        .getPublicUrl(video.file_path);

      if (publicUrlData?.publicUrl) {
        return publicUrlData.publicUrl;
      }

      // Final fallback to constructed URL
      return `https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/video-library/${video.file_path}`;
    } catch (err) {
      console.error('Error generating video URL:', err);
      return null;
    }
  };

  // Load video URL when video changes
  useEffect(() => {
    if (isOpen && video) {
      setIsLoading(true);
      setError(null);
      setRetryCount(0);
      
      generateVideoUrl(video).then(url => {
        if (url) {
          setVideoUrl(url);
          console.log('Video URL generated:', url);
        } else {
          setError('Unable to generate video URL. Please check if the video file exists.');
          setIsLoading(false);
        }
      });
    }
  }, [isOpen, video]);

  // Load video when URL changes
  useEffect(() => {
    if (videoRef.current && videoUrl) {
      setIsLoading(true);
      videoRef.current.load();
    }
  }, [videoUrl]);

  const handleRetry = () => {
    if (video && retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setError(null);
      setIsLoading(true);
      generateVideoUrl(video).then(url => {
        if (url) {
          setVideoUrl(url);
        } else {
          setError('Failed to load video after retry. Please try again later.');
          setIsLoading(false);
        }
      });
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((err) => {
          console.error("Error playing video:", err);
          setError("Unable to play video. The video format may not be supported or the file may be corrupted.");
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen().catch(() => {
          console.log("Fullscreen not supported");
        });
      } else {
        document.exitFullscreen().catch(() => {
          console.log("Exit fullscreen failed");
        });
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
      console.log('Video loaded successfully, duration:', videoRef.current.duration);
    }
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    console.log('Video load started');
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    setError(null);
    console.log('Video can play');
  };

  const handleError = (e: any) => {
    console.error('Video error:', e);
    setIsLoading(false);
    
    const videoElement = videoRef.current;
    if (videoElement?.error) {
      switch (videoElement.error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          setError('Video playback was aborted. Please try again.');
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          setError('Network error occurred while loading the video. Please check your connection.');
          break;
        case MediaError.MEDIA_ERR_DECODE:
          setError('Video format is not supported or file is corrupted.');
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          setError('Video format is not supported by your browser.');
          break;
        default:
          setError('An unknown error occurred while loading the video.');
      }
    } else {
      setError('Failed to load video. Please check if the video file exists and is accessible.');
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = (parseFloat(e.target.value) / 100) * duration;
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0 bg-black">
        <div className="relative w-full h-full">
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-20 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black text-white z-10">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Loading video...</p>
                {videoUrl && (
                  <p className="text-xs text-gray-400 mt-2 max-w-md break-all">URL: {videoUrl}</p>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black text-white z-10">
              <div className="text-center max-w-md px-4">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-400 mb-4 text-lg font-semibold">Video Playback Error</p>
                <p className="text-sm text-gray-300 mb-4">{error}</p>
                {videoUrl && (
                  <p className="text-xs text-gray-500 mb-4 break-all">URL: {videoUrl}</p>
                )}
                {retryCount < 3 && (
                  <Button onClick={handleRetry} variant="outline" className="text-white border-white hover:bg-white/20">
                    Retry ({3 - retryCount} attempts left)
                  </Button>
                )}
              </div>
            </div>
          )}

          {videoUrl && (
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onLoadStart={handleLoadStart}
              onCanPlay={handleCanPlay}
              onError={handleError}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              controls={false}
              preload="metadata"
              crossOrigin="anonymous"
            >
              <source src={videoUrl} type="video/mp4" />
              <source src={videoUrl} type="video/webm" />
              <source src={videoUrl} type="video/quicktime" />
              <source src={videoUrl} type="video/mov" />
              Your browser does not support the video tag.
            </video>
          )}

          {/* Video Controls */}
          {!error && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
              <div className="flex items-center gap-4 text-white mb-4">
                <Button
                  onClick={togglePlay}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  disabled={isLoading || !!error}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>

                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm min-w-[40px]">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={duration ? (currentTime / duration) * 100 : 0}
                    onChange={handleSeek}
                    className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    disabled={isLoading || !!error}
                  />
                  <span className="text-sm min-w-[40px]">{formatTime(duration)}</span>
                </div>

                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  disabled={isLoading || !!error}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>

                <Button
                  onClick={toggleFullscreen}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  disabled={isLoading || !!error}
                >
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">{video.title}</h3>
                {video.description && (
                  <p className="text-gray-300 text-sm mt-1">{video.description}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
