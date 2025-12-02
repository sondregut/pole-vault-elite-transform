import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
      color: "text-vault-primary",
      bgColor: "bg-vault-primary-muted",
      route: "/vault/sessions"
    },
    {
      title: "Personal Best",
      value: formatHeight(stats.personalBest, stats.personalBestUnits),
      icon: Target,
      change: stats.thisMonthPBImprovement !== '0.00' ? `+${stats.thisMonthPBImprovement}m this month` : 'No recent PB',
      color: "text-vault-success",
      bgColor: "bg-green-50",
      route: null
    },
    {
      title: "Active Poles",
      value: stats.activePoles.toString(),
      icon: Wrench,
      change: `${Math.min(stats.activePoles, 2)} most used`,
      color: "text-vault-primary",
      bgColor: "bg-vault-primary-muted",
      route: "/vault/equipment"
    },
    {
      title: "Training Videos",
      value: stats.totalVideos.toString(),
      icon: Video,
      change: `${Math.floor(stats.totalVideos / Math.max(stats.totalSessions, 1))} avg per session`,
      color: "text-vault-warning",
      bgColor: "bg-amber-50",
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
                <div key={index} className="bg-white rounded-2xl p-6 shadow-vault border border-vault-border-light">
                  <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-vault-primary-muted"></div>
                      <div className="w-4 h-4 bg-vault-primary-muted rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-vault-primary-muted rounded w-3/4"></div>
                      <div className="h-6 bg-vault-primary-muted rounded w-1/2"></div>
                      <div className="h-3 bg-vault-primary-muted rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              dashboardStats.map((stat, index) => {
                const cardContent = (
                  <div
                    key={index}
                    className={`bg-white rounded-2xl p-6 shadow-vault border border-vault-border-light hover:shadow-vault-md hover:-translate-y-1 transition-all duration-200 ${stat.route ? 'cursor-pointer' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <TrendingUp className="h-4 w-4 text-vault-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-vault-text-secondary mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-vault-text mb-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-vault-success font-medium">
                        {stat.change}
                      </p>
                    </div>
                  </div>
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
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-vault border border-vault-border-light overflow-hidden">
              <div className="px-6 py-5 border-b border-vault-border-light">
                <h2 className="text-xl font-bold text-vault-text flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-vault-primary-muted flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-vault-primary" />
                  </div>
                  Recent Training Sessions
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {loading ? (
                    // Loading skeleton for sessions
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-vault-border-light animate-pulse">
                        <div className="flex-1">
                          <div className="h-4 bg-vault-primary-muted rounded w-24 mb-2"></div>
                          <div className="h-3 bg-vault-primary-muted rounded w-32"></div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="h-3 bg-vault-primary-muted rounded w-8 mb-2"></div>
                            <div className="h-4 bg-vault-primary-muted rounded w-12"></div>
                          </div>
                          <div className="text-right">
                            <div className="h-3 bg-vault-primary-muted rounded w-10 mb-2"></div>
                            <div className="h-4 bg-vault-primary-muted rounded w-8"></div>
                          </div>
                          <div className="text-right">
                            <div className="h-3 bg-vault-primary-muted rounded w-8 mb-2"></div>
                            <div className="h-4 bg-vault-primary-muted rounded w-10"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : sessions.length === 0 ? (
                    // Empty state
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-vault-primary-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Activity className="h-8 w-8 text-vault-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-vault-text mb-2">
                        No training sessions yet
                      </h3>
                      <p className="text-vault-text-secondary mb-4">
                        Start tracking your pole vault sessions in the mobile app
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button size="sm" className="bg-gradient-to-r from-vault-primary-dark to-vault-primary text-white hover:shadow-vault-md transition-all">
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
                          <div className="flex items-center justify-between p-4 rounded-xl border border-vault-border-light hover:bg-vault-primary-muted/50 hover:border-vault-primary/20 transition-all">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <p className="font-semibold text-vault-text">{dateLabel}</p>
                                {session.sessionType && (
                                  <Badge variant="outline" className="text-xs border-vault-primary/30 text-vault-primary bg-vault-primary-muted">
                                    {session.sessionType}
                                  </Badge>
                                )}
                              </div>
                              {session.location && (
                                <p className="text-sm text-vault-text-secondary">{session.location}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-6 text-right">
                              <div>
                                <p className="text-sm text-vault-text-muted">Best</p>
                                {bestJump ? (
                                  <p className="font-semibold text-vault-text">
                                    {formatHeight(bestJump.height, bestJump.barUnits)}
                                  </p>
                                ) : (
                                  <p className="text-sm text-vault-text-muted">-</p>
                                )}
                              </div>
                              <div>
                                <p className="text-sm text-vault-text-muted">Jumps</p>
                                <p className="font-semibold text-vault-text">{jumps.length}</p>
                              </div>
                              {session.sessionType?.toLowerCase() !== 'training' && (
                                <div>
                                  <p className="text-sm text-vault-text-muted">Rate</p>
                                  <p className="font-semibold text-vault-text">{makeRate}%</p>
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
                  <Button asChild variant="outline" className="w-full mt-4 border-vault-primary text-vault-primary hover:bg-vault-primary-muted font-semibold rounded-xl">
                    <Link to="/vault/sessions">
                      View All Sessions
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-vault border border-vault-border-light overflow-hidden">
              <div className="px-6 py-5 border-b border-vault-border-light">
                <h2 className="text-xl font-bold text-vault-text">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <Button asChild variant="outline" className="w-full justify-start border-vault-border hover:bg-vault-primary-muted hover:border-vault-primary/20 text-vault-text-secondary hover:text-vault-primary transition-all rounded-xl">
                  <Link to="/vault/equipment">
                    <div className="w-8 h-8 rounded-lg bg-vault-primary-muted flex items-center justify-center mr-3">
                      <Wrench className="h-4 w-4 text-vault-primary" />
                    </div>
                    Manage Equipment
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start border-vault-border hover:bg-vault-primary-muted hover:border-vault-primary/20 text-vault-text-secondary hover:text-vault-primary transition-all rounded-xl">
                  <Link to="/vault/videos">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center mr-3">
                      <Video className="h-4 w-4 text-vault-warning" />
                    </div>
                    View Training Videos
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start border-vault-border hover:bg-vault-primary-muted hover:border-vault-primary/20 text-vault-text-secondary hover:text-vault-primary transition-all rounded-xl">
                  <Link to="/vault/analytics">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center mr-3">
                      <BarChart3 className="h-4 w-4 text-vault-success" />
                    </div>
                    Performance Analytics
                  </Link>
                </Button>

                <div className="pt-4 mt-4 border-t border-vault-border-light">
                  <p className="text-sm text-vault-text-secondary mb-3">
                    Download mobile app:
                  </p>
                  <Button size="sm" className="w-full bg-gradient-to-r from-vault-primary-dark to-vault-primary text-white font-semibold rounded-xl hover:shadow-vault-md transition-all">
                    <Smartphone className="mr-2 h-4 w-4" />
                    iOS App
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Data Notice */}
          <div className="mt-8">
            <div className="bg-gradient-to-r from-vault-primary-dark to-vault-primary rounded-2xl p-6 shadow-vault-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">
                    Your training data syncs automatically
                  </h3>
                  <p className="text-white/90 mb-4">
                    All sessions, jumps, and videos logged in your mobile app appear here in real-time.
                    Use this dashboard to analyze patterns and track long-term progress.
                  </p>
                  <div className="flex gap-3">
                    <Button asChild size="sm" className="bg-white text-vault-primary hover:bg-white/90 font-semibold rounded-lg">
                      <Link to="/vault">
                        Learn More About Vault
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-lg">
                      <a href="mailto:support@vaultapp.com">
                        Need Help?
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
    </div>
  );
};

export default VaultDashboard;