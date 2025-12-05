import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useVaultSessions, useVaultStats } from '@/hooks/useVaultData';
import { formatDate, formatHeight, ratingLabels } from '@/types/vault';
import {
  BarChart3,
  Calendar,
  Target,
  Wrench,
  Video,
  Download,
  Smartphone,
  Activity,
  PartyPopper,
  Sparkles,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

const VaultDashboard = () => {
  const { user } = useFirebaseAuth();
  const { sessions, loading: sessionsLoading } = useVaultSessions(user);
  const { stats, loading: statsLoading } = useVaultStats(user, sessions);
  const [showWelcome, setShowWelcome] = useState(false);

  const loading = sessionsLoading || statsLoading;

  // Check if this is the user's first visit to the dashboard
  useEffect(() => {
    if (user) {
      const welcomeKey = `vault_welcome_shown_${user.uid}`;
      const hasSeenWelcome = localStorage.getItem(welcomeKey);

      if (!hasSeenWelcome) {
        // Small delay so the page loads first
        const timer = setTimeout(() => {
          setShowWelcome(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const handleCloseWelcome = () => {
    if (user) {
      localStorage.setItem(`vault_welcome_shown_${user.uid}`, 'true');
    }
    setShowWelcome(false);
  };

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
      {/* Welcome Dialog for First-Time Users */}
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-vault-primary to-vault-primary-dark rounded-full flex items-center justify-center">
                <PartyPopper className="w-8 h-8 text-white" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-vault-text text-center">
              Welcome to VAULT Pro!
            </DialogTitle>
            <DialogDescription className="text-center text-vault-text-secondary pt-2">
              Your account is all set up and ready to go. Here's what you can do:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-vault-primary-muted/50">
              <Smartphone className="w-5 h-5 text-vault-primary mt-0.5" />
              <div>
                <p className="font-medium text-vault-text text-sm">Download the Mobile App</p>
                <p className="text-xs text-vault-text-secondary">Log training sessions, videos, and track your progress on the go</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-vault-primary-muted/50">
              <BarChart3 className="w-5 h-5 text-vault-primary mt-0.5" />
              <div>
                <p className="font-medium text-vault-text text-sm">View Your Analytics</p>
                <p className="text-xs text-vault-text-secondary">Your training data syncs here automatically for deeper analysis</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-vault-primary-muted/50">
              <Sparkles className="w-5 h-5 text-vault-primary mt-0.5" />
              <div>
                <p className="font-medium text-vault-text text-sm">Enjoy Pro Features</p>
                <p className="text-xs text-vault-text-secondary">Unlimited sessions, video storage, and advanced analytics</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleCloseWelcome}
            className="w-full bg-gradient-to-r from-vault-primary-dark to-vault-primary text-white font-semibold py-6 rounded-xl hover:shadow-vault-md transition-all"
          >
            Let's Go!
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </DialogContent>
      </Dialog>

      {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl p-4 border border-vault-border-light animate-pulse">
                  <div className="h-3 bg-vault-primary-muted rounded w-20 mb-2" />
                  <div className="h-7 bg-vault-primary-muted rounded w-16 mb-1" />
                  <div className="h-3 bg-vault-primary-muted rounded w-24" />
                </div>
              ))
            ) : (
              dashboardStats.map((stat, index) => {
                const cardContent = (
                  <div
                    key={index}
                    className={`bg-white rounded-xl p-4 border border-vault-border-light hover:border-vault-primary/20 hover:bg-slate-50 transition-colors ${stat.route ? 'cursor-pointer' : ''}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
                      <p className="text-xs font-medium text-vault-text-secondary">
                        {stat.title}
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-vault-text mb-0.5">
                      {stat.value}
                    </p>
                    <p className="text-xs text-vault-text-muted">
                      {stat.change}
                    </p>
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
                    // Loading skeleton - simple design
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="p-4 rounded-xl border border-vault-border-light bg-white animate-pulse">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="h-4 bg-vault-primary-muted rounded w-24" />
                            <div className="h-5 bg-vault-primary-muted rounded w-16" />
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="h-4 bg-vault-primary-muted rounded w-12" />
                            <div className="h-4 bg-vault-primary-muted rounded w-16" />
                          </div>
                        </div>
                        <div className="h-3 bg-vault-primary-muted rounded w-32" />
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
                    // Recent sessions - Clean, minimal design
                    sessions.slice(0, 5).map((session, index) => {
                      const sessionDate = new Date(session.date);
                      const today = new Date();
                      const yesterday = new Date(today);
                      yesterday.setDate(yesterday.getDate() - 1);

                      // Format date
                      const dayOfWeek = sessionDate.toLocaleDateString('en-US', { weekday: 'short' });
                      const monthDay = sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                      let dateLabel;
                      if (sessionDate.toDateString() === today.toDateString()) {
                        dateLabel = `Today, ${dayOfWeek}`;
                      } else if (sessionDate.toDateString() === yesterday.toDateString()) {
                        dateLabel = `Yesterday, ${dayOfWeek}`;
                      } else {
                        dateLabel = `${monthDay}, ${dayOfWeek}`;
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

                      const isCompetition = session.sessionType?.toLowerCase() === 'competition';

                      return (
                        <Link
                          key={session.id || index}
                          to={`/vault/sessions/${session.id}`}
                          className="block group"
                        >
                          <div className="p-4 rounded-xl border border-vault-border-light bg-white hover:bg-slate-50 hover:border-vault-primary/20 transition-colors">
                            {/* Top row */}
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-3">
                                <span className="font-medium text-vault-text">{dateLabel}</span>
                                {session.sessionType && (
                                  <Badge
                                    variant="outline"
                                    className={`text-xs px-2 py-0.5 font-medium ${
                                      isCompetition
                                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                                        : 'bg-vault-primary-muted text-vault-primary border-vault-primary/20'
                                    }`}
                                  >
                                    {session.sessionType}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                {bestJump && (
                                  <span className="font-semibold text-vault-text">
                                    {formatHeight(bestJump.height, bestJump.barUnits)}
                                  </span>
                                )}
                                <span className="text-vault-text-muted">
                                  {jumps.length} {jumps.length === 1 ? 'jump' : 'jumps'}
                                </span>
                                {isCompetition && jumps.length > 0 && (
                                  <span className={`font-medium ${
                                    makeRate >= 75 ? 'text-green-600' :
                                    makeRate >= 50 ? 'text-amber-600' : 'text-red-500'
                                  }`}>
                                    {makeRate}%
                                  </span>
                                )}
                                <ChevronRight className="w-4 h-4 text-vault-text-muted group-hover:text-vault-primary transition-colors" />
                              </div>
                            </div>
                            {/* Location */}
                            {session.location && (
                              <p className="text-sm text-vault-text-secondary">{session.location}</p>
                            )}
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
                <Link to="/vault/equipment" className="flex items-center gap-3 p-3 rounded-xl border border-vault-border hover:bg-vault-primary-muted/50 hover:border-vault-primary/30 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-vault-primary/10 flex items-center justify-center group-hover:bg-vault-primary/20 transition-colors">
                    <Wrench className="h-5 w-5 text-vault-primary" />
                  </div>
                  <span className="font-medium text-vault-text group-hover:text-vault-primary transition-colors">Manage Equipment</span>
                </Link>
                <Link to="/vault/videos" className="flex items-center gap-3 p-3 rounded-xl border border-vault-border hover:bg-amber-50/50 hover:border-amber-200 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                    <Video className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="font-medium text-vault-text group-hover:text-amber-600 transition-colors">View Training Videos</span>
                </Link>
                <Link to="/vault/analytics" className="flex items-center gap-3 p-3 rounded-xl border border-vault-border hover:bg-green-50/50 hover:border-green-200 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="font-medium text-vault-text group-hover:text-green-600 transition-colors">Performance Analytics</span>
                </Link>

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
                    <Button asChild size="sm" variant="outline" className="border-white/30 bg-white text-vault-primary hover:bg-white/90 rounded-lg font-medium">
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