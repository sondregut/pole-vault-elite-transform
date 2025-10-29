import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { gdprService } from '@/services/gdprService';
import {
  Shield,
  Download,
  Trash2,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export default function VaultAdminDataManagement() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Export dialog state
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportUserId, setExportUserId] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadGDPRData();
  }, []);

  async function loadGDPRData() {
    setLoading(true);
    setError(null);

    try {
      const dashboardData = await gdprService.getDashboardData();
      setData(dashboardData);
    } catch (err) {
      console.error('Error loading GDPR data:', err);
      setError('Failed to load data management information');
    } finally {
      setLoading(false);
    }
  }

  async function handleManualExport() {
    if (!exportUserId.trim()) {
      alert('Please enter a user ID');
      return;
    }

    setIsExporting(true);

    try {
      const result = await gdprService.exportUserData(exportUserId);

      if (result.success) {
        alert('Export request created successfully. It will be processed by the backend.');
        setExportDialogOpen(false);
        setExportUserId('');
        loadGDPRData();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating export:', error);
      alert('Failed to create export request');
    } finally {
      setIsExporting(false);
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  }

  function getUrgencyColor(urgency: string) {
    switch (urgency) {
      case 'critical':
        return 'border-red-300 bg-red-50';
      case 'warning':
        return 'border-orange-300 bg-orange-50';
      default:
        return 'border-gray-200 bg-white';
    }
  }

  function getUrgencyBadge(compliance: any) {
    if (compliance.isOverdue) {
      return <Badge variant="destructive">OVERDUE</Badge>;
    }
    if (compliance.urgency === 'critical') {
      return <Badge className="bg-red-100 text-red-800">{compliance.daysRemaining}d left</Badge>;
    }
    if (compliance.urgency === 'warning') {
      return <Badge className="bg-orange-100 text-orange-800">{compliance.daysRemaining}d left</Badge>;
    }
    return <Badge variant="secondary">{compliance.daysRemaining}d left</Badge>;
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
          onClick={loadGDPRData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Data Management</h2>
          <p className="text-gray-600 mt-1">
            GDPR compliance - Data export and deletion requests
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadGDPRData} variant="outline">
            Refresh
          </Button>
          <Button onClick={() => setExportDialogOpen(true)}>
            <Download className="w-4 h-4 mr-2" />
            Manual Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Export Requests</CardTitle>
              <Download className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {data.stats.totalExportRequests}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {data.stats.pendingExports} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deletion Requests</CardTitle>
              <Trash2 className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {data.stats.totalDeletionRequests}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {data.stats.pendingDeletions} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
              <Shield className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {data.stats.completedExports + data.stats.completedDeletions > 0
                  ? Math.round(
                      ((data.stats.completedExports + data.stats.completedDeletions) /
                        (data.stats.totalExportRequests + data.stats.totalDeletionRequests)) *
                        100
                    )
                  : 100}
                %
              </div>
              <p className="text-xs text-gray-600 mt-1">Requests completed</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* GDPR Deadline Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-3">
          <div className="flex items-start gap-2 text-sm text-blue-900">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">GDPR Compliance Requirements</p>
              <p className="text-blue-800 mt-1">
                Data export and deletion requests must be completed within <strong>30 days</strong> of submission.
                Requests are automatically prioritized by deadline.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="exports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="exports">
            Export Requests
            {data && data.stats.pendingExports > 0 && (
              <Badge variant="destructive" className="ml-2 px-1.5 py-0 text-xs">
                {data.stats.pendingExports}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="deletions">
            Deletion Requests
            {data && data.stats.pendingDeletions > 0 && (
              <Badge variant="destructive" className="ml-2 px-1.5 py-0 text-xs">
                {data.stats.pendingDeletions}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Export Requests Tab */}
        <TabsContent value="exports" className="space-y-3">
          {data && data.exportRequests.length > 0 ? (
            data.exportRequests.map((request: any) => {
              const compliance = gdprService.getComplianceStatus(request);

              return (
                <Card key={request.id} className={getUrgencyColor(compliance.urgency)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Download className="w-4 h-4 text-blue-600" />
                          <CardTitle className="text-base">
                            {request.userName || 'Unknown User'}
                          </CardTitle>
                          {getStatusBadge(request.status)}
                          {request.status === 'pending' && getUrgencyBadge(compliance)}
                        </div>
                        <p className="text-sm text-gray-600">{request.userEmail}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          User ID: {request.userId}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Requested:</span>
                        <span className="font-medium">
                          {new Date(request.requestedAt?.toDate?.() || request.requestedAt).toLocaleString()}
                        </span>
                      </div>

                      {request.status === 'pending' && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Deadline:</span>
                          <span className={`font-medium ${compliance.isOverdue ? 'text-red-600' : ''}`}>
                            {compliance.isOverdue
                              ? `${Math.abs(compliance.daysRemaining)} days overdue`
                              : `${compliance.daysRemaining} days remaining`}
                          </span>
                        </div>
                      )}

                      {request.completedAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Completed:</span>
                          <span className="font-medium">
                            {new Date(request.completedAt).toLocaleString()}
                          </span>
                        </div>
                      )}

                      {request.downloadUrl && (
                        <div className="pt-2 border-t border-gray-200">
                          <a
                            href={request.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#00A6FF] hover:text-[#0095E8] text-sm font-medium"
                          >
                            Download Export →
                          </a>
                        </div>
                      )}

                      {request.error && (
                        <div className="pt-2 border-t border-red-200">
                          <p className="text-red-600 text-xs">{request.error}</p>
                        </div>
                      )}
                    </div>

                    {request.status === 'pending' && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-xs text-yellow-800">
                          <strong>Action Required:</strong> Export must be processed by Cloud Function or manually.
                          See IMPLEMENTATION_GUIDE.md for backend setup.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-lg font-medium">No export requests</p>
                <p className="text-sm">All users have access to their data</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Deletion Requests Tab */}
        <TabsContent value="deletions" className="space-y-3">
          {data && data.deletionRequests.length > 0 ? (
            data.deletionRequests.map((request: any) => {
              const compliance = gdprService.getComplianceStatus(request);

              return (
                <Card key={request.id} className={getUrgencyColor(compliance.urgency)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Trash2 className="w-4 h-4 text-red-600" />
                          <CardTitle className="text-base">
                            {request.userName || 'Unknown User'}
                          </CardTitle>
                          {getStatusBadge(request.status)}
                          {request.status === 'pending' && getUrgencyBadge(compliance)}
                        </div>
                        <p className="text-sm text-gray-600">{request.userEmail}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          User ID: {request.userId}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Requested:</span>
                        <span className="font-medium">
                          {new Date(request.requestedAt?.toDate?.() || request.requestedAt).toLocaleString()}
                        </span>
                      </div>

                      {request.status === 'pending' && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Deadline:</span>
                          <span className={`font-medium ${compliance.isOverdue ? 'text-red-600' : ''}`}>
                            {compliance.isOverdue
                              ? `${Math.abs(compliance.daysRemaining)} days overdue`
                              : `${compliance.daysRemaining} days remaining`}
                          </span>
                        </div>
                      )}

                      {request.completedAt && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Completed:</span>
                            <span className="font-medium">
                              {new Date(request.completedAt).toLocaleString()}
                            </span>
                          </div>

                          {request.deletedData && (
                            <div className="pt-2 border-t border-gray-200">
                              <p className="text-xs text-gray-600 mb-1">Data deleted:</p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {request.deletedData.sessions !== undefined && (
                                  <span>{request.deletedData.sessions} sessions</span>
                                )}
                                {request.deletedData.poles !== undefined && (
                                  <span>{request.deletedData.poles} poles</span>
                                )}
                                {request.deletedData.posts !== undefined && (
                                  <span>{request.deletedData.posts} posts</span>
                                )}
                                {request.deletedData.videos !== undefined && (
                                  <span>{request.deletedData.videos} videos</span>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {request.error && (
                        <div className="pt-2 border-t border-red-200">
                          <p className="text-red-600 text-xs">{request.error}</p>
                        </div>
                      )}
                    </div>

                    {request.status === 'pending' && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs text-red-800">
                          <strong>Action Required:</strong> Account deletion must be processed by Cloud Function.
                          This will permanently delete all user data and cannot be undone.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-lg font-medium">No deletion requests</p>
                <p className="text-sm">No users have requested account deletion</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Manual Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manual Data Export</DialogTitle>
            <DialogDescription>
              Create a data export request for a specific user
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="user-id">User ID</Label>
              <Input
                id="user-id"
                placeholder="Enter user ID"
                value={exportUserId}
                onChange={(e) => setExportUserId(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                You can find user IDs in the Users tab
              </p>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                This will create an export request. A Cloud Function must process it to generate
                the actual data export file.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setExportDialogOpen(false)}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button onClick={handleManualExport} disabled={isExporting || !exportUserId.trim()}>
              {isExporting ? 'Creating...' : 'Create Export Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
