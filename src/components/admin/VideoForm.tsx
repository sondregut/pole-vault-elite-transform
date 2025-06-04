
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';
import type { Video } from '@/hooks/useVideos';

interface VideoFormProps {
  video?: Video | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const categories = ['Warm-up', 'Strength', 'Rehab', 'PVD', 'Med Ball', 'Gym'] as const;

const VideoForm = ({ video, onSuccess, onCancel }: VideoFormProps) => {
  const [formData, setFormData] = useState({
    title: video?.title || '',
    description: video?.description || '',
    category: video?.category || '',
    difficulty: video?.difficulty || 1,
    duration: video?.duration || '',
    instructions: video?.instructions || [''],
    key_points: video?.key_points || [''],
    equipment: video?.equipment || [''],
    target_muscles: video?.target_muscles || ['']
  });
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].map((item: string, i: number) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field as keyof typeof prev], '']
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].filter((_: string, i: number) => i !== index)
    }));
  };

  const uploadFile = async (file: File, bucket: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let videoUrl = video?.video_url || null;
      let thumbnailUrl = video?.thumbnail_url || null;

      // Upload video file if selected
      if (videoFile) {
        videoUrl = await uploadFile(videoFile, 'videos');
      }

      // Upload thumbnail if selected
      if (thumbnailFile) {
        thumbnailUrl = await uploadFile(thumbnailFile, 'thumbnails');
      }

      // Filter out empty strings from arrays
      const cleanedData = {
        ...formData,
        instructions: formData.instructions.filter(item => item.trim() !== ''),
        key_points: formData.key_points.filter(item => item.trim() !== ''),
        equipment: formData.equipment.filter(item => item.trim() !== ''),
        target_muscles: formData.target_muscles.filter(item => item.trim() !== ''),
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        file_size: videoFile?.size || video?.file_size || null,
        file_type: videoFile?.type || video?.file_type || null
      };

      if (video) {
        // Update existing video
        const { error } = await supabase
          .from('videos')
          .update(cleanedData)
          .eq('id', video.id);

        if (error) throw error;
        toast.success('Video updated successfully');
      } else {
        // Create new video
        const { error } = await supabase
          .from('videos')
          .insert([cleanedData]);

        if (error) throw error;
        toast.success('Video created successfully');
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving video:', error);
      toast.error('Failed to save video');
    } finally {
      setUploading(false);
    }
  };

  const renderArrayField = (field: string, label: string, placeholder: string) => {
    const items = formData[field as keyof typeof formData] as string[];
    
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => handleArrayChange(field, index, e.target.value)}
              placeholder={placeholder}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeArrayItem(field, index)}
              disabled={items.length === 1}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addArrayItem(field)}
          className="w-full"
        >
          Add {label.slice(0, -1)}
        </Button>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty *</Label>
          <Select 
            value={formData.difficulty.toString()} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: parseInt(value) as 1 | 2 | 3 }))}
            required
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Beginner</SelectItem>
              <SelectItem value="2">2 - Intermediate</SelectItem>
              <SelectItem value="3">3 - Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration *</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
            placeholder="e.g., 5 min"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Video File</Label>
          <div className="flex gap-2">
            <Input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => videoInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {videoFile ? videoFile.name : 'Choose Video'}
            </Button>
          </div>
          {video?.video_url && !videoFile && (
            <p className="text-sm text-gray-500">Current video will be kept</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Thumbnail</Label>
          <div className="flex gap-2">
            <Input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => thumbnailInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {thumbnailFile ? thumbnailFile.name : 'Choose Thumbnail'}
            </Button>
          </div>
          {video?.thumbnail_url && !thumbnailFile && (
            <p className="text-sm text-gray-500">Current thumbnail will be kept</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {renderArrayField('instructions', 'Instructions', 'Enter instruction step')}
        {renderArrayField('key_points', 'Key Points', 'Enter key point')}
        {renderArrayField('equipment', 'Equipment', 'Enter equipment needed')}
        {renderArrayField('target_muscles', 'Target Muscles', 'Enter target muscle')}
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={uploading}
          className="flex-1"
        >
          {uploading ? 'Saving...' : (video ? 'Update Video' : 'Create Video')}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default VideoForm;
