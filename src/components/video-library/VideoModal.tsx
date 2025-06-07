
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Clock } from 'lucide-react';
import { Video } from '@/hooks/useVideos';

interface VideoModalProps {
  exercise: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

const VideoModal = ({ exercise, isOpen, onClose }: VideoModalProps) => {
  if (!exercise) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="text-sm font-medium text-gray-600">
              {exercise.category}
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
            {exercise.video_url ? (
              <video
                controls
                className="w-full h-full rounded-lg"
                poster={exercise.thumbnail_url}
              >
                <source src={exercise.video_url} type={exercise.file_type || 'video/mp4'} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-0 h-0 border-l-6 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1"></div>
                </div>
                <p className="text-gray-600 mb-2">Video coming soon</p>
                <p className="text-sm text-gray-500">This exercise video will be available shortly</p>
              </div>
            )}
          </div>

          {/* Information Grid */}
          <div className="space-y-6">
            {/* Instructions */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-secondary">
                Instructions
              </h3>
              <ol className="space-y-1 text-gray-700">
                {exercise.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-gray-400 font-medium min-w-[1.5rem]">
                      {index + 1}.
                    </span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Key Points */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-secondary">
                Key Points
              </h3>
              <ul className="space-y-1 text-gray-700">
                {exercise.key_points.map((point, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-gray-400">–</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Equipment and Target Muscles in a row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Equipment */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-secondary">
                  Equipment
                </h3>
                <div className="text-gray-700">
                  {exercise.equipment.join(', ')}
                </div>
              </div>

              {/* Target Muscles */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-secondary">
                  Target Muscles
                </h3>
                <div className="text-gray-700">
                  {exercise.target_muscles.join(', ')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
