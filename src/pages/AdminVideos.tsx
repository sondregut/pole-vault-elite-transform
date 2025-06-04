
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoUploadForm from '@/components/admin/VideoUploadForm';
import { useVideos } from '@/hooks/useVideos';
import { Loader2, Lock, Video, Upload } from 'lucide-react';

const AdminVideos = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { videos, loading: videosLoading, refetch } = useVideos();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white">
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
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="section-padding py-20">
          <div className="text-center">
            <Lock className="mx-auto h-12 w-12 text-gray-400" />
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Authentication Required</h1>
            <p className="mt-2 text-gray-600">Please sign in to access the admin panel.</p>
          </div>
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="section-padding py-20">
          <div className="text-center">
            <Lock className="mx-auto h-12 w-12 text-gray-400" />
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Access Denied</h1>
            <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="section-padding py-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Video Management</h1>
            <p className="mt-2 text-gray-600">Upload and manage videos for the video library</p>
          </div>

          <Tabs defaultValue="upload" className="space-y-6">
            <TabsList>
              <TabsTrigger value="upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload Video
              </TabsTrigger>
              <TabsTrigger value="manage">
                <Video className="mr-2 h-4 w-4" />
                Manage Videos ({videos.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <VideoUploadForm onVideoUploaded={refetch} />
            </TabsContent>

            <TabsContent value="manage">
              <Card>
                <CardHeader>
                  <CardTitle>Existing Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  {videosLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                      <p className="mt-2 text-gray-600">Loading videos...</p>
                    </div>
                  ) : videos.length === 0 ? (
                    <div className="text-center py-8">
                      <Video className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-4 text-gray-600">No videos uploaded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {videos.map(video => (
                        <div key={video.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium">{video.title}</h3>
                            <p className="text-sm text-gray-600">{video.category} • Difficulty {video.difficulty} • {video.duration}</p>
                            <p className="text-sm text-gray-500 mt-1">{video.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm">
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminVideos;
