import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Clock, CheckCircle, Package, Target } from 'lucide-react';
import { VideoExercise } from '@/data/videoLibraryData';

interface VideoModalProps {
  exercise: VideoExercise | null;
  isOpen: boolean;
  onClose: () => void;
}

const VideoModal = ({ exercise, isOpen, onClose }: VideoModalProps) => {
  if (!exercise) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div 
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium shadow-sm ${getCategoryStyle(exercise.category)}`}
            >
              {exercise.category}
            </div>
            <div className="flex items-center gap-1">
              {getDifficultyDots(exercise.difficulty)}
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Clock className="w-4 h-4" />
              <span>{exercise.duration}</span>
            </div>
          </div>
          <DialogTitle className="text-2xl">{exercise.title}</DialogTitle>
          <p className="text-gray-600">{exercise.description}</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Video Section */}
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-0 h-0 border-l-6 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1"></div>
              </div>
              <p className="text-gray-600 mb-2">Video Player</p>
              <a
                href={`https://youtube.com/watch?v=${exercise.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Watch on YouTube
              </a>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Instructions */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-secondary flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Step-by-Step Instructions
              </h3>
              <ol className="space-y-2">
                {exercise.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Key Points */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-secondary flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Key Points
              </h3>
              <ul className="space-y-2">
                {exercise.keyPoints.map((point, index) => (
                  <li key={index} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Equipment */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-secondary flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Equipment Needed
              </h3>
              <ul className="space-y-1">
                {exercise.equipment.map((item, index) => (
                  <li key={index} className="flex gap-2 items-center">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Target Muscles */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-secondary flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Target Muscles
              </h3>
              <ul className="space-y-1">
                {exercise.targetMuscles.map((muscle, index) => (
                  <li key={index} className="flex gap-2 items-center">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-gray-700">{muscle}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;