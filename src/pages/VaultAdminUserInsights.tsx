import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { analyticsService } from '@/services/analyticsService';
import { Users, TrendingUp, Activity } from 'lucide-react';

export default function VaultAdminUserInsights() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [growthView, setGrowthView] = useState<'new' | 'total'>('new');
  const [timeRange, setTimeRange] = useState<number>(30);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  async function loadAnalytics() {
    setLoading(true);
    setError(null);

    try {
      const [metrics, growthData, engagement] = await Promise.all([
        analyticsService.getActiveUserMetrics(),
        analyticsService.getUserGrowthData(timeRange),
        analyticsService.getEngagementMetrics(),
      ]);

      setAnalytics({
        activeUsers: metrics,
        userGrowth: growthData,
        engagement,
      });
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Failed to load analytics data');
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
          onClick={loadAnalytics}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center text-gray-600">
        No analytics data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">User Insights</h2>
        <p className="text-gray-600 mt-1">
          Analytics and metrics about your user base
        </p>
      </div>

      {/* Active Users Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#00A6FF]">
              {analytics.activeUsers.dau}
            </div>
            <p className="text-xs text-gray-600 mt-1">Users active today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#00A6FF]">
              {analytics.activeUsers.wau}
            </div>
            <p className="text-xs text-gray-600 mt-1">Users active last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Active Users</CardTitle>
            <Activity className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#00A6FF]">
              {analytics.activeUsers.mau}
            </div>
            <p className="text-xs text-gray-600 mt-1">Users active last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* User Growth Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle>User Growth</CardTitle>
              <p className="text-sm text-gray-600">
                {growthView === 'new'
                  ? `New signups over the last ${timeRange} days`
                  : `Total users over the last ${timeRange} days`}
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {/* Time Range Selector */}
              <div className="flex gap-1 bg-gray-50 p-1 rounded-lg">
                {[7, 14, 30, 60, 90].map((days) => (
                  <button
                    key={days}
                    onClick={() => setTimeRange(days)}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                      timeRange === days
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {days}d
                  </button>
                ))}
              </div>

              {/* View Type Selector */}
              <div className="flex gap-2">
                <button
                  onClick={() => setGrowthView('new')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    growthView === 'new'
                      ? 'bg-[#00A6FF] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  New Users
                </button>
                <button
                  onClick={() => setGrowthView('total')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    growthView === 'total'
                      ? 'bg-[#00A6FF] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Total Users
                </button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {analytics.userGrowth && analytics.userGrowth.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  interval={timeRange <= 14 ? 0 : timeRange <= 30 ? 2 : timeRange <= 60 ? 5 : 7}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    // For longer ranges, show month/day. For very long ranges, show month abbreviation
                    if (timeRange <= 30) {
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    } else {
                      return `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getDate()}`;
                    }
                  }}
                  angle={timeRange > 30 ? -45 : 0}
                  textAnchor={timeRange > 30 ? 'end' : 'middle'}
                  height={timeRange > 30 ? 70 : 30}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString();
                  }}
                />
                <Legend />
                {growthView === 'new' ? (
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#00A6FF"
                    strokeWidth={2}
                    name="New Users"
                    dot={{ r: 3 }}
                  />
                ) : (
                  <Line
                    type="monotone"
                    dataKey="cumulative"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    name="Total Users"
                    dot={{ r: 3 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No growth data available yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      <Card>
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
            <p className="text-sm text-gray-600 mt-1">User activity statistics</p>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Total Sessions</div>
                <div className="text-3xl font-bold text-gray-900">
                  {analytics.engagement.totalSessions.toLocaleString()}
                </div>
              </div>
              <Activity className="h-10 w-10 text-[#00A6FF] opacity-50" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Avg Sessions per User</span>
                <span className="text-lg font-semibold text-gray-900">
                  {analytics.engagement.avgSessionsPerUser.toFixed(1)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Avg Jumps per Session</span>
                <span className="text-lg font-semibold text-gray-900">
                  {analytics.engagement.avgJumpsPerSession.toFixed(1)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Total Users</span>
                <span className="text-lg font-semibold text-gray-900">
                  {analytics.engagement.totalUsers.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={loadAnalytics}
          disabled={loading}
          className="px-4 py-2 bg-[#00A6FF] text-white rounded-lg hover:bg-[#0095E8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
}
