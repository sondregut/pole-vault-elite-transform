import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Plus, X } from 'lucide-react';
import { generateVideoThumbnail } from '@/utils/videoThumbnailGenerator';

const categories = ['Warm-up', 'Strength', 'Rehab', 'PVD', 'Med Ball', 'Gym'] as const;

interface VideoFormData {
  title: string;
  description: string;
  category: string;
  difficulty: number;
  duration: string;
  instructions: string[];
  key_points: string[];
  equipment: string[];
  target_muscles: string[];
}

const VideoUploadForm = ({ onVideoUploaded }: { onVideoUploaded: () => void }) => {
  const [formData, setFormData] = useState<VideoFormData>({
    title: '',
    description: '',
    category: '',
    difficulty: 1,
    duration: '',
    instructions: [''],
    key_points: [''],
    equipment: [''],
    target_muscles: ['']
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleArrayFieldChange = (field: keyof Pick<VideoFormData, 'instructions' | 'key_points' | 'equipment' | 'target_muscles'>, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field: keyof Pick<VideoFormData, 'instructions' | 'key_points' | 'equipment' | 'target_muscles'>) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field: keyof Pick<VideoFormData, 'instructions' | 'key_points' | 'equipment' | 'target_muscles'>, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const uploadFile = async (file: File, bucket: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const uploadBlob = async (blob: Blob, bucket: string, fileName: string): Promise<string | null> => {
    const filePath = fileName;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, blob);

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile) {
      toast.error('Please select a video file');
      return;
    }

    setUploading(true);

    try {
      // Upload video file
      const videoUrl = await uploadFile(videoFile, 'videos');
      if (!videoUrl) throw new Error('Failed to upload video');

      // Generate and upload thumbnail automatically
      let thumbnailUrl = null;
      try {
        const thumbnailBlob = await generateVideoThumbnail(videoFile);
        const thumbnailFileName = `${Date.now()}.jpg`;
        thumbnailUrl = await uploadBlob(thumbnailBlob, 'thumbnails', thumbnailFileName);
      } catch (thumbnailError) {
        console.warn('Failed to generate thumbnail:', thumbnailError);
        // Continue without thumbnail - video will use first frame as fallback
      }

      // Filter out empty strings from arrays
      const cleanedData = {
        ...formData,
        instructions: formData.instructions.filter(item => item.trim() !== ''),
        key_points: formData.key_points.filter(item => item.trim() !== ''),
        equipment: formData.equipment.filter(item => item.trim() !== ''),
        target_muscles: formData.target_muscles.filter(item => item.trim() !== '')
      };

      // Insert video record
      const { error } = await supabase
        .from('videos')
        .insert({
          ...cleanedData,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          file_size: videoFile.size,
          file_type: videoFile.type
        });

      if (error) throw error;

      toast.success('Video uploaded successfully with auto-generated thumbnail!');
      onVideoUploaded();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        difficulty: 1,
        duration: '',
        instructions: [''],
        key_points: [''],
        equipment: [''],
        target_muscles: ['']
      });
      setVideoFile(null);

    } catch (error: any) {
      console.error('Error uploading video:', error);
      toast.error(error.message || 'Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Upload New Video</CardTitle>
        <p className="text-sm text-gray-600">Thumbnails will be automatically generated from your video</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                placeholder="e.g., 10:30"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty (1-3)</Label>
              <Select value={formData.difficulty.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: parseInt(value) }))}>
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
          </div>

          {/* Video File Upload */}
          <div>
            <Label htmlFor="video">Video File</Label>
            <Input
              id="video"
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              required
              className="mt-2"
            />
            {videoFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(1)} MB)
              </p>
            )}
          </div>

          {/* Array Fields */}
          {(['instructions', 'key_points', 'equipment', 'target_muscles'] as const).map(field => (
            <div key={field}>
              <Label className="capitalize">{field.replace('_', ' ')}</Label>
              {formData[field].map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={item}
                    onChange={(e) => handleArrayFieldChange(field, index, e.target.value)}
                    placeholder={`Enter ${field.replace('_', ' ').slice(0, -1)}`}
                  />
                  {formData[field].length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayField(field, index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayField(field)}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {field.replace('_', ' ').slice(0, -1)}
              </Button>
            </div>
          ))}

          <Button type="submit" disabled={uploading} className="w-full">
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload Video'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VideoUploadForm;
