import React from 'react';
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

  const getCategoryStyle = (category: string) => {
    const styles = {
      'Warm-up': 'bg-green-50 text-green-700 border-green-200',
      'Strength': 'bg-blue-50 text-blue-700 border-blue-200',
      'Rehab': 'bg-purple-50 text-purple-700 border-purple-200',
      'PVD': 'bg-red-50 text-red-700 border-red-200',
      'Med Ball': 'bg-orange-50 text-orange-700 border-orange-200',
      'Gym': 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return styles[category as keyof typeof styles] || 'bg-gray-50 text-gray-700 border-gray-200';
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

      {/* Category pill button */}
      <div 
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium mb-3 shadow-sm ${getCategoryStyle(exercise.category)}`}
      >
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