import { useState, useMemo } from 'react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useVaultSessions, useVaultStats } from '@/hooks/useVaultData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart3, Activity, Target, Calendar, Video, Award, Wind, Filter } from 'lucide-react';
import { formatHeight } from '@/types/vault';
import { Session } from '@/types/vault';
import {
  calculateSuccessRate,
  calculatePoleUsage,
  calculateRatingDistribution,
  calculateHeightProgression,
  calculateEnvironmentalData,
  calculateTechnicalMetrics
} from '@/utils/vaultAnalytics';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const VaultAnalytics = () => {
  const { user } = useFirebaseAuth();
  const { sessions, loading: sessionsLoading } = useVaultSessions(user);
  const { stats, loading: statsLoading } = useVaultStats(user, sessions);
  const [selectedStepsForRating, setSelectedStepsForRating] = useState<number | null>(null);

  // Get available step counts from all jumps - MUST be called before any conditional returns
  const availableSteps = useMemo(() => {
    const stepsSet = new Set<number>();
    sessions.forEach(session => {
      session.jumps?.forEach(jump => {
        if (jump.steps && jump.steps > 0) {
          stepsSet.add(jump.steps);
        }
      });
    });
    return Array.from(stepsSet).sort((a, b) => a - b);
  }, [sessions]);

  // Filter sessions for rating distribution only
  const filteredSessionsForRating = useMemo(() => {
    if (selectedStepsForRating === null) return sessions;

    return sessions.map(session => ({
      ...session,
      jumps: session.jumps?.filter(jump => jump.steps === selectedStepsForRating) || []
    })).filter(session => session.jumps.length > 0);
  }, [sessions, selectedStepsForRating]);

  // Calculate analytics data - most use all sessions, rating uses filtered
  const successRate = useMemo(() => calculateSuccessRate(sessions), [sessions]);
  const poleUsage = useMemo(() => calculatePoleUsage(sessions), [sessions]);
  const ratingDistribution = useMemo(() => calculateRatingDistribution(filteredSessionsForRating), [filteredSessionsForRating]);
  const heightProgression = useMemo(() => calculateHeightProgression(sessions), [sessions]);
  const environmentalData = useMemo(() => calculateEnvironmentalData(sessions), [sessions]);
  const technicalMetrics = useMemo(() => calculateTechnicalMetrics(sessions), [sessions]);

  // NOW we can do conditional returns after all hooks are called
  if (!user) {
    return null;
  }

  const loading = sessionsLoading || statsLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Chart colors
  const COLORS = ['#3176FF', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const RATING_COLORS: Record<string, string> = {
    'run-thru': '#ef4444',
    'glider': '#f59e0b',
    'ok': '#3176FF',
    'good': '#10b981',
    'great': '#8b5cf6'
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="secondary">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
        <p className="text-gray-600 mt-1">
          Track your progress and analyze your pole vault performance over time
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {stats?.totalSessions || 0}
              </p>
              <p className="text-xs text-green-600 font-medium">
                +{stats?.thisWeekSessions || 0} this week
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Personal Best</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {stats && stats.personalBest !== '0.00'
                  ? formatHeight(stats.personalBest, stats.personalBestUnits)
                  : '0m'}
              </p>
              <p className="text-xs text-green-600 font-medium">
                {stats?.thisMonthPBImprovement && stats.thisMonthPBImprovement !== '0.00'
                  ? `+${stats.thisMonthPBImprovement}m this month`
                  : 'No recent PB'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Jumps</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {stats?.totalJumps || 0}
              </p>
              <p className="text-xs text-gray-600 font-medium">
                Across all sessions
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Video className="h-6 w-6 text-orange-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Training Videos</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {stats?.totalVideos || 0}
              </p>
              <p className="text-xs text-gray-600 font-medium">
                {stats ? Math.floor(stats.totalVideos / Math.max(stats.totalSessions, 1)) : 0} avg per session
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Rate Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Success Rate Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600 mb-2">
                {successRate.successRate.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">Overall Success Rate</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600 mb-2">
                {successRate.makes}
              </p>
              <p className="text-sm text-gray-600">Successful Jumps</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-600 mb-2">
                {successRate.misses}
              </p>
              <p className="text-sm text-gray-600">Missed Jumps</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Height Progression (Last 10 Sessions)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {heightProgression.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={heightProgression}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} label={{ value: 'Height (m)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="bestHeight" stroke="#3176FF" strokeWidth={2} name="Best Height" />
                  <Line type="monotone" dataKey="avgHeight" stroke="#10b981" strokeWidth={2} name="Avg Height" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No height data available yet
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Jump Rating Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Step Filter for Rating Distribution */}
            {availableSteps.length > 0 && (
              <div className="mb-4 pb-4 border-b">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Filter by Steps:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedStepsForRating === null ? "default" : "outline"}
                    onClick={() => setSelectedStepsForRating(null)}
                    size="sm"
                    className={selectedStepsForRating === null ? "bg-[#3176FF] hover:bg-[#2565E8]" : ""}
                  >
                    All Steps
                  </Button>
                  {availableSteps.map(steps => (
                    <Button
                      key={steps}
                      variant={selectedStepsForRating === steps ? "default" : "outline"}
                      onClick={() => setSelectedStepsForRating(steps)}
                      size="sm"
                      className={selectedStepsForRating === steps ? "bg-[#3176FF] hover:bg-[#2565E8]" : ""}
                    >
                      {steps} {steps === 1 ? 'Step' : 'Steps'}
                    </Button>
                  ))}
                </div>
                {selectedStepsForRating !== null && (
                  <p className="text-xs text-gray-600 mt-2">
                    Showing ratings for {selectedStepsForRating}-step jumps only
                  </p>
                )}
              </div>
            )}

            {ratingDistribution.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={ratingDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ rating, percentage }) => `${rating}: ${percentage.toFixed(0)}%`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {ratingDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={RATING_COLORS[entry.rating] || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {ratingDistribution.map((item) => (
                    <div key={item.rating} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: RATING_COLORS[item.rating] }}
                        ></div>
                        <span className="capitalize font-medium">{item.rating}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600">{item.count} jumps</span>
                        <span className="font-semibold text-gray-900">{item.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                {selectedStepsForRating !== null
                  ? `No rating data available for ${selectedStepsForRating}-step jumps`
                  : 'No rating data available yet'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pole Usage Analytics */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Pole Usage Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {poleUsage.length > 0 ? (
            <div className="space-y-4">
              {poleUsage.slice(0, 5).map((pole, index) => (
                <div key={pole.poleId} className="border-b pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{pole.poleName}</p>
                        <p className="text-xs text-gray-500">{pole.jumps} jumps</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">{pole.successRate.toFixed(1)}%</p>
                      <p className="text-xs text-gray-500">
                        {pole.avgHeight > 0 ? `${pole.avgHeight.toFixed(2)}m avg` : 'No height data'}
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${pole.successRate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No pole usage data available yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Environmental & Technical Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="w-5 h-5" />
              Indoor vs Outdoor Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {environmentalData.indoor.jumps > 0 && (
                <div className="border rounded-lg p-4 bg-blue-50">
                  <p className="font-semibold text-blue-900 mb-2">Indoor</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Jumps</p>
                      <p className="font-bold">{environmentalData.indoor.jumps}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Success</p>
                      <p className="font-bold text-green-600">
                        {((environmentalData.indoor.makes / environmentalData.indoor.jumps) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Avg Height</p>
                      <p className="font-bold">{environmentalData.indoor.avgHeight.toFixed(2)}m</p>
                    </div>
                  </div>
                </div>
              )}

              {environmentalData.outdoor.jumps > 0 && (
                <div className="border rounded-lg p-4 bg-green-50">
                  <p className="font-semibold text-green-900 mb-2">Outdoor</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Jumps</p>
                      <p className="font-bold">{environmentalData.outdoor.jumps}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Success</p>
                      <p className="font-bold text-green-600">
                        {((environmentalData.outdoor.makes / environmentalData.outdoor.jumps) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Avg Height</p>
                      <p className="font-bold">{environmentalData.outdoor.avgHeight.toFixed(2)}m</p>
                    </div>
                  </div>
                </div>
              )}

              {environmentalData.indoor.jumps === 0 && environmentalData.outdoor.jumps === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No environmental data available yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Technical Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {technicalMetrics.avgGripHeight > 0 && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-gray-600">Avg Grip Height</span>
                  <span className="font-semibold">{technicalMetrics.avgGripHeight.toFixed(2)}m</span>
                </div>
              )}
              {technicalMetrics.avgSteps > 0 && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-gray-600">Avg Steps</span>
                  <span className="font-semibold">{technicalMetrics.avgSteps.toFixed(1)}</span>
                </div>
              )}
              {technicalMetrics.avgRunUpLength > 0 && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-gray-600">Avg Run-Up Length</span>
                  <span className="font-semibold">{technicalMetrics.avgRunUpLength.toFixed(2)}m</span>
                </div>
              )}
              {technicalMetrics.avgTakeOff > 0 && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Avg Take-Off</span>
                  <span className="font-semibold">{technicalMetrics.avgTakeOff.toFixed(2)}m</span>
                </div>
              )}
              {technicalMetrics.avgGripHeight === 0 && technicalMetrics.avgSteps === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No technical data available yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grip Height Trend */}
      {technicalMetrics.gripHeightTrend.some(d => d.avgGrip > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Grip Height Progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={technicalMetrics.gripHeightTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="session" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} label={{ value: 'Grip Height (m)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avgGrip" stroke="#8b5cf6" strokeWidth={2} name="Avg Grip Height" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VaultAnalytics;
