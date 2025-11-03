import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { trainingAnalyticsService } from '@/services/trainingAnalyticsService';
import { TrendingUp, Target, Star, CloudRain, Calendar } from 'lucide-react';

export default function VaultAdminTrainingAnalytics() {
  console.log('[VaultAdminTrainingAnalytics] Component mounted');

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[VaultAdminTrainingAnalytics] useEffect triggered');
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    setLoading(true);
    setError(null);

    try {
      console.log('[VaultAdminTrainingAnalytics] Starting to load analytics...');
      const analyticsData = await trainingAnalyticsService.getDashboardAnalytics();
      console.log('[VaultAdminTrainingAnalytics] Analytics data received:', analyticsData);
      setData(analyticsData);
    } catch (err: any) {
      console.error('[VaultAdminTrainingAnalytics] Error loading training analytics:', err);
      setError(`Failed to load training analytics: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A6FF] mb-4"></div>
        <p className="text-gray-600">Loading training analytics...</p>
        <p className="text-sm text-gray-500 mt-2">Check console for debug logs</p>
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

  if (!data) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600 mb-4">No training data available</div>
        <p className="text-sm text-gray-500 mb-4">
          Check the browser console for detailed error messages
        </p>
        <Button onClick={loadAnalytics} variant="outline">
          Retry Loading
        </Button>
      </div>
    );
  }

  // Check if data is empty
  if (data.sessionStats?.totalSessions === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Training Sessions Yet</h3>
        <p className="text-gray-600 mb-4">
          Training analytics will appear here once users start logging sessions in the app
        </p>
        <Button onClick={loadAnalytics} variant="outline">
          Refresh
        </Button>
      </div>
    );
  }

  const RATING_COLORS: Record<string, string> = {
    great: '#007AFF',
    good: '#34C759',
    ok: '#FFCC00',
    glider: '#FF9500',
    runthru: '#FF3B30',
  };

  // Prepare pie chart data for ratings
  const ratingPieData = data.ratingDistribution.map((r: any) => ({
    name: r.rating,
    value: r.count,
    color: RATING_COLORS[r.rating.toLowerCase()] || '#999',
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Training Analytics</h2>
          <p className="text-gray-600 mt-1">
            Insights from training sessions across all users
          </p>
        </div>
        <Button onClick={loadAnalytics} variant="outline" disabled={loading}>
          Refresh
        </Button>
      </div>

      {/* Session Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#00A6FF]">
              {data.sessionStats.totalSessions}
            </div>
            <p className="text-xs text-gray-600 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jumps</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {data.sessionStats.totalJumps}
            </div>
            <p className="text-xs text-gray-600 mt-1">Across all sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Sessions/User</CardTitle>
            <Target className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {data.sessionStats.avgSessionsPerUser.toFixed(1)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Per athlete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Jumps/Session</CardTitle>
            <Star className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {data.sessionStats.avgJumpsPerSession.toFixed(1)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Training intensity</p>
          </CardContent>
        </Card>
      </div>

      {/* Height Distribution & Success Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Height Distribution</CardTitle>
            <p className="text-sm text-gray-600">Most attempted heights</p>
          </CardHeader>
          <CardContent>
            {data.heightDistribution && data.heightDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.heightDistribution.slice(0, 15)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="height" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="attempts" fill="#00A6FF" name="Attempts" />
                  <Bar dataKey="makes" fill="#34C759" name="Makes" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No height data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Success Rate by Height</CardTitle>
            <p className="text-sm text-gray-600">Heights with 5+ attempts</p>
          </CardHeader>
          <CardContent>
            {data.successByHeight && data.successByHeight.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.successByHeight}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="height" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} label={{ value: '%', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#34C759"
                    strokeWidth={2}
                    name="Success Rate"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No success rate data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution & Equipment Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <p className="text-sm text-gray-600">Jump quality ratings</p>
          </CardHeader>
          <CardContent>
            {data.ratingDistribution && data.ratingDistribution.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={ratingPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ratingPieData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  {data.ratingDistribution.map((rating: any) => (
                    <div key={rating.rating} className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="font-medium capitalize">{rating.rating}</span>
                      <span className="text-gray-600">{rating.percentage.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No rating data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Equipment</CardTitle>
            <p className="text-sm text-gray-600">Top 10 most used poles</p>
          </CardHeader>
          <CardContent>
            {data.equipmentTrends && data.equipmentTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.equipmentTrends} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="pole" type="category" tick={{ fontSize: 11 }} width={100} />
                  <Tooltip />
                  <Bar dataKey="usage" fill="#00A6FF" name="Usage Count" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No equipment data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weather Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Weather Impact on Performance</CardTitle>
          <p className="text-sm text-gray-600">Average session rating by weather conditions</p>
        </CardHeader>
        <CardContent>
          {data.weatherImpact && data.weatherImpact.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.weatherImpact}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="weather" tick={{ fontSize: 11 }} />
                <YAxis
                  domain={[0, 5]}
                  label={{ value: 'Avg Rating', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="sessionCount" fill="#00A6FF" name="Sessions" />
                <Bar dataKey="avgRating" fill="#34C759" name="Avg Rating" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No weather data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
