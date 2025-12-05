import { useState, useRef, useEffect } from 'react';
import { JumpResult } from '@/types/chat';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { firebaseApp } from '@/utils/firebase';
import {
  Play,
  Pause,
  Maximize,
  Loader2,
  AlertTriangle,
  ChevronRight,
  Video,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface ChatVideoCardProps {
  jump: JumpResult;
  onNavigate: (sessionId: string, jumpIndex?: number) => void;
}

export function ChatVideoCard({ jump, onNavigate }: ChatVideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [actualVideoUrl, setActualVideoUrl] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const isLocalMobileVideo = (url: string) => {
    return url.startsWith('file://') || url.includes('/var/mobile/') || url.includes('ImagePicker');
  };

  // Load video URL immediately when component mounts
  useEffect(() => {
    if (jump.videoUrl && !actualVideoUrl) {
      loadVideoUrl();
    }
  }, [jump.videoUrl]);

  const loadVideoUrl = async () => {
    if (!jump.videoUrl) return;

    try {
      setIsLoading(true);
      setHasError(false);

      if (isLocalMobileVideo(jump.videoUrl)) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      if (jump.videoUrl.startsWith('https://')) {
        setActualVideoUrl(jump.videoUrl);
      } else {
        const storage = getStorage(firebaseApp);
        const videoRefStorage = ref(storage, jump.videoUrl);
        const downloadUrl = await getDownloadURL(videoRefStorage);
        setActualVideoUrl(downloadUrl);
      }
    } catch (error) {
      console.error('[ChatVideoCard] Error loading video:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const isMade = jump.result === 'make';

  return (
    <div className="w-full bg-white border border-vault-border-light rounded-xl shadow-vault-sm overflow-hidden">
      {/* Header with jump info */}
      <div className="p-3 border-b border-vault-border-light">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-vault-primary-muted flex items-center justify-center">
            <Video className="w-5 h-5 text-vault-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-vault-text truncate">{jump.height}</p>
              {isMade ? (
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-vault-text-muted truncate">
              {new Date(jump.date).toLocaleDateString()} - {jump.location}
            </p>
            {jump.competitionName && (
              <p className="text-xs text-vault-primary mt-0.5">{jump.competitionName}</p>
            )}
          </div>
        </div>
      </div>

      {/* Video Section - Always visible */}
      <div>
        {isLoading && (
          <div className="p-6 text-center">
            <Loader2 className="w-8 h-8 text-vault-primary mx-auto animate-spin" />
            <p className="text-sm text-vault-text-muted mt-2">Loading video...</p>
          </div>
        )}

        {hasError && (
          <div className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-sm text-vault-text-muted">
              Video not available. It may need to be uploaded from the mobile app.
            </p>
            <button
              onClick={() => onNavigate(jump.sessionId, jump.jumpIndex)}
              className="mt-2 text-sm text-vault-primary hover:underline"
            >
              View jump details
            </button>
          </div>
        )}

        {!isLoading && !hasError && actualVideoUrl && (
          <div className="relative bg-black">
            <video
              ref={videoRef}
              src={actualVideoUrl}
              className="w-full max-h-72 object-contain"
              playsInline
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onLoadedData={() => setIsLoading(false)}
              onError={() => setHasError(true)}
            />

            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePlayPause}
                  className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={handleFullscreen}
                  className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Full Details Link */}
        <button
          onClick={() => onNavigate(jump.sessionId, jump.jumpIndex)}
          className="w-full p-2 text-center text-sm text-vault-primary hover:bg-vault-primary-muted/30 transition-colors flex items-center justify-center gap-1 border-t border-vault-border-light"
        >
          <span>View full session</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
