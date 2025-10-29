import { useEffect, useState } from 'react';
import { moderationService } from '@/services/moderationService';
import { PostPreviewCard } from '@/components/admin/vault/moderation/PostPreviewCard';
import { BanUserDialog } from '@/components/admin/vault/moderation/BanUserDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Shield, Clock, CheckCircle } from 'lucide-react';

export default function VaultAdminModeration() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; email?: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadModerationData();
  }, []);

  async function loadModerationData() {
    setLoading(true);
    setError(null);

    try {
      const dashboardData = await moderationService.getModerationDashboard();
      setData(dashboardData);
    } catch (err) {
      console.error('Error loading moderation data:', err);
      setError('Failed to load moderation data');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePost(postId: string, reportId?: string) {
    if (!confirm('Are you sure you want to permanently delete this post? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      const result = await moderationService.deletePost(postId);
      if (result.success) {
        if (reportId) {
          await moderationService.markReportHandled(reportId);
        }
        await loadModerationData();
      } else {
        alert(`Error deleting post: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleHidePost(postId: string, reportId?: string) {
    setActionLoading(true);
    try {
      const result = await moderationService.hidePost(postId);
      if (result.success) {
        if (reportId) {
          await moderationService.markReportHandled(reportId);
        }
        await loadModerationData();
      } else {
        alert(`Error hiding post: ${result.error}`);
      }
    } catch (error) {
      console.error('Error hiding post:', error);
      alert('Failed to hide post');
    } finally {
      setActionLoading(false);
    }
  }

  function handleBanUserClick(userId: string, userName: string, userEmail?: string) {
    setSelectedUser({ id: userId, name: userName, email: userEmail });
    setBanDialogOpen(true);
  }

  async function handleBanConfirm(reason: string) {
    if (!selectedUser) return;

    setActionLoading(true);
    try {
      const result = await moderationService.banUser(selectedUser.id, reason);
      if (result.success) {
        await loadModerationData();
      } else {
        alert(`Error banning user: ${result.error}`);
      }
    } catch (error) {
      console.error('Error banning user:', error);
      alert('Failed to ban user');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleUnbanUser(userId: string, userName: string) {
    if (!confirm(`Are you sure you want to unban ${userName}?`)) {
      return;
    }

    setActionLoading(true);
    try {
      const result = await moderationService.unbanUser(userId);
      if (result.success) {
        await loadModerationData();
      } else {
        alert(`Error unbanning user: ${result.error}`);
      }
    } catch (error) {
      console.error('Error unbanning user:', error);
      alert('Failed to unban user');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDismissReport(reportId: string) {
    setActionLoading(true);
    try {
      const result = await moderationService.dismissReport(reportId);
      if (result.success) {
        await loadModerationData();
      } else {
        alert(`Error dismissing report: ${result.error}`);
      }
    } catch (error) {
      console.error('Error dismissing report:', error);
      alert('Failed to dismiss report');
    } finally {
      setActionLoading(false);
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
          onClick={loadModerationData}
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
        No moderation data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Moderation</h2>
          <p className="text-gray-600 mt-1">
            Review reported posts and manage social content
          </p>
        </div>
        <Button
          onClick={loadModerationData}
          disabled={loading || actionLoading}
          variant="outline"
        >
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {data.reports.length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Posts</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {data.recentPosts.length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Last 50 posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banned Users</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {data.bannedUsers.length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Restricted accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports" className="relative">
            Reported Posts
            {data.reports.length > 0 && (
              <Badge variant="destructive" className="ml-2 px-1.5 py-0 text-xs">
                {data.reports.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="recent">Recent Posts</TabsTrigger>
          <TabsTrigger value="banned">Banned Users</TabsTrigger>
        </TabsList>

        {/* Reported Posts Tab */}
        <TabsContent value="reports" className="space-y-4">
          {data.reports.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
                <p className="text-lg font-medium text-gray-900">No pending reports</p>
                <p className="text-sm text-gray-600">All caught up!</p>
              </CardContent>
            </Card>
          ) : (
            data.reports.map((report: any) => (
              <div key={report.id} className="space-y-3">
                {/* Report Details */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                        <p className="font-medium text-orange-900">
                          Reason: {report.reason}
                        </p>
                      </div>
                      <p className="text-sm text-orange-700">
                        Reported by: {report.reportedBy}
                      </p>
                      {report.additionalInfo && (
                        <p className="text-sm text-orange-700">
                          Additional info: {report.additionalInfo}
                        </p>
                      )}
                      <p className="text-xs text-orange-600">
                        {new Date(report.timestamp?.toDate?.() || report.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismissReport(report.id)}
                      disabled={actionLoading}
                    >
                      Dismiss Report
                    </Button>
                  </div>
                </div>

                {/* Post Preview */}
                {report.post ? (
                  <PostPreviewCard
                    post={report.post}
                    onDelete={() => handleDeletePost(report.postId, report.id)}
                    onHide={() => handleHidePost(report.postId, report.id)}
                    onBanUser={() =>
                      handleBanUserClick(
                        report.post.userId,
                        report.post.userName || 'Unknown User',
                        report.post.userEmail
                      )
                    }
                  />
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center text-gray-500">
                      Post has already been deleted
                    </CardContent>
                  </Card>
                )}
              </div>
            ))
          )}
        </TabsContent>

        {/* Recent Posts Tab */}
        <TabsContent value="recent" className="space-y-4">
          {data.recentPosts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No posts in the feed yet
              </CardContent>
            </Card>
          ) : (
            data.recentPosts.map((post: any) => (
              <PostPreviewCard
                key={post.id}
                post={post}
                onDelete={() => handleDeletePost(post.id)}
                onHide={() => handleHidePost(post.id)}
                onBanUser={() =>
                  handleBanUserClick(post.userId, post.userName || 'Unknown User', post.userEmail)
                }
              />
            ))
          )}
        </TabsContent>

        {/* Banned Users Tab */}
        <TabsContent value="banned" className="space-y-4">
          {data.bannedUsers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No banned users
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {data.bannedUsers.map((bannedUser: any) => (
                <Card key={bannedUser.userId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">
                            {bannedUser.userName || 'Unknown User'}
                          </CardTitle>
                          <Badge variant="destructive">Banned</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {bannedUser.userEmail || bannedUser.userId}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnbanUser(bannedUser.userId, bannedUser.userName)}
                        disabled={actionLoading}
                      >
                        Unban User
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {bannedUser.banReason && (
                        <div>
                          <span className="font-medium text-gray-700">Reason: </span>
                          <span className="text-gray-600">{bannedUser.banReason}</span>
                        </div>
                      )}
                      {bannedUser.bannedAt && (
                        <div>
                          <span className="font-medium text-gray-700">Banned on: </span>
                          <span className="text-gray-600">
                            {new Date(bannedUser.bannedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Ban User Dialog */}
      <BanUserDialog
        isOpen={banDialogOpen}
        onClose={() => setBanDialogOpen(false)}
        onConfirm={handleBanConfirm}
        userName={selectedUser?.name || ''}
        userEmail={selectedUser?.email}
      />
    </div>
  );
}
