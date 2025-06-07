
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, X, Download, Eye } from 'lucide-react';
import { VideoSubmissionWithProfile } from '@/hooks/useVideoSubmissions';

interface SubmissionCardProps {
  submission: VideoSubmissionWithProfile;
  onApprove: () => void;
  onReject: () => void;
  onDownload: () => void;
  onPreview: () => void;
}

const SubmissionCard = ({ 
  submission, 
  onApprove, 
  onReject, 
  onDownload, 
  onPreview 
}: SubmissionCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

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
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header with status */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold truncate">{submission.video_file_name}</h3>
              <p className="text-sm text-gray-600">{getUserDisplayName()}</p>
              <p className="text-xs text-gray-500">{submission.user_email}</p>
            </div>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(submission.submission_status)}`}>
              {getStatusIcon(submission.submission_status)}
              {submission.submission_status.charAt(0).toUpperCase() + submission.submission_status.slice(1)}
            </span>
          </div>

          {/* Video info */}
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Size:</span> {formatFileSize(submission.video_file_size)}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Uploaded:</span> {formatDate(submission.created_at)}
            </div>
            {submission.submitted_at && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Submitted:</span> {formatDate(submission.submitted_at)}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              size="sm"
              variant="outline"
              onClick={onPreview}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onDownload}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>

          {/* Approval actions */}
          {submission.submission_status === 'pending' && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="default"
                onClick={onApprove}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={onReject}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionCard;
