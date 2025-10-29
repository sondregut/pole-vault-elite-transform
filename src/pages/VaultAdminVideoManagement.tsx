import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { videoManagementService } from '@/services/videoManagementService';
import { Video, HardDrive, DollarSign, Users, AlertCircle, ExternalLink, Search, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function VaultAdminVideoManagement() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadVideoData();
  }, []);

  async function loadVideoData() {
    setLoading(true);
    setError(null);

    try {
      const dashboardData = await videoManagementService.getDashboardData();
      setData(dashboardData);
    } catch (err) {
      console.error('Error loading video data:', err);
      setError('Failed to load video data');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A6FF]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button
          onClick={loadVideoData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-gray-600">
        No video data available
      </div>
    );
  }

  const formatSize = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(2)} GB`;
    }
    return `${mb.toFixed(2)} MB`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Filter videos by search term
  const filteredVideos = data?.videos?.filter((video: any) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      video.userName?.toLowerCase().includes(search) ||
      video.userEmail?.toLowerCase().includes(search) ||
      video.userId?.toLowerCase().includes(search)
    );
  }) || [];

  const toggleVideoSelection = (videoId: string) => {
    const newSelected = new Set(selectedVideos);
    if (newSelected.has(videoId)) {
      newSelected.delete(videoId);
    } else {
      newSelected.add(videoId);
    }
    setSelectedVideos(newSelected);
  };

  const selectAll = () => {
    const allVideoIds = new Set(filteredVideos.map((v: any) => v.id));
    setSelectedVideos(allVideoIds);
  };

  const deselectAll = () => {
    setSelectedVideos(new Set());
  };

  // Prepare chart data for user usage (top 10)
  const userUsageChartData = data.userUsage.slice(0, 10).map((user: any) => ({
    name: user.userName,
    sizeMB: user.totalSizeMB,
    videos: user.videoCount,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Video Management</h2>
          <p className="text-gray-600 mt-1">
            Monitor storage usage and manage video content
          </p>
        </div>
        <Button onClick={loadVideoData} variant="outline" disabled={loading}>
          Refresh
        </Button>
      </div>

      {/* Storage Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <Video className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#00A6FF]">
              {data.stats.totalVideos}
            </div>
            <p className="text-xs text-gray-600 mt-1">Across all users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {data.stats.totalSizeGB.toFixed(2)} GB
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {formatSize(data.stats.totalSizeMB)} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(data.stats.estimatedMonthlyCost)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Firebase Storage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Video Size</CardTitle>
            <BarChart className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {data.stats.averageVideoSizeMB.toFixed(1)} MB
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Largest: {data.stats.largestVideoMB.toFixed(1)} MB
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estimation Notice */}
      {data.videos.some((v: any) => v.isEstimated) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-3">
            <div className="flex items-start gap-2 text-sm text-blue-900">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                <strong>Note:</strong> Some video sizes are estimated (~20MB each) because size metadata was not saved.
                New video uploads will have accurate sizes.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Total Storage</span>
              <span className="text-sm font-bold text-gray-900">
                {data.stats.totalSizeGB.toFixed(2)} GB
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-700">Free Tier (First 5 GB)</span>
              <span className="text-sm font-bold text-green-900">
                {Math.min(data.stats.totalSizeGB, 5).toFixed(2)} GB
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-sm font-medium text-orange-700">Billable Storage</span>
              <span className="text-sm font-bold text-orange-900">
                {Math.max(0, data.stats.totalSizeGB - 5).toFixed(2)} GB × $0.026/GB
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-base font-semibold text-blue-900">
                Estimated Monthly Cost
              </span>
              <span className="text-xl font-bold text-blue-900">
                {formatCurrency(data.stats.estimatedMonthlyCost)}
              </span>
            </div>

            <div className="text-xs text-gray-500 mt-2">
              Pricing: First 5GB free, then $0.026 per GB/month (Firebase Storage standard pricing)
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Videos</TabsTrigger>
          <TabsTrigger value="largest">Largest Videos</TabsTrigger>
          <TabsTrigger value="by-user">Usage by User</TabsTrigger>
        </TabsList>

        {/* Recent Videos Tab */}
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>Recent Videos</CardTitle>
                  <p className="text-sm text-gray-600">
                    {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
                    {searchTerm && ` matching "${searchTerm}"`}
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by user..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>

                  {/* Bulk Selection */}
                  {filteredVideos.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={selectAll}
                        disabled={selectedVideos.size === filteredVideos.length}
                      >
                        Select All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={deselectAll}
                        disabled={selectedVideos.size === 0}
                      >
                        Deselect All
                      </Button>
                      {selectedVideos.size > 0 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled
                          title="Bulk delete requires Cloud Function implementation"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete ({selectedVideos.size})
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredVideos.length > 0 ? (
                <div className="space-y-3">
                  {filteredVideos.slice(0, 50).map((video: any) => (
                    <div
                      key={video.id}
                      className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                        selectedVideos.has(video.id)
                          ? 'bg-blue-50 border-2 border-blue-300'
                          : 'bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedVideos.has(video.id)}
                          onChange={() => toggleVideoSelection(video.id)}
                          className="w-4 h-4"
                        />
                        {video.thumbnailUrl ? (
                          <img
                            src={video.thumbnailUrl}
                            alt="Video thumbnail"
                            className="w-16 h-16 object-cover rounded flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                            <Video className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {video.userName || 'Unknown User'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {video.userEmail || video.userId}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(
                              video.uploadedAt?.toDate?.() || video.uploadedAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {video.sizeMB && (
                          <Badge variant="secondary">
                            {formatSize(video.sizeMB)}
                            {video.isEstimated && ' *'}
                          </Badge>
                        )}
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00A6FF] hover:text-[#0095E8]"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}

                  {filteredVideos.length > 50 && (
                    <p className="text-center text-sm text-gray-500 py-4">
                      Showing first 50 of {filteredVideos.length} videos
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  {searchTerm ? 'No videos found matching your search' : 'No videos found'}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Largest Videos Tab */}
        <TabsContent value="largest">
          <Card>
            <CardHeader>
              <CardTitle>Largest Videos</CardTitle>
              <p className="text-sm text-gray-600">Top 20 videos by file size</p>
            </CardHeader>
            <CardContent>
              {data.largestVideos && data.largestVideos.length > 0 ? (
                <div className="space-y-3">
                  {data.largestVideos.map((video: any) => (
                    <div
                      key={video.id}
                      className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Video className="w-5 h-5 text-orange-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {video.userName || 'Unknown User'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Session: {video.sessionId}
                          </p>
                          <p className="text-xs text-gray-500">
                            Uploaded:{' '}
                            {new Date(
                              video.uploadedAt?.toDate?.() || video.uploadedAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-orange-600 text-white">
                          {formatSize(video.sizeMB || 0)}
                        </Badge>
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00A6FF] hover:text-[#0095E8]"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No video size data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage by User Tab */}
        <TabsContent value="by-user">
          <Card>
            <CardHeader>
              <CardTitle>Storage Usage by User</CardTitle>
              <p className="text-sm text-gray-600">Top users by total video storage</p>
            </CardHeader>
            <CardContent>
              {data.userUsage && data.userUsage.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={userUsageChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis label={{ value: 'MB', angle: -90, position: 'insideLeft' }} />
                      <Tooltip
                        formatter={(value: number, name: string) =>
                          name === 'sizeMB' ? formatSize(value) : value
                        }
                      />
                      <Bar dataKey="sizeMB" fill="#00A6FF" name="Storage Used" />
                    </BarChart>
                  </ResponsiveContainer>

                  <div className="mt-6 space-y-2">
                    {data.userUsage.slice(0, 10).map((user: any, index: number) => (
                      <div
                        key={user.userId}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-[#00A6FF] text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.userName}</p>
                            <p className="text-xs text-gray-600">{user.userEmail}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatSize(user.totalSizeMB)}
                          </p>
                          <p className="text-xs text-gray-600">{user.videoCount} videos</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No user storage data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Card (if minimal video data) */}
      {data.stats.totalVideos === 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Enable Video Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-900 space-y-2">
            <p>
              To see video data here, the mobile app needs to store video metadata when uploading.
            </p>
            <p className="font-medium">Mobile app should include:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>videoUrl (Firebase Storage URL)</li>
              <li>videoSize (file size in bytes)</li>
              <li>uploadedAt or timestamp</li>
            </ul>
            <p className="text-xs text-blue-700 mt-3">
              Video metadata helps track storage costs and optimize storage usage.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Storage Optimization Tips */}
      {data.stats.totalSizeGB > 5 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              Storage Optimization Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-yellow-900 space-y-2">
            <p>You're using {data.stats.totalSizeGB.toFixed(2)} GB of storage.</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Consider compressing videos over 100MB</li>
              <li>Set video resolution limits (1080p max)</li>
              <li>Implement automatic cleanup for videos older than 6 months</li>
              <li>Enable video compression in Firebase Storage</li>
            </ul>
            <p className="text-xs text-yellow-700 mt-3">
              Current monthly cost: {formatCurrency(data.stats.estimatedMonthlyCost)}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
