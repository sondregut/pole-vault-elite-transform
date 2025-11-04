import React, { useState, useMemo, useEffect } from 'react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useVaultSessions, useVaultPoles } from '@/hooks/useVaultData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import VideoPlayer from '@/components/vault/video/VideoPlayer';
import { Jump, Session, formatDate, formatHeight, ratingLabels, ratingColors } from '@/types/vault';
import { getPoleDisplayName } from '@/utils/poleHelpers';
import {
  Video,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  XCircle,
  Play,
  Grid3X3,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface VideoWithContext extends Jump {
  sessionId: string;
  sessionDate: string;
  sessionLocation?: string;
  sessionType?: string;
  jumpIndex: number;
}

const VaultVideos = () => {
  const { user } = useFirebaseAuth();
  const { sessions, loading } = useVaultSessions(user);
  const { poles } = useVaultPoles(user);
  const [searchTerm, setSearchTerm] = useState('');
  const [resultFilter, setResultFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [selectedVideo, setSelectedVideo] = useState<VideoWithContext | null>(null);

  // Flatten all jumps with videos from all sessions
  const allVideos = useMemo(() => {
    const videos: VideoWithContext[] = [];

    sessions.forEach((session) => {
      if (session.jumps) {
        session.jumps.forEach((jump, index) => {
          if (jump.videoUrl || jump.videoLocalUri) {
            videos.push({
              ...jump,
              sessionId: session.id || '',
              sessionDate: session.date,
              sessionLocation: session.location,
              sessionType: session.sessionType,
              jumpIndex: index
            });
          }
        });
      }
    });

    return videos;
  }, [sessions]);

  // Filter and sort videos
  const filteredVideos = useMemo(() => {
    let filtered = allVideos.filter((video) => {
      const matchesSearch =
        video.sessionLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.height.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.pole.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesResult =
        resultFilter === 'all' ||
        (resultFilter === 'make' && video.result === 'make') ||
        (resultFilter === 'miss' && video.result === 'miss');

      return matchesSearch && matchesResult;
    });

    // Sort videos
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime();
        case 'oldest':
          return new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime();
        case 'highest':
          return parseFloat(b.height) - parseFloat(a.height);
        case 'lowest':
          return parseFloat(a.height) - parseFloat(b.height);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allVideos, searchTerm, resultFilter, sortBy]);

  // Get count by upload status
  const uploadedVideos = allVideos.filter(v => v.videoUploadStatus === 'completed').length;
  const pendingVideos = allVideos.filter(v => v.videoUploadStatus === 'pending' || v.videoUploadStatus === 'uploading').length;

  // Video navigation
  const currentVideoIndex = selectedVideo
    ? filteredVideos.findIndex(v => v.sessionId === selectedVideo.sessionId && v.jumpIndex === selectedVideo.jumpIndex)
    : -1;

  const goToPreviousVideo = () => {
    if (currentVideoIndex > 0) {
      setSelectedVideo(filteredVideos[currentVideoIndex - 1]);
    }
  };

  const goToNextVideo = () => {
    if (currentVideoIndex < filteredVideos.length - 1) {
      setSelectedVideo(filteredVideos[currentVideoIndex + 1]);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedVideo) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPreviousVideo();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNextVideo();
      } else if (e.key === 'Escape') {
        setSelectedVideo(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedVideo, currentVideoIndex, filteredVideos]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="secondary">
                <Video className="mr-2 h-4 w-4" />
                Video Library
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Training Videos
            </h1>
            <p className="text-gray-600 mt-1">
              Watch and analyze all your pole vault training videos
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 text-center">
              <div className="text-xl font-bold text-purple-600">{allVideos.length}</div>
              <div className="text-xs text-gray-600">Total Videos</div>
            </div>
            <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 text-center">
              <div className="text-xl font-bold text-green-600">{uploadedVideos}</div>
              <div className="text-xs text-gray-600">Available</div>
            </div>
            <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 text-center">
              <div className="text-xl font-bold text-yellow-600">{pendingVideos}</div>
              <div className="text-xs text-gray-600">Pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by location, height, pole, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-3">
            <Select value={resultFilter} onValueChange={setResultFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Results" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="make">Makes Only</SelectItem>
                <SelectItem value="miss">Misses Only</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest First</SelectItem>
                <SelectItem value="lowest">Lowest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {(searchTerm || resultFilter !== 'all') && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Showing {filteredVideos.length} of {allVideos.length} videos
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setResultFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Video Grid */}
      {filteredVideos.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            {allVideos.length === 0 ? (
              <>
                <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No training videos yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start recording jumps in your mobile app to build your video library
                </p>
              </>
            ) : (
              <>
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No videos match your filters
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setResultFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video, index) => (
            <Card
              key={`${video.sessionId}-${video.jumpIndex}`}
              className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              onClick={() => setSelectedVideo(video)}
            >
              {/* Thumbnail */}
              <div className="relative bg-gray-900 aspect-video">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={`Jump ${formatHeight(video.height, video.barUnits)}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="h-12 w-12 text-gray-600" />
                  </div>
                )}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-40 transition-colors">
                  <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    <Play className="h-6 w-6 text-gray-900 ml-1" />
                  </div>
                </div>

                {/* Upload Status Badge */}
                {video.videoUploadStatus && video.videoUploadStatus !== 'completed' && (
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant="secondary"
                      className={
                        video.videoUploadStatus === 'uploading' ? 'bg-blue-600 text-white' :
                        video.videoUploadStatus === 'pending' ? 'bg-yellow-600 text-white' :
                        'bg-red-600 text-white'
                      }
                    >
                      {video.videoUploadStatus === 'uploading' ? 'Uploading' :
                       video.videoUploadStatus === 'pending' ? 'Pending' :
                       'Failed'}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Video Info */}
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-gray-900">
                    {formatHeight(video.height, video.barUnits)}
                  </span>
                  {video.sessionType?.toLowerCase() !== 'training' && (
                    video.result === 'make' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )
                  )}
                </div>

                {video.rating && (
                  <Badge
                    variant="secondary"
                    className="mb-2"
                    style={{
                      backgroundColor: `${ratingColors[video.rating]}20`,
                      color: ratingColors[video.rating]
                    }}
                  >
                    {ratingLabels[video.rating] || video.rating}
                  </Badge>
                )}

                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(video.sessionDate)}</span>
                  </div>
                  {video.sessionLocation && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{video.sessionLocation}</span>
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    {getPoleDisplayName(video.pole, poles)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <Card
            className="max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {formatHeight(selectedVideo.height, selectedVideo.barUnits)} - {formatDate(selectedVideo.sessionDate)}
                </h3>
                <Button variant="ghost" onClick={() => setSelectedVideo(null)}>
                  ×
                </Button>
              </div>

              {/* Video Player with Navigation */}
              <div className="mb-4 relative">
                {/* Previous Button */}
                {currentVideoIndex > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToPreviousVideo}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full h-12 w-12"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                )}

                {/* Next Button */}
                {currentVideoIndex < filteredVideos.length - 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToNextVideo}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full h-12 w-12"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                )}

                <div className="bg-black rounded-lg overflow-hidden">
                {selectedVideo.videoUrl && selectedVideo.videoUrl.startsWith('https://') ? (
                  <video
                    controls
                    className="w-full h-auto max-h-[60vh]"
                    preload="metadata"
                    playsInline
                  >
                    <source src={selectedVideo.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : selectedVideo.videoLocalUri && selectedVideo.videoLocalUri.startsWith('https://') ? (
                  <video
                    controls
                    className="w-full h-auto max-h-[60vh]"
                    preload="metadata"
                    playsInline
                  >
                    <source src={selectedVideo.videoLocalUri} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="p-8 text-center text-white">
                    <Video className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-300 mb-2">Video not available</p>
                    <p className="text-sm text-gray-400">
                      This video is stored locally on your mobile device and hasn't been uploaded to the cloud yet.
                    </p>
                  </div>
                )}
                </div>
              </div>

              {/* Video Counter */}
              <div className="text-center text-sm text-gray-600 mb-4">
                Video {currentVideoIndex + 1} of {filteredVideos.length}
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                {/* Only show Result for competition sessions */}
                {selectedVideo.sessionType?.toLowerCase().includes('competition') && (
                  <div className="flex-1 min-w-[150px]">
                    <div className="text-sm font-medium text-gray-900 mb-1">Result</div>
                    <div className="flex items-center gap-2">
                      {selectedVideo.result === 'make' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="capitalize">{selectedVideo.result || 'Unknown'}</span>
                    </div>
                  </div>
                )}
                <div className="flex-1 min-w-[150px]">
                  <div className="text-sm font-medium text-gray-900 mb-1">Equipment</div>
                  <div className="text-sm text-gray-600">{getPoleDisplayName(selectedVideo.pole, poles)}</div>
                </div>
                {selectedVideo.rating && (
                  <div className="flex-1 min-w-[150px]">
                    <div className="text-sm font-medium text-gray-900 mb-1">Rating</div>
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: `${ratingColors[selectedVideo.rating]}20`,
                        color: ratingColors[selectedVideo.rating]
                      }}
                    >
                      {ratingLabels[selectedVideo.rating] || selectedVideo.rating}
                    </Badge>
                  </div>
                )}
              </div>

              {selectedVideo.notes && (
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-900 mb-1">Notes</div>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border">
                    {selectedVideo.notes}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VaultVideos;
