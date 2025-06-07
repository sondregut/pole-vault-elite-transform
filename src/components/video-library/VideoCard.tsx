
import React from 'react';
import { Clock } from 'lucide-react';
import { Video } from '@/hooks/useVideos';

interface VideoCardProps {
  exercise: Video;
  onClick: () => void;
}

const VideoCard = ({ exercise, onClick }: VideoCardProps) => {
  return (
    <div
      onClick={onClick}
      className="feature-card cursor-pointer group"
    >
      {/* Thumbnail - show thumbnail, video preview, or placeholder */}
      <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
        {exercise.thumbnail_url ? (
          <img 
            src={exercise.thumbnail_url} 
            alt={exercise.title}
            className="w-full h-full object-cover"
          />
        ) : exercise.video_url ? (
          <video 
            src={exercise.video_url}
            className="w-full h-full object-cover"
            muted
            preload="metadata"
          />
        ) : (
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
          </div>
        )}
      </div>

      {/* Category text only */}
      <div className="text-sm font-medium mb-3 text-gray-600">
        {exercise.category}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-secondary mb-2 group-hover:text-primary transition-colors">
        {exercise.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {exercise.description}
      </p>

      {/* Footer with duration only */}
      <div className="flex items-center justify-end mt-auto">
        {/* Duration */}
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <Clock className="w-4 h-4" />
          <span>{exercise.duration}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
