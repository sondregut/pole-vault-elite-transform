import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface VideoSubmissionWithProfile {
  id: string;
  video_file_name: string;
  video_file_size: number | null;
  submission_status: string;
  created_at: string;
  submitted_at: string | null;
  video_url: string | null;
  user_id: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  user_email?: string;
}

export const useVideoSubmissions = () => {
  const [submissions, setSubmissions] = useState<VideoSubmissionWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get submissions first
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('video_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (submissionsError) throw submissionsError;

      // Get profiles separately to avoid join issues
      const userIds = submissionsData?.map(s => s.user_id) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Combine the data manually
      const submissionsWithProfiles = (submissionsData || []).map(submission => ({
        ...submission,
        profiles: profilesData?.find(profile => profile.id === submission.user_id) || null,
        user_email: `user-${submission.user_id.slice(0, 8)}@placeholder.com` // Placeholder email
      }));

      setSubmissions(submissionsWithProfiles);
    } catch (err: any) {
      console.error('Error fetching video submissions:', err);
      setError(err.message || 'Failed to fetch video submissions');
      toast.error('Failed to load video submissions');
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (submissionId: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      const { error } = await supabase
        .from('video_submissions')
        .update({ submission_status: status })
        .eq('id', submissionId);

      if (error) throw error;

      // Update local state
      setSubmissions(prev => 
        prev.map(submission => 
          submission.id === submissionId 
            ? { ...submission, submission_status: status }
            : submission
        )
      );

      toast.success(`Submission ${status} successfully`);
    } catch (err: any) {
      console.error('Error updating submission status:', err);
      toast.error(err.message || 'Failed to update submission status');
    }
  };

  const downloadVideo = async (submission: VideoSubmissionWithProfile) => {
    if (!submission.video_url) {
      toast.error('No video URL available');
      return;
    }

    try {
      // Extract file path from URL for Supabase storage download
      const url = new URL(submission.video_url);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const filePath = `${submission.user_id}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('video-submissions')
        .download(filePath);

      if (error) throw error;

      // Create download link
      const blob = new Blob([data]);
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = submission.video_file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      toast.success('Video downloaded successfully');
    } catch (err: any) {
      console.error('Error downloading video:', err);
      toast.error(err.message || 'Failed to download video');
    }
  };

  useEffect(() => {
    fetchSubmissions();

    // Set up real-time subscription
    const channel = supabase
      .channel('video-submissions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'video_submissions'
        },
        () => {
          fetchSubmissions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    submissions,
    loading,
    error,
    refetch: fetchSubmissions,
    updateSubmissionStatus,
    downloadVideo
  };
};
