
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Video {
  id: string;
  title: string;
  category: 'Warm-up' | 'Strength' | 'Rehab' | 'PVD' | 'Med Ball' | 'Gym';
  description: string;
  difficulty: 1 | 2 | 3;
  duration: string;
  video_url?: string;
  thumbnail_url?: string;
  file_size?: number;
  file_type?: string;
  instructions: string[];
  key_points: string[];
  equipment: string[];
  target_muscles: string[];
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export const useVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Type cast the data to ensure it matches our Video interface
      const typedVideos: Video[] = (data || []).map(video => ({
        ...video,
        category: video.category as Video['category'],
        difficulty: video.difficulty as Video['difficulty'],
        instructions: video.instructions || [],
        key_points: video.key_points || [],
        equipment: video.equipment || [],
        target_muscles: video.target_muscles || []
      }));

      setVideos(typedVideos);
    } catch (err: any) {
      console.error('Error fetching videos:', err);
      setError(err.message || 'Failed to fetch videos');
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return {
    videos,
    loading,
    error,
    refetch: fetchVideos
  };
};
