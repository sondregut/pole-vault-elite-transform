import { useState, useMemo } from 'react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useVaultSessions, useVaultStats } from '@/hooks/useVaultData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Target,
  Calendar,
  Video,
  Award,
  Wind,
  Filter,
  Trophy,
  Dumbbell,
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Info
} from 'lucide-react';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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

// Time range options matching mobile app
type TimeRange = '30D' | '60D' | '90D' | '1Y' | 'ALL';

const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: '30D', label: '30D' },
  { value: '60D', label: '60D' },
  { value: '90D', label: '90D' },
  { value: '1Y', label: '1Y' },
  { value: 'ALL', label: 'All' },
];
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
  const [selectedStepsForTechnical, setSelectedStepsForTechnical] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('ALL');
  const [heightProgressionFilter, setHeightProgressionFilter] = useState<'all' | 'training' | 'competition'>('all');
  const [showAllPoles, setShowAllPoles] = useState(false);

  // Filter sessions by time range
  const filteredSessionsByTime = useMemo(() => {
    if (timeRange === 'ALL') return sessions;

    const now = new Date();
    let cutoffDate = new Date();

    switch (timeRange) {
      case '30D':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '60D':
        cutoffDate.setDate(now.getDate() - 60);
        break;
      case '90D':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case '1Y':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return sessions.filter(session => new Date(session.date) >= cutoffDate);
  }, [sessions, timeRange]);

  // Calculate session type statistics (Training vs Competition)
  const sessionTypeStats = useMemo(() => {
    const training = filteredSessionsByTime.filter(s =>
      !s.sessionType?.toLowerCase().includes('competition')
    );
    const competition = filteredSessionsByTime.filter(s =>
      s.sessionType?.toLowerCase().includes('competition')
    );

    const getStats = (sessionList: typeof sessions) => {
      const totalJumps = sessionList.reduce((sum, s) => sum + (s.jumps?.length || 0), 0);
      const successfulJumps = sessionList.reduce((sum, s) =>
        sum + (s.jumps?.filter(j => j.result === 'make').length || 0), 0
      );
      const heights = sessionList.flatMap(s =>
        s.jumps?.filter(j => j.result === 'make' && j.height).map(j => parseFloat(j.height)) || []
      ).filter(h => !isNaN(h) && h > 0);
      const bestHeight = heights.length > 0 ? Math.max(...heights) : 0;
      const avgHeight = heights.length > 0 ? heights.reduce((a, b) => a + b, 0) / heights.length : 0;

      return {
        sessions: sessionList.length,
        jumps: totalJumps,
        successRate: totalJumps > 0 ? (successfulJumps / totalJumps) * 100 : 0,
        bestHeight,
        avgHeight
      };
    };

    return {
      training: getStats(training),
      competition: getStats(competition)
    };
  }, [filteredSessionsByTime]);

  // Get available step counts from all jumps - MUST be called before any conditional returns
  const availableSteps = useMemo(() => {
    const stepsSet = new Set<number>();
    filteredSessionsByTime.forEach(session => {
      session.jumps?.forEach(jump => {
        if (jump.steps && jump.steps > 0) {
          stepsSet.add(jump.steps);
        }
      });
    });
    return Array.from(stepsSet).sort((a, b) => a - b);
  }, [filteredSessionsByTime]);

  // Filter sessions for rating distribution only
  const filteredSessionsForRating = useMemo(() => {
    if (selectedStepsForRating === null) return filteredSessionsByTime;

    return filteredSessionsByTime.map(session => ({
      ...session,
      jumps: session.jumps?.filter(jump => jump.steps === selectedStepsForRating) || []
    })).filter(session => session.jumps.length > 0);
  }, [filteredSessionsByTime, selectedStepsForRating]);

  // Calculate analytics data - use time-filtered sessions
  const successRate = useMemo(() => calculateSuccessRate(filteredSessionsByTime), [filteredSessionsByTime]);
  const poleUsage = useMemo(() => calculatePoleUsage(filteredSessionsByTime), [filteredSessionsByTime]);
  const ratingDistribution = useMemo(() => calculateRatingDistribution(filteredSessionsForRating), [filteredSessionsForRating]);
  const environmentalData = useMemo(() => calculateEnvironmentalData(filteredSessionsByTime), [filteredSessionsByTime]);
  const technicalMetrics = useMemo(() => calculateTechnicalMetrics(filteredSessionsByTime), [filteredSessionsByTime]);

  // Filter sessions for height progression by session type
  const filteredSessionsForHeightProgression = useMemo(() => {
    if (heightProgressionFilter === 'all') return filteredSessionsByTime;
    if (heightProgressionFilter === 'training') {
      return filteredSessionsByTime.filter(s => !s.sessionType?.toLowerCase().includes('competition'));
    }
    return filteredSessionsByTime.filter(s => s.sessionType?.toLowerCase().includes('competition'));
  }, [filteredSessionsByTime, heightProgressionFilter]);

  const heightProgression = useMemo(() => calculateHeightProgression(filteredSessionsForHeightProgression), [filteredSessionsForHeightProgression]);

  // Calculate total stats for the filtered period
  const filteredStats = useMemo(() => {
    const totalSessions = filteredSessionsByTime.length;
    const totalJumps = filteredSessionsByTime.reduce((sum, s) => sum + (s.jumps?.length || 0), 0);
    const totalVideos = filteredSessionsByTime.reduce((sum, s) =>
      sum + (s.jumps?.filter(j => j.videoUrl || j.videoLocalUri).length || 0), 0
    );
    const heights = filteredSessionsByTime.flatMap(s =>
      s.jumps?.filter(j => j.result === 'make' && j.height).map(j => parseFloat(j.height)) || []
    ).filter(h => !isNaN(h) && h > 0);
    const personalBest = heights.length > 0 ? Math.max(...heights) : 0;

    return { totalSessions, totalJumps, totalVideos, personalBest };
  }, [filteredSessionsByTime]);

  // Calculate success rate trend over time for the chart
  const successRateTrend = useMemo(() => {
    const sessionsWithJumps = filteredSessionsByTime
      .filter(s => s.jumps && s.jumps.length > 0)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10);

    return sessionsWithJumps.map(session => {
      const jumps = session.jumps || [];
      const makes = jumps.filter(j => j.result === 'make').length;
      const rate = jumps.length > 0 ? (makes / jumps.length) * 100 : 0;
      const date = new Date(session.date);
      return {
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        successRate: parseFloat(rate.toFixed(1)),
        jumps: jumps.length
      };
    });
  }, [filteredSessionsByTime]);

  // Calculate jump distribution by steps
  const jumpDistributionBySteps = useMemo(() => {
    const distribution: Record<number, { steps: number; count: number }> = {};

    filteredSessionsByTime.forEach(session => {
      session.jumps?.forEach(jump => {
        if (jump.steps && jump.steps > 0) {
          if (!distribution[jump.steps]) {
            distribution[jump.steps] = { steps: jump.steps, count: 0 };
          }
          distribution[jump.steps].count++;
        }
      });
    });

    return Object.values(distribution)
      .sort((a, b) => a.steps - b.steps)
      .map(d => ({
        ...d,
        name: `${d.steps} step${d.steps > 1 ? 's' : ''}`
      }));
  }, [filteredSessionsByTime]);

  // Calculate technical metrics filtered by step count
  const filteredTechnicalMetrics = useMemo(() => {
    const allJumps = filteredSessionsByTime.flatMap(s => s.jumps || []);
    const jumps = selectedStepsForTechnical
      ? allJumps.filter(j => j.steps === selectedStepsForTechnical)
      : allJumps;

    const withGrip = jumps.filter(j => j.gripHeight && parseFloat(j.gripHeight) > 0);
    const withRunUp = jumps.filter(j => j.runUpLength && parseFloat(j.runUpLength) > 0);
    const withTakeOff = jumps.filter(j => j.takeOff && parseFloat(j.takeOff) > 0);
    const withSteps = jumps.filter(j => j.steps && j.steps > 0);

    return {
      avgGripHeight: withGrip.length > 0
        ? withGrip.reduce((sum, j) => sum + parseFloat(j.gripHeight!), 0) / withGrip.length
        : 0,
      avgRunUpLength: withRunUp.length > 0
        ? withRunUp.reduce((sum, j) => sum + parseFloat(j.runUpLength!), 0) / withRunUp.length
        : 0,
      avgTakeOff: withTakeOff.length > 0
        ? withTakeOff.reduce((sum, j) => sum + parseFloat(j.takeOff!), 0) / withTakeOff.length
        : 0,
      avgSteps: withSteps.length > 0
        ? withSteps.reduce((sum, j) => sum + j.steps!, 0) / withSteps.length
        : 0,
      totalJumps: jumps.length
    };
  }, [filteredSessionsByTime, selectedStepsForTechnical]);

  // NOW we can do conditional returns after all hooks are called
  if (!user) {
    return null;
  }

  const loading = sessionsLoading || statsLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vault-primary mx-auto mb-4"></div>
          <p className="text-vault-text-secondary">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Chart colors - updated to vault theme
  const COLORS = ['#072f57', '#198754', '#F59E0B', '#EF4444', '#8b5cf6'];
  const RATING_COLORS: Record<string, string> = {
    'run-thru': '#EF4444',
    'glider': '#F59E0B',
    'ok': '#072f57',
    'good': '#198754',
    'great': '#8b5cf6'
  };

  return (
    <div>
      {/* Header with Time Range Filter */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-vault-primary-muted text-vault-primary border-vault-primary/20">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-vault-text">Performance Analytics</h1>
            <p className="text-vault-text-secondary mt-1">
              Track your progress and analyze your performance over time
            </p>
          </div>

          {/* Time Range Filter - Mobile App Style */}
          <div className="flex items-center bg-white rounded-xl border border-vault-border-light shadow-vault p-1">
            {TIME_RANGE_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant="ghost"
                size="sm"
                onClick={() => setTimeRange(option.value)}
                className={`h-9 px-4 rounded-lg font-semibold transition-all ${
                  timeRange === option.value
                    ? 'bg-vault-primary text-white hover:bg-vault-primary-dark'
                    : 'text-vault-text-secondary hover:text-vault-primary hover:bg-vault-primary-muted'
                }`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Stats - 3 Column Mobile Style */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-vault border border-vault-border-light">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-vault-primary-muted flex items-center justify-center">
              <Calendar className="h-4 w-4 text-vault-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-vault-text">{filteredStats.totalSessions}</p>
          <p className="text-xs text-vault-text-secondary font-medium">Sessions</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-vault border border-vault-border-light">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-vault-primary-muted flex items-center justify-center">
              <Activity className="h-4 w-4 text-vault-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-vault-text">{filteredStats.totalJumps}</p>
          <p className="text-xs text-vault-text-secondary font-medium">Total Jumps</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-vault border border-vault-border-light">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <Trophy className="h-4 w-4 text-vault-success" />
            </div>
          </div>
          <p className="text-2xl font-bold text-vault-text">
            {filteredStats.personalBest > 0 ? `${filteredStats.personalBest.toFixed(2)}m` : '—'}
          </p>
          <p className="text-xs text-vault-text-secondary font-medium">Best Height</p>
        </div>
      </div>

      {/* Session Type Comparison - Training vs Competition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Training Card */}
        <div className="bg-white rounded-2xl shadow-vault border border-vault-border-light overflow-hidden">
          <div className="px-5 py-4 border-b border-vault-border-light bg-vault-primary-muted">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-vault-primary/10 flex items-center justify-center">
                <Dumbbell className="h-4 w-4 text-vault-primary" />
              </div>
              <h3 className="font-bold text-vault-text">Training</h3>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-vault-text-muted mb-1">Sessions</p>
                <p className="text-xl font-bold text-vault-text">{sessionTypeStats.training.sessions}</p>
              </div>
              <div>
                <p className="text-xs text-vault-text-muted mb-1">Jumps</p>
                <p className="text-xl font-bold text-vault-text">{sessionTypeStats.training.jumps}</p>
              </div>
              <div>
                <p className="text-xs text-vault-text-muted mb-1">Best Height</p>
                <p className="text-xl font-bold text-vault-text">
                  {sessionTypeStats.training.bestHeight > 0 ? `${sessionTypeStats.training.bestHeight.toFixed(2)}m` : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Competition Card */}
        <div className="bg-white rounded-2xl shadow-vault border border-vault-border-light overflow-hidden">
          <div className="px-5 py-4 border-b border-vault-border-light bg-amber-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Trophy className="h-4 w-4 text-vault-warning" />
              </div>
              <h3 className="font-bold text-vault-text">Competition</h3>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-vault-text-muted mb-1">Sessions</p>
                <p className="text-xl font-bold text-vault-text">{sessionTypeStats.competition.sessions}</p>
              </div>
              <div>
                <p className="text-xs text-vault-text-muted mb-1">Jumps</p>
                <p className="text-xl font-bold text-vault-text">{sessionTypeStats.competition.jumps}</p>
              </div>
              <div>
                <p className="text-xs text-vault-text-muted mb-1">Success Rate</p>
                <p className="text-xl font-bold text-vault-success">{sessionTypeStats.competition.successRate.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-xs text-vault-text-muted mb-1">Best Height</p>
                <p className="text-xl font-bold text-vault-text">
                  {sessionTypeStats.competition.bestHeight > 0 ? `${sessionTypeStats.competition.bestHeight.toFixed(2)}m` : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Rate Trend Chart */}
      <div className="bg-white rounded-2xl shadow-vault border border-vault-border-light overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-vault-border-light">
          <h2 className="text-xl font-bold text-vault-text flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <Target className="h-4 w-4 text-vault-success" />
            </div>
            Success Rate Trend
          </h2>
          <p className="text-sm text-vault-text-muted mt-1">Track your success rate over recent sessions</p>
        </div>
        <div className="p-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <p className="text-2xl font-bold text-vault-success">{successRate.successRate.toFixed(1)}%</p>
              <p className="text-xs text-vault-text-secondary">Success Rate</p>
            </div>
            <div className="text-center p-3 bg-vault-primary-muted rounded-xl">
              <p className="text-2xl font-bold text-vault-primary">{successRate.makes}</p>
              <p className="text-xs text-vault-text-secondary">Makes</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-vault-text-muted">{successRate.misses}</p>
              <p className="text-xs text-vault-text-secondary">Misses</p>
            </div>
          </div>

          {/* Trend Chart */}
          {successRateTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={successRateTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b6b6b' }} />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: '#6b6b6b' }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e5e5' }}
                  formatter={(value: number) => [`${value}%`, 'Success Rate']}
                />
                <Line
                  type="monotone"
                  dataKey="successRate"
                  stroke="#198754"
                  strokeWidth={2}
                  dot={{ fill: '#198754', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-vault-text-muted">
              Not enough data for trend chart
            </div>
          )}
        </div>
      </div>

      {/* Jump Distribution by Steps */}
      {jumpDistributionBySteps.length > 0 && (
        <div className="bg-white rounded-2xl shadow-vault border border-vault-border-light overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-vault-border-light">
            <h2 className="text-xl font-bold text-vault-text flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-vault-primary-muted flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-vault-primary" />
              </div>
              Jump Distribution by Steps
            </h2>
            <p className="text-sm text-vault-text-muted mt-1">See how your performance varies by approach length</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={jumpDistributionBySteps}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b6b6b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b6b6b' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e5e5' }} />
                <Bar dataKey="count" fill="#072f57" name="Total Jumps" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-vault border border-vault-border-light overflow-hidden">
          <div className="px-6 py-5 border-b border-vault-border-light">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-vault-text flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-vault-primary-muted flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-vault-primary" />
                </div>
                Height Progression
              </h2>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <button className="w-6 h-6 rounded-full bg-vault-primary-muted flex items-center justify-center hover:bg-vault-primary/20 transition-colors">
                      <Info className="h-3.5 w-3.5 text-vault-primary" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs p-3 bg-white border border-vault-border-light shadow-vault-md rounded-xl">
                    <p className="text-sm text-vault-text leading-relaxed">
                      <strong>How heights are tracked:</strong><br />
                      In <span className="text-vault-warning font-medium">Competition</span>, heights are based on official bar heights with make/miss results.<br /><br />
                      In <span className="text-vault-primary font-medium">Training</span>, heights show bar heights from all jumps regardless of rating, as training focuses on technique development.
                    </p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="p-6">
            {/* Session Type Filter */}
            <div className="mb-4 pb-4 border-b border-vault-border-light">
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-vault-primary-muted rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setHeightProgressionFilter('all')}
                    className={`h-7 px-3 rounded-md text-xs font-semibold transition-all ${
                      heightProgressionFilter === 'all'
                        ? 'bg-vault-primary text-white hover:bg-vault-primary-dark'
                        : 'text-vault-text-secondary hover:text-vault-primary hover:bg-white'
                    }`}
                  >
                    All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setHeightProgressionFilter('training')}
                    className={`h-7 px-3 rounded-md text-xs font-semibold transition-all ${
                      heightProgressionFilter === 'training'
                        ? 'bg-vault-primary text-white hover:bg-vault-primary-dark'
                        : 'text-vault-text-secondary hover:text-vault-primary hover:bg-white'
                    }`}
                  >
                    Training
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setHeightProgressionFilter('competition')}
                    className={`h-7 px-3 rounded-md text-xs font-semibold transition-all ${
                      heightProgressionFilter === 'competition'
                        ? 'bg-vault-primary text-white hover:bg-vault-primary-dark'
                        : 'text-vault-text-secondary hover:text-vault-primary hover:bg-white'
                    }`}
                  >
                    Competition
                  </Button>
                </div>
              </div>
            </div>

            {heightProgression.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={heightProgression}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b6b6b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b6b6b' }} label={{ value: 'Height (m)', angle: -90, position: 'insideLeft', fill: '#6b6b6b' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e5e5' }} />
                  <Legend />
                  <Line type="monotone" dataKey="bestHeight" stroke="#072f57" strokeWidth={2} name="Best Height" />
                  <Line type="monotone" dataKey="avgHeight" stroke="#198754" strokeWidth={2} name="Avg Height" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-vault-text-muted">
                No height data available for {heightProgressionFilter === 'all' ? 'selected period' : heightProgressionFilter}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-vault border border-vault-border-light overflow-hidden">
          <div className="px-6 py-5 border-b border-vault-border-light">
            <h2 className="text-xl font-bold text-vault-text flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <Award className="h-4 w-4 text-vault-warning" />
              </div>
              Jump Rating Distribution
            </h2>
          </div>
          <div className="p-6">
            {/* Step Filter for Rating Distribution */}
            {availableSteps.length > 0 && (
              <div className="mb-4 pb-4 border-b border-vault-border-light">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="w-4 h-4 text-vault-text-muted" />
                  <span className="text-sm font-medium text-vault-text-secondary">Filter by Steps:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedStepsForRating === null ? "default" : "outline"}
                    onClick={() => setSelectedStepsForRating(null)}
                    size="sm"
                    className={selectedStepsForRating === null ? "bg-vault-primary hover:bg-vault-primary-dark text-white" : "border-vault-border text-vault-text-secondary hover:bg-vault-primary-muted hover:text-vault-primary"}
                  >
                    All Steps
                  </Button>
                  {availableSteps.map(steps => (
                    <Button
                      key={steps}
                      variant={selectedStepsForRating === steps ? "default" : "outline"}
                      onClick={() => setSelectedStepsForRating(steps)}
                      size="sm"
                      className={selectedStepsForRating === steps ? "bg-vault-primary hover:bg-vault-primary-dark text-white" : "border-vault-border text-vault-text-secondary hover:bg-vault-primary-muted hover:text-vault-primary"}
                    >
                      {steps} {steps === 1 ? 'Step' : 'Steps'}
                    </Button>
                  ))}
                </div>
                {selectedStepsForRating !== null && (
                  <p className="text-xs text-vault-text-muted mt-2">
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
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e5e5' }} />
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
                        <span className="capitalize font-medium text-vault-text">{item.rating}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-vault-text-muted">{item.count} jumps</span>
                        <span className="font-semibold text-vault-text">{item.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-vault-text-muted">
                {selectedStepsForRating !== null
                  ? `No rating data available for ${selectedStepsForRating}-step jumps`
                  : 'No rating data available yet'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pole Usage Analytics */}
      <div className="bg-white rounded-2xl shadow-vault border border-vault-border-light overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-vault-border-light">
          <h2 className="text-xl font-bold text-vault-text flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-vault-primary-muted flex items-center justify-center">
              <Activity className="h-4 w-4 text-vault-primary" />
            </div>
            Pole Usage Statistics
          </h2>
          <p className="text-sm text-vault-text-muted mt-1">Your most used poles by jump count</p>
        </div>
        <div className="p-6">
          {poleUsage.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(200, (showAllPoles ? poleUsage.length : Math.min(poleUsage.length, 6)) * 45)}>
              <BarChart
                data={poleUsage.slice(0, showAllPoles ? poleUsage.length : 6)}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={true} vertical={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#6b6b6b' }} />
                <YAxis
                  type="category"
                  dataKey="poleName"
                  tick={{ fontSize: 11, fill: '#6b6b6b' }}
                  width={120}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e5e5' }}
                  formatter={(value: number, name: string) => {
                    if (name === 'jumps') return [value, 'Total Jumps'];
                    return [value, name];
                  }}
                />
                <Bar dataKey="jumps" fill="#072f57" radius={[0, 4, 4, 0]} name="jumps" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-vault-text-muted">
              No pole usage data available yet
            </div>
          )}

          {/* Show More/Less Button */}
          {poleUsage.length > 6 && (
            <div className="mt-4 pt-4 border-t border-vault-border-light">
              <Button
                variant="ghost"
                onClick={() => setShowAllPoles(!showAllPoles)}
                className="w-full text-vault-primary hover:bg-vault-primary-muted font-medium"
              >
                {showAllPoles ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Show All {poleUsage.length} Poles
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Environmental & Technical Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-vault border border-vault-border-light overflow-hidden">
          <div className="px-6 py-5 border-b border-vault-border-light">
            <h2 className="text-xl font-bold text-vault-text flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-vault-primary-muted flex items-center justify-center">
                <Wind className="h-4 w-4 text-vault-primary" />
              </div>
              Indoor vs Outdoor Performance
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {environmentalData.indoor.jumps > 0 && (
                <div className="border border-vault-primary/20 rounded-xl p-4 bg-vault-primary-muted">
                  <p className="font-bold text-vault-primary mb-2">Indoor</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-vault-text-muted">Jumps</p>
                      <p className="font-bold text-vault-text">{environmentalData.indoor.jumps}</p>
                    </div>
                    <div>
                      <p className="text-vault-text-muted">Success</p>
                      <p className="font-bold text-vault-success">
                        {((environmentalData.indoor.makes / environmentalData.indoor.jumps) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-vault-text-muted">Avg Height</p>
                      <p className="font-bold text-vault-text">{environmentalData.indoor.avgHeight.toFixed(2)}m</p>
                    </div>
                  </div>
                </div>
              )}

              {environmentalData.outdoor.jumps > 0 && (
                <div className="border border-vault-success/20 rounded-xl p-4 bg-green-50">
                  <p className="font-bold text-vault-success mb-2">Outdoor</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-vault-text-muted">Jumps</p>
                      <p className="font-bold text-vault-text">{environmentalData.outdoor.jumps}</p>
                    </div>
                    <div>
                      <p className="text-vault-text-muted">Success</p>
                      <p className="font-bold text-vault-success">
                        {((environmentalData.outdoor.makes / environmentalData.outdoor.jumps) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-vault-text-muted">Avg Height</p>
                      <p className="font-bold text-vault-text">{environmentalData.outdoor.avgHeight.toFixed(2)}m</p>
                    </div>
                  </div>
                </div>
              )}

              {environmentalData.indoor.jumps === 0 && environmentalData.outdoor.jumps === 0 && (
                <div className="text-center py-8 text-vault-text-muted">
                  No environmental data available yet
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-vault border border-vault-border-light overflow-hidden">
          <div className="px-6 py-5 border-b border-vault-border-light">
            <h2 className="text-xl font-bold text-vault-text flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                <Target className="h-4 w-4 text-vault-success" />
              </div>
              Technical Metrics
            </h2>
          </div>
          <div className="p-6">
            {/* Step Filter for Technical Metrics */}
            {availableSteps.length > 0 && (
              <div className="mb-4 pb-4 border-b border-vault-border-light">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="w-4 h-4 text-vault-text-muted" />
                  <span className="text-sm font-medium text-vault-text-secondary">Filter by Steps:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedStepsForTechnical === null ? "default" : "outline"}
                    onClick={() => setSelectedStepsForTechnical(null)}
                    size="sm"
                    className={selectedStepsForTechnical === null ? "bg-vault-primary hover:bg-vault-primary-dark text-white" : "border-vault-border text-vault-text-secondary hover:bg-vault-primary-muted hover:text-vault-primary"}
                  >
                    All
                  </Button>
                  {availableSteps.map(steps => (
                    <Button
                      key={steps}
                      variant={selectedStepsForTechnical === steps ? "default" : "outline"}
                      onClick={() => setSelectedStepsForTechnical(steps)}
                      size="sm"
                      className={selectedStepsForTechnical === steps ? "bg-vault-primary hover:bg-vault-primary-dark text-white" : "border-vault-border text-vault-text-secondary hover:bg-vault-primary-muted hover:text-vault-primary"}
                    >
                      {steps}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-vault-primary-muted rounded-xl p-4">
                <p className="text-xs text-vault-text-muted mb-1">Avg Grip Height</p>
                <p className="text-xl font-bold text-vault-text">
                  {filteredTechnicalMetrics.avgGripHeight > 0 ? `${filteredTechnicalMetrics.avgGripHeight.toFixed(2)}m` : '—'}
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-xs text-vault-text-muted mb-1">Avg Run-Up</p>
                <p className="text-xl font-bold text-vault-text">
                  {filteredTechnicalMetrics.avgRunUpLength > 0 ? `${filteredTechnicalMetrics.avgRunUpLength.toFixed(2)}m` : '—'}
                </p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4">
                <p className="text-xs text-vault-text-muted mb-1">Avg Take-Off</p>
                <p className="text-xl font-bold text-vault-text">
                  {filteredTechnicalMetrics.avgTakeOff > 0 ? `${filteredTechnicalMetrics.avgTakeOff.toFixed(2)}m` : '—'}
                </p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-xs text-vault-text-muted mb-1">Avg Steps</p>
                <p className="text-xl font-bold text-vault-text">
                  {filteredTechnicalMetrics.avgSteps > 0 ? filteredTechnicalMetrics.avgSteps.toFixed(1) : '—'}
                </p>
              </div>
            </div>

            {filteredTechnicalMetrics.totalJumps > 0 && (
              <p className="text-xs text-vault-text-muted mt-3 text-center">
                Based on {filteredTechnicalMetrics.totalJumps} jumps
                {selectedStepsForTechnical && ` (${selectedStepsForTechnical}-step only)`}
              </p>
            )}

            {filteredTechnicalMetrics.avgGripHeight === 0 && filteredTechnicalMetrics.avgRunUpLength === 0 && filteredTechnicalMetrics.avgTakeOff === 0 && (
              <div className="text-center py-4 text-vault-text-muted text-sm">
                No technical data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grip Height Trend */}
      {technicalMetrics.gripHeightTrend.some(d => d.avgGrip > 0) && (
        <div className="bg-white rounded-2xl shadow-vault border border-vault-border-light overflow-hidden">
          <div className="px-6 py-5 border-b border-vault-border-light">
            <h2 className="text-xl font-bold text-vault-text flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              Grip Height Progression
            </h2>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={technicalMetrics.gripHeightTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="session" tick={{ fontSize: 12, fill: '#6b6b6b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6b6b6b' }} label={{ value: 'Grip Height (m)', angle: -90, position: 'insideLeft', fill: '#6b6b6b' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e5e5' }} />
                <Legend />
                <Line type="monotone" dataKey="avgGrip" stroke="#8b5cf6" strokeWidth={2} name="Avg Grip Height" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultAnalytics;
