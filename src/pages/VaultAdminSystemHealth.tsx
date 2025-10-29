import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { systemHealthService } from '@/services/systemHealthService';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Server,
  AlertCircle,
} from 'lucide-react';

export default function VaultAdminSystemHealth() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorBreakdown, setErrorBreakdown] = useState<any[]>([]);

  useEffect(() => {
    loadSystemHealth();
  }, []);

  async function loadSystemHealth() {
    setLoading(true);
    setError(null);

    try {
      const [dashboardData, breakdown] = await Promise.all([
        systemHealthService.getSystemHealthDashboard(),
        systemHealthService.getErrorBreakdown(),
      ]);

      setData(dashboardData);
      setErrorBreakdown(breakdown);
    } catch (err) {
      console.error('Error loading system health:', err);
      setError('Failed to load system health data');
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
          onClick={loadSystemHealth}
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
        No system health data available
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'degraded':
        return 'text-yellow-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'down':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Healthy</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Degraded</Badge>;
      case 'down':
        return <Badge variant="destructive">Down</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Health</h2>
          <p className="text-gray-600 mt-1">
            Monitor errors, API status, and system performance
          </p>
        </div>
        <Button onClick={loadSystemHealth} variant="outline" disabled={loading}>
          Refresh
        </Button>
      </div>

      {/* Error Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors (24h)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {data.errorCount24h}
            </div>
            <p className="text-xs text-gray-600 mt-1">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors (7d)</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {data.errorCountThisWeek}
            </div>
            <p className="text-xs text-gray-600 mt-1">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Services</CardTitle>
            <Server className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {data.apiHealth.filter((h: any) => h.status === 'healthy').length}/
              {data.apiHealth.length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Services healthy</p>
          </CardContent>
        </Card>
      </div>

      {/* Error Rate Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Error Rate (Last 24 Hours)</CardTitle>
          <p className="text-sm text-gray-600">Errors per hour</p>
        </CardHeader>
        <CardContent>
          {data.errorRate && data.errorRate.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.errorRate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#f97316"
                  strokeWidth={2}
                  name="Errors"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No error data in the last 24 hours
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Health Status & Error Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* API Health Status */}
        <Card>
          <CardHeader>
            <CardTitle>API Health Status</CardTitle>
            <p className="text-sm text-gray-600">External service monitoring</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.apiHealth.map((api: any) => (
                <div
                  key={api.service}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(api.status)}
                    <div>
                      <p className="font-medium text-gray-900">{api.service}</p>
                      <p className="text-xs text-gray-500">
                        {api.message || 'No issues detected'}
                        {api.responseTime && ` (${api.responseTime}ms)`}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(api.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Breakdown by Screen */}
        <Card>
          <CardHeader>
            <CardTitle>Errors by Screen</CardTitle>
            <p className="text-sm text-gray-600">Last 7 days</p>
          </CardHeader>
          <CardContent>
            {errorBreakdown && errorBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={errorBreakdown.slice(0, 10)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="screen" type="category" tick={{ fontSize: 11 }} width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No error data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Errors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Errors</CardTitle>
          <p className="text-sm text-gray-600">Last 10 errors in the last 24 hours</p>
        </CardHeader>
        <CardContent>
          {data.recentErrors && data.recentErrors.length > 0 ? (
            <div className="space-y-2">
              {data.recentErrors.map((log: any) => (
                <div
                  key={log.id}
                  className="p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2 flex-1">
                      <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-red-900 break-words">{log.error}</p>
                        {log.screen && (
                          <p className="text-sm text-red-700 mt-1">Screen: {log.screen}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-red-600 whitespace-nowrap ml-2">
                      {new Date(log.timestamp?.toDate?.() || log.timestamp).toLocaleString()}
                    </div>
                  </div>

                  {log.stackTrace && (
                    <details className="mt-2">
                      <summary className="text-xs text-red-700 cursor-pointer hover:text-red-800">
                        View stack trace
                      </summary>
                      <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-x-auto">
                        {log.stackTrace}
                      </pre>
                    </details>
                  )}

                  <div className="mt-2 flex gap-2 text-xs text-red-600">
                    {log.userId && <span>User: {log.userId}</span>}
                    {log.appVersion && <span>Version: {log.appVersion}</span>}
                    {log.platform && <span>Platform: {log.platform}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-lg font-medium">No errors in the last 24 hours</p>
              <p className="text-sm">System is running smoothly!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Error Tracking</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {data.errorCount24h > 0 ? 'Active' : 'No Recent Errors'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">API Monitoring</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {data.apiHealth.length} Services Monitored
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Firebase Status</p>
              <p className="text-lg font-semibold text-blue-900 mt-1">
                {data.apiHealth.find((h: any) => h.service === 'Firebase Firestore')?.status || 'Unknown'}
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Monitoring Period</p>
              <p className="text-lg font-semibold text-purple-900 mt-1">
                Real-time
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Setup Instructions (if no errors logged) */}
      {data.errorCount24h === 0 && data.errorCountThisWeek === 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Enable Error Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-900 space-y-2">
            <p>
              To see error data here, the mobile app needs to log errors to the{' '}
              <code className="bg-blue-100 px-1 py-0.5 rounded">errorLogs</code> collection.
            </p>
            <p className="font-medium">Mobile app implementation:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Catch errors in try-catch blocks</li>
              <li>Log to Firestore errorLogs collection</li>
              <li>Include: error message, stack trace, screen, user ID, app version</li>
            </ul>
            <p className="text-xs text-blue-700 mt-3">
              See IMPLEMENTATION_GUIDE.md Phase 5 for mobile app code examples.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
