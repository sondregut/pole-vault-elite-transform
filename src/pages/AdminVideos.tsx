
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import VideoUploadForm from '@/components/admin/VideoUploadForm';
import SubmissionCard from '@/components/admin/SubmissionCard';
import VideoPreviewModal from '@/components/admin/VideoPreviewModal';
import SubmissionStats from '@/components/admin/SubmissionStats';
import { useVideos } from '@/hooks/useVideos';
import { useVideoSubmissions, VideoSubmissionWithProfile } from '@/hooks/useVideoSubmissions';
import { Loader2, Lock, Video, Upload, Users, Search } from 'lucide-react';

const AdminVideos = () => {
  const { user, loading: authLoading } = useAuth();
  const { videos, loading: videosLoading, refetch } = useVideos();
  const { submissions, loading: submissionsLoading, updateSubmissionStatus, downloadVideo } = useVideoSubmissions();
  
  const [selectedSubmission, setSelectedSubmission] = useState<VideoSubmissionWithProfile | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter submissions based on search and status
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.video_file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (submission.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (submission.profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || submission.submission_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handlePreview = (submission: VideoSubmissionWithProfile) => {
    setSelectedSubmission(submission);
    setPreviewModalOpen(true);
  };

  const handleApprove = async (submissionId: string) => {
    await updateSubmissionStatus(submissionId, 'approved');
    setPreviewModalOpen(false);
  };

  const handleReject = async (submissionId: string) => {
    await updateSubmissionStatus(submissionId, 'rejected');
    setPreviewModalOpen(false);
  };

  const handleDownload = async (submission: VideoSubmissionWithProfile) => {
    await downloadVideo(submission);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="section-padding py-20">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-gray-600">Loading authentication...</p>
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
            <p className="mt-2 text-gray-600">Please sign in to access the video management panel.</p>
            <Button asChild className="mt-4">
              <a href="/auth">Sign In</a>
            </Button>
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
            <p className="mt-1 text-sm text-blue-600">✓ Access granted for {user.email}</p>
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
              <TabsTrigger value="submissions">
                <Users className="mr-2 h-4 w-4" />
                User Submissions ({submissions.length})
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

            <TabsContent value="submissions" className="space-y-6">
              <SubmissionStats submissions={submissions} />
              
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Filter Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search by filename, user name, or email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Submissions List */}
              <Card>
                <CardHeader>
                  <CardTitle>Video Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  {submissionsLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                      <p className="mt-2 text-gray-600">Loading submissions...</p>
                    </div>
                  ) : filteredSubmissions.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-4 text-gray-600">
                        {submissions.length === 0 ? 'No submissions yet' : 'No submissions match your filters'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredSubmissions.map(submission => (
                        <SubmissionCard
                          key={submission.id}
                          submission={submission}
                          onApprove={() => handleApprove(submission.id)}
                          onReject={() => handleReject(submission.id)}
                          onDownload={() => handleDownload(submission)}
                          onPreview={() => handlePreview(submission)}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Video Preview Modal */}
          <VideoPreviewModal
            submission={selectedSubmission}
            open={previewModalOpen}
            onClose={() => setPreviewModalOpen(false)}
            onApprove={() => selectedSubmission && handleApprove(selectedSubmission.id)}
            onReject={() => selectedSubmission && handleReject(selectedSubmission.id)}
            onDownload={() => selectedSubmission && handleDownload(selectedSubmission)}
          />
        </div>
      </main>
    </div>
  );
};

export default AdminVideos;
