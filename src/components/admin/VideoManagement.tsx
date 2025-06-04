
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useVideos } from '@/hooks/useVideos';
import VideoForm from './VideoForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Video } from '@/hooks/useVideos';

const VideoManagement = () => {
  const { videos, loading, refetch } = useVideos();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [deletingVideo, setDeletingVideo] = useState<Video | null>(null);

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setIsFormOpen(true);
  };

  const handleDelete = async (video: Video) => {
    try {
      // Delete video file from storage if it exists
      if (video.video_url) {
        const fileName = video.video_url.split('/').pop();
        if (fileName) {
          await supabase.storage.from('videos').remove([fileName]);
        }
      }

      // Delete thumbnail from storage if it exists
      if (video.thumbnail_url) {
        const fileName = video.thumbnail_url.split('/').pop();
        if (fileName) {
          await supabase.storage.from('thumbnails').remove([fileName]);
        }
      }

      // Delete video record from database
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', video.id);

      if (error) throw error;

      toast.success('Video deleted successfully');
      refetch();
    } catch (error: any) {
      console.error('Error deleting video:', error);
      toast.error('Failed to delete video');
    } finally {
      setDeletingVideo(null);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingVideo(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    refetch();
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading videos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-secondary">Video Management</h2>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Video
        </Button>
      </div>

      <div className="grid gap-4">
        {videos.map((video) => (
          <div key={video.id} className="border rounded-lg p-4 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{video.title}</h3>
              <p className="text-gray-600 text-sm">{video.description}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <span>Category: {video.category}</span>
                <span>Duration: {video.duration}</span>
                <span>Difficulty: {video.difficulty}/3</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(video)}
                className="flex items-center gap-1"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeletingVideo(video)}
                className="flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No videos found.</p>
          <Button onClick={() => setIsFormOpen(true)} className="mt-4">
            Add your first video
          </Button>
        </div>
      )}

      {/* Video Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={handleFormClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingVideo ? 'Edit Video' : 'Add New Video'}
            </DialogTitle>
          </DialogHeader>
          <VideoForm
            video={editingVideo}
            onSuccess={handleFormSuccess}
            onCancel={handleFormClose}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!deletingVideo} 
        onOpenChange={() => setDeletingVideo(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingVideo?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingVideo && handleDelete(deletingVideo)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VideoManagement;
