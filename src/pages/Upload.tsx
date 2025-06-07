import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Loader2, Upload as UploadIcon, Video, CheckCircle, Clock, X, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface VideoSubmission {
  id: string;
  video_file_name: string;
  video_file_size: number | null;
  submission_status: string;
  created_at: string;
  submitted_at: string | null;
  video_url: string | null;
}

const Upload = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submissions, setSubmissions] = useState<VideoSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [deletingSubmission, setDeletingSubmission] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Load user's previous submissions
  useEffect(() => {
    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  // Clean up video preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('video_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSubmissions(data || []);
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load your submissions');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    // Clean up previous preview URL
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    
    setVideoFile(file);
    
    // Create preview URL for the new file
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(previewUrl);
    } else {
      setVideoPreviewUrl(null);
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('video-submissions')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from('video-submissions')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile) {
      toast.error('Please select a video file');
      return;
    }

    if (!user) {
      toast.error('You must be signed in to upload videos');
      return;
    }

    setUploading(true);

    try {
      // Upload video file
      const videoUrl = await uploadFile(videoFile);
      if (!videoUrl) throw new Error('Failed to upload video');

      // Insert submission record
      const { error } = await supabase
        .from('video_submissions')
        .insert({
          user_id: user.id,
          video_url: videoUrl,
          video_file_name: videoFile.name,
          video_file_size: videoFile.size,
          submission_status: 'pending'
        });

      if (error) throw error;

      toast.success('Video uploaded successfully! We\'ll review it soon.');
      
      // Reset form and refresh submissions
      setVideoFile(null);
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
        setVideoPreviewUrl(null);
      }
      const fileInput = document.getElementById('video') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      fetchSubmissions();

    } catch (error: any) {
      console.error('Error uploading video:', error);
      toast.error(error.message || 'Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitForReview = () => {
    navigate('/submission-thank-you');
  };

  const handleDeleteSubmission = async (submission: VideoSubmission) => {
    if (!confirm(`Are you sure you want to delete "${submission.video_file_name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingSubmission(submission.id);

    try {
      // Delete video file from storage if it exists
      if (submission.video_url) {
        // Extract file path from URL
        const url = new URL(submission.video_url);
        const pathParts = url.pathname.split('/');
        const fileName = pathParts[pathParts.length - 1];
        const filePath = `${user?.id}/${fileName}`;

        const { error: storageError } = await supabase.storage
          .from('video-submissions')
          .remove([filePath]);

        if (storageError) {
          console.error('Error deleting file from storage:', storageError);
          // Continue with database deletion even if storage deletion fails
        }
      }

      // Delete submission record from database
      const { error } = await supabase
        .from('video_submissions')
        .delete()
        .eq('id', submission.id);

      if (error) throw error;

      toast.success('Video submission deleted successfully');
      fetchSubmissions(); // Refresh the list

    } catch (error: any) {
      console.error('Error deleting submission:', error);
      toast.error(error.message || 'Failed to delete submission');
    } finally {
      setDeletingSubmission(null);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="section-padding py-20">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="section-padding py-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Upload Video</h1>
            <p className="mt-2 text-gray-600">Submit your video for review</p>
            <p className="mt-1 text-sm text-blue-600">Submitting as: {user.email}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UploadIcon className="h-5 w-5" />
                  Upload New Video
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="video">Video File</Label>
                    <Input
                      id="video"
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      required
                      className="mt-2"
                    />
                    {videoFile && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected: {videoFile.name} ({formatFileSize(videoFile.size)})
                      </p>
                    )}
                  </div>

                  {/* Video Preview */}
                  {videoPreviewUrl && (
                    <div>
                      <Label>Preview</Label>
                      <div className="mt-2 border rounded-lg overflow-hidden bg-black">
                        <video
                          src={videoPreviewUrl}
                          controls
                          className="w-full max-h-64 object-contain"
                          preload="metadata"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                  )}

                  <Button type="submit" disabled={uploading || !videoFile} className="w-full">
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <UploadIcon className="mr-2 h-4 w-4" />
                        Upload Video
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Previous Submissions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Your Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingSubmissions ? (
                  <div className="text-center py-8">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    <p className="mt-2 text-gray-600">Loading submissions...</p>
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="text-center py-8">
                    <Video className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-gray-600">No submissions yet</p>
                    <p className="text-sm text-gray-500">Upload your first video to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {submissions.map(submission => (
                      <div key={submission.id} className="flex items-start justify-between p-4 border rounded-lg bg-white">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{submission.video_file_name}</h3>
                          <p className="text-sm text-gray-600">
                            {formatFileSize(submission.video_file_size)} • {formatDate(submission.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(submission.submission_status)}
                            <span className="text-sm capitalize font-medium">
                              {submission.submission_status}
                            </span>
                          </div>
                          {/* Delete button - only show for pending/rejected submissions */}
                          {(submission.submission_status === 'pending' || submission.submission_status === 'rejected') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSubmission(submission)}
                              disabled={deletingSubmission === submission.id}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                            >
                              {deletingSubmission === submission.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Submit for Review Button */}
                {submissions.length > 0 && (
                  <div className="mt-6 pt-4 border-t">
                    <Button 
                      onClick={handleSubmitForReview}
                      className="w-full"
                      variant="cta"
                    >
                      Submit for Review
                    </Button>
                    <p className="mt-2 text-xs text-gray-500 text-center">
                      Click to submit all your videos for review
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;
