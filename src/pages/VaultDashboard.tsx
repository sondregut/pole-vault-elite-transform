import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useVaultSessions, useVaultStats } from '@/hooks/useVaultData';
import { formatDate, formatHeight, ratingLabels } from '@/types/vault';
import {
  BarChart3,
  Calendar,
  Target,
  Wrench,
  Video,
  TrendingUp,
  Download,
  Smartphone,
  Activity,
  Clock
} from 'lucide-react';

const VaultDashboard = () => {
  const { user } = useFirebaseAuth();
  const { sessions, loading: sessionsLoading } = useVaultSessions(user);
  const { stats, loading: statsLoading } = useVaultStats(user, sessions);

  const loading = sessionsLoading || statsLoading;

  const dashboardStats = stats ? [
    {
      title: "Total Sessions",
      value: stats.totalSessions.toString(),
      icon: Calendar,
      change: `+${stats.thisWeekSessions} this week`,
      color: "text-blue-600",
      route: "/vault/sessions"
    },
    {
      title: "Personal Best",
      value: formatHeight(stats.personalBest, stats.personalBestUnits),
      icon: Target,
      change: stats.thisMonthPBImprovement !== '0.00' ? `+${stats.thisMonthPBImprovement}m this month` : 'No recent PB',
      color: "text-green-600",
      route: null
    },
    {
      title: "Active Poles",
      value: stats.activePoles.toString(),
      icon: Wrench,
      change: `${Math.min(stats.activePoles, 2)} most used`,
      color: "text-purple-600",
      route: "/vault/equipment"
    },
    {
      title: "Training Videos",
      value: stats.totalVideos.toString(),
      icon: Video,
      change: `${Math.floor(stats.totalVideos / Math.max(stats.totalSessions, 1))} avg per session`,
      color: "text-orange-600",
      route: "/vault/videos"
    }
  ] : [];

  return (
    <div>
      {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-200"></div>
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              dashboardStats.map((stat, index) => {
                const cardContent = (
                  <Card key={index} className={`border-2 hover:shadow-lg transition-shadow ${stat.route ? 'cursor-pointer' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center`}>
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mb-1">
                          {stat.value}
                        </p>
                        <p className="text-xs text-green-600 font-medium">
                          {stat.change}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );

                return stat.route ? (
                  <Link key={index} to={stat.route} className="block">
                    {cardContent}
                  </Link>
                ) : (
                  cardContent
                );
              })
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Sessions */}
            <Card className="lg:col-span-2 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Recent Training Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    // Loading skeleton for sessions
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border animate-pulse">
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="h-3 bg-gray-200 rounded w-8 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-12"></div>
                          </div>
                          <div className="text-right">
                            <div className="h-3 bg-gray-200 rounded w-10 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-8"></div>
                          </div>
                          <div className="text-right">
                            <div className="h-3 bg-gray-200 rounded w-8 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-10"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : sessions.length === 0 ? (
                    // Empty state
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No training sessions yet
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Start tracking your pole vault sessions in the mobile app
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button size="sm" variant="outline">
                          <Download className="mr-1 h-3 w-3" />
                          Download App
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Recent sessions
                    sessions.slice(0, 5).map((session, index) => {
                      const sessionDate = new Date(session.date);
                      const today = new Date();
                      const yesterday = new Date(today);
                      yesterday.setDate(yesterday.getDate() - 1);

                      let dateLabel;
                      if (sessionDate.toDateString() === today.toDateString()) {
                        dateLabel = 'Today';
                      } else if (sessionDate.toDateString() === yesterday.toDateString()) {
                        dateLabel = 'Yesterday';
                      } else {
                        dateLabel = formatDate(session.date);
                      }

                      const jumps = session.jumps || [];
                      const successfulJumps = jumps.filter(j => j.result === 'make');
                      const bestJump = successfulJumps.length > 0
                        ? successfulJumps.reduce((max, jump) => {
                            const height = parseFloat(jump.height) || 0;
                            const maxHeight = parseFloat(max.height) || 0;
                            return height > maxHeight ? jump : max;
                          })
                        : null;

                      const makeRate = jumps.length > 0
                        ? Math.round((successfulJumps.length / jumps.length) * 100)
                        : 0;

                      return (
                        <Link
                          key={session.id || index}
                          to={`/vault/sessions/${session.id}`}
                          className="block"
                        >
                          <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <p className="font-semibold text-gray-900">{dateLabel}</p>
                                {session.sessionType && (
                                  <Badge variant="outline" className="text-xs">
                                    {session.sessionType}
                                  </Badge>
                                )}
                              </div>
                              {session.location && (
                                <p className="text-sm text-gray-600">{session.location}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-6 text-right">
                              <div>
                                <p className="text-sm text-gray-600">Best</p>
                                {bestJump ? (
                                  <p className="font-semibold text-gray-900">
                                    {formatHeight(bestJump.height, bestJump.barUnits)}
                                  </p>
                                ) : (
                                  <p className="text-sm text-gray-500">-</p>
                                )}
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Jumps</p>
                                <p className="font-semibold text-gray-900">{jumps.length}</p>
                              </div>
                              {session.sessionType?.toLowerCase() !== 'training' && (
                                <div>
                                  <p className="text-sm text-gray-600">Rate</p>
                                  <p className="font-semibold text-gray-900">{makeRate}%</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
                {!loading && sessions.length > 0 && (
                  <Button asChild variant="outline" className="w-full mt-4">
                    <Link to="/vault/sessions">
                      View All Sessions
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/vault/equipment">
                    <Wrench className="mr-2 h-4 w-4" />
                    Manage Equipment
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/vault/videos">
                    <Video className="mr-2 h-4 w-4" />
                    View Training Videos
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/vault/analytics">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Performance Analytics
                  </Link>
                </Button>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-3">
                    Download mobile app:
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Smartphone className="mr-1 h-3 w-3" />
                    iOS App
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Notice */}
          <div className="mt-8">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Smartphone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Your training data syncs automatically
                    </h3>
                    <p className="text-blue-800 mb-4">
                      All sessions, jumps, and videos logged in your mobile app appear here in real-time.
                      Use this dashboard to analyze patterns and track long-term progress.
                    </p>
                    <div className="flex gap-3">
                      <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Link to="/vault">
                          Learn More About Vault
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <a href="mailto:support@vaultapp.com">
                          Need Help?
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
    </div>
  );
};

export default VaultDashboard;