
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, X, Download } from 'lucide-react';
import { VideoSubmissionWithProfile } from '@/hooks/useVideoSubmissions';

interface VideoPreviewModalProps {
  submission: VideoSubmissionWithProfile | null;
  open: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDownload: () => void;
}

const VideoPreviewModal = ({
  submission,
  open,
  onClose,
  onApprove,
  onReject,
  onDownload
}: VideoPreviewModalProps) => {
  if (!submission) return null;

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserDisplayName = () => {
    const profile = submission.profiles;
    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
    return submission.user_email || 'Unknown User';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{submission.video_file_name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Video player */}
          {submission.video_url && (
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video
                src={submission.video_url}
                controls
                className="w-full h-full object-contain"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* Submission details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Submission Details</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">File Name:</span>
                  <p className="text-gray-600">{submission.video_file_name}</p>
                </div>
                <div>
                  <span className="font-medium">File Size:</span>
                  <p className="text-gray-600">{formatFileSize(submission.video_file_size)}</p>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <p className="text-gray-600 capitalize">{submission.submission_status}</p>
                </div>
                <div>
                  <span className="font-medium">Uploaded:</span>
                  <p className="text-gray-600">{formatDate(submission.created_at)}</p>
                </div>
                {submission.submitted_at && (
                  <div>
                    <span className="font-medium">Submitted:</span>
                    <p className="text-gray-600">{formatDate(submission.submitted_at)}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">User Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Name:</span>
                  <p className="text-gray-600">{getUserDisplayName()}</p>
                </div>
                <div>
                  <span className="font-medium">Email:</span>
                  <p className="text-gray-600">{submission.user_email}</p>
                </div>
                <div>
                  <span className="font-medium">User ID:</span>
                  <p className="text-gray-600 text-sm font-mono">{submission.user_id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <Button
              variant="outline"
              onClick={onDownload}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            
            {submission.submission_status === 'pending' && (
              <>
                <Button
                  onClick={onApprove}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={onReject}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPreviewModal;
