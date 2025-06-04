
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { VideoExercise } from '@/data/videoLibraryData';

interface VideoCardProps {
  exercise: VideoExercise;
  onClick: () => void;
}

const VideoCard = ({ exercise, onClick }: VideoCardProps) => {
  const getDifficultyDots = (difficulty: number) => {
    return Array.from({ length: 3 }, (_, i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full ${
          i < difficulty ? 'bg-primary' : 'bg-gray-300'
        }`}
      />
    ));
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Warm-up': 'bg-green-100 text-green-800',
      'Strength': 'bg-blue-100 text-blue-800',
      'Rehab': 'bg-purple-100 text-purple-800',
      'PVD': 'bg-red-100 text-red-800',
      'Med Ball': 'bg-orange-100 text-orange-800',
      'Gym': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div
      onClick={onClick}
      className="feature-card cursor-pointer group"
    >
      {/* Thumbnail placeholder */}
      <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
          <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
        </div>
      </div>

      {/* Category badge with compact padding */}
      <Badge className={`mb-3 px-1.5 py-0.5 ${getCategoryColor(exercise.category)}`}>
        {exercise.category}
      </Badge>

      {/* Title */}
      <h3 className="text-lg font-semibold text-secondary mb-2 group-hover:text-primary transition-colors">
        {exercise.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {exercise.description}
      </p>

      {/* Footer with difficulty and duration */}
      <div className="flex items-center justify-between mt-auto">
        {/* Difficulty dots */}
        <div className="flex items-center gap-1">
          {getDifficultyDots(exercise.difficulty)}
        </div>

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
