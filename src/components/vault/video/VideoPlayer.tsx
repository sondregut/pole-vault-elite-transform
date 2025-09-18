import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { firebaseApp } from '@/utils/firebase';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  Loader2,
  AlertTriangle
} from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
  videoUploadStatus?: 'pending' | 'uploading' | 'completed' | 'failed';
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  thumbnailUrl,
  title,
  className = '',
  autoPlay = false,
  controls = true,
  width = '100%',
  height = 'auto',
  videoUploadStatus
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(!!thumbnailUrl);
  const [actualVideoUrl, setActualVideoUrl] = useState<string>('');
  const [actualThumbnailUrl, setActualThumbnailUrl] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if URL is a local mobile device path
  const isLocalMobileVideo = (url: string) => {
    return url.startsWith('file://') || url.includes('/var/mobile/') || url.includes('ImagePicker');
  };

  // Handle video loading based on upload status
  useEffect(() => {
    const loadVideoUrls = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        console.log('[VideoPlayer] Video status:', videoUploadStatus, 'URL:', videoUrl);

        // Check upload status first
        if (videoUploadStatus && videoUploadStatus !== 'completed') {
          console.log('[VideoPlayer] Video not completed, status:', videoUploadStatus);
          setIsLoading(false);
          return;
        }

        // Check if it's a local mobile video (not accessible from web)
        if (isLocalMobileVideo(videoUrl)) {
          console.log('[VideoPlayer] Local mobile video detected:', videoUrl);
          setHasError(true);
          setIsLoading(false);
          return;
        }

        // Only proceed if video upload is completed or no status provided
        if (!videoUploadStatus || videoUploadStatus === 'completed') {
          // Check if video URL is already a download URL
          if (videoUrl.startsWith('https://')) {
            console.log('[VideoPlayer] Using direct download URL:', videoUrl);
            setActualVideoUrl(videoUrl);
          } else {
            // Assume it's a Firebase Storage path that needs to be resolved
            console.log('[VideoPlayer] Resolving Firebase Storage path:', videoUrl);
            const storage = getStorage(firebaseApp); // Use our Firebase app instance
            const videoRef = ref(storage, videoUrl);

            try {
              const downloadUrl = await getDownloadURL(videoRef);
              console.log('[VideoPlayer] Successfully resolved video URL:', downloadUrl);
              setActualVideoUrl(downloadUrl);
            } catch (storageError) {
              console.error('[VideoPlayer] Firebase Storage error:', storageError);
              throw new Error(`Failed to get video from Firebase Storage: ${storageError.message}`);
            }
          }

          // Handle thumbnail URL
          if (thumbnailUrl) {
            if (isLocalMobileVideo(thumbnailUrl)) {
              console.log('[VideoPlayer] Local mobile thumbnail detected, skipping');
            } else if (thumbnailUrl.startsWith('https://')) {
              console.log('[VideoPlayer] Using direct thumbnail URL:', thumbnailUrl);
              setActualThumbnailUrl(thumbnailUrl);
            } else {
              try {
                console.log('[VideoPlayer] Resolving thumbnail from Firebase Storage:', thumbnailUrl);
                const storage = getStorage(firebaseApp);
                const thumbRef = ref(storage, thumbnailUrl);
                const thumbDownloadUrl = await getDownloadURL(thumbRef);
                console.log('[VideoPlayer] Successfully resolved thumbnail URL:', thumbDownloadUrl);
                setActualThumbnailUrl(thumbDownloadUrl);
              } catch (thumbError) {
                console.warn('[VideoPlayer] Thumbnail resolution failed:', thumbError);
                // Continue without thumbnail
              }
            }
          }
        }
      } catch (error) {
        console.error('[VideoPlayer] Error loading video URLs:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (videoUrl) {
      loadVideoUrls();
    }
  }, [videoUrl, thumbnailUrl, videoUploadStatus]);

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setShowThumbnail(false);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
      setShowThumbnail(false);
    }
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleThumbnailClick = () => {
    setShowThumbnail(false);
    handlePlay();
  };

  if (hasError) {
    const isLocalVideo = isLocalMobileVideo(videoUrl);

    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isLocalVideo ? 'Video Not Uploaded' : 'Video Unavailable'}
          </h3>
          <p className="text-gray-600 mb-4">
            {isLocalVideo
              ? 'This video is stored locally on your mobile device and hasn\'t been uploaded to the cloud yet.'
              : 'This video could not be loaded. It may require authentication or have been moved.'
            }
          </p>
          {isLocalVideo ? (
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <p className="text-sm text-blue-800 mb-2">
                <strong>To view videos on web:</strong>
              </p>
              <ul className="text-sm text-blue-700 text-left space-y-1">
                <li>• Videos need to be uploaded to the cloud from your mobile app</li>
                <li>• Check your mobile app's video upload settings</li>
                <li>• Ensure you have internet connection on mobile device</li>
                <li>• Videos will appear here once uploaded</li>
              </ul>
            </div>
          ) : (
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border">
              <div><strong>Video URL:</strong> {videoUrl}</div>
              {thumbnailUrl && <div><strong>Thumbnail:</strong> {thumbnailUrl}</div>}
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Handle different upload statuses
  if (videoUploadStatus === 'pending') {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="h-8 w-8 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Video Upload Pending
          </h3>
          <p className="text-gray-600 mb-4">
            This video is waiting to be uploaded from your mobile device
          </p>
          <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>The video will appear here once uploaded from your mobile app</strong>
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (videoUploadStatus === 'uploading') {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Video Uploading...
          </h3>
          <p className="text-gray-600 mb-4">
            Your video is being uploaded to the cloud
          </p>
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Please wait while the upload completes</strong>
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (videoUploadStatus === 'failed') {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Video Upload Failed
          </h3>
          <p className="text-gray-600 mb-4">
            The video upload encountered an error
          </p>
          <div className="bg-red-50 p-4 rounded border border-red-200">
            <p className="text-sm text-red-800 mb-2">
              <strong>To retry upload:</strong>
            </p>
            <ul className="text-sm text-red-700 text-left space-y-1">
              <li>• Open your Vault mobile app</li>
              <li>• Check your internet connection</li>
              <li>• The app will automatically retry failed uploads</li>
            </ul>
          </div>
        </div>
      </Card>
    );
  }

  if (isLoading || !actualVideoUrl) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Loading Video...
          </h3>
          <p className="text-gray-600">
            Preparing your training video
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {title && (
        <div className="mb-3">
          <Badge variant="secondary" className="text-sm">
            {title}
          </Badge>
        </div>
      )}

      <div className="relative bg-black rounded-lg overflow-hidden">
        {/* Thumbnail Overlay */}
        {showThumbnail && actualThumbnailUrl && (
          <div
            className="absolute inset-0 z-10 cursor-pointer bg-cover bg-center"
            style={{ backgroundImage: `url(${actualThumbnailUrl})` }}
            onClick={handleThumbnailClick}
          >
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
                <Play className="h-8 w-8 text-gray-900 ml-1" />
              </div>
            </div>
          </div>
        )}

        {/* Video Element */}
        <video
          ref={videoRef}
          src={actualVideoUrl}
          className="w-full h-auto"
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          playsInline
          preload="metadata"
          crossOrigin="anonymous"
          style={{ display: showThumbnail ? 'none' : 'block' }}
        />

        {/* Loading Overlay */}
        {isLoading && !showThumbnail && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}

        {/* Custom Controls */}
        {controls && !showThumbnail && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePlay}
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRestart}
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMute}
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleFullscreen}
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;