import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useVaultSessions, useVaultPoles } from '@/hooks/useVaultData';
import { getPoleDisplayName } from '@/utils/poleHelpers';
import { Jump, Session, formatDate, formatHeight, ratingLabels, ratingColors } from '@/types/vault';
import SessionCard from '@/components/vault/sessions/SessionCard';
import { Card, CardContent } from '@/components/ui/card';
import {
  BarChart3,
  Calendar,
  Search,
  Filter,
  Activity,
  Video,
  Target,
  Grid3X3,
  List,
  CheckCircle,
  XCircle,
  Minus,
  ChevronDown,
  ChevronUp,
  CalendarDays,
  X,
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { DateRange } from 'react-day-picker';

// Extended jump type with session info
interface JumpWithSession extends Jump {
  sessionId: string;
  sessionDate: string | Date;
  sessionType: string;
  sessionLocation: string;
}

type SortField = 'date' | 'height' | 'steps' | 'rating';
type SortDirection = 'asc' | 'desc';

const VaultSessions = () => {
  const { user } = useFirebaseAuth();
  const { sessions, loading: sessionsLoading } = useVaultSessions(user);
  const { poles } = useVaultPoles(user);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [activeTab, setActiveTab] = useState<'sessions' | 'jumps'>('sessions');
  const [jumpSortField, setJumpSortField] = useState<SortField>('date');
  const [jumpSortDirection, setJumpSortDirection] = useState<SortDirection>('desc');
  const [selectedJump, setSelectedJump] = useState<JumpWithSession | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Check for tab and filter parameters in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter');
    const tab = params.get('tab');

    if (filter && ['all', 'with-videos', 'competition', 'training'].includes(filter)) {
      setFilterType(filter);
    } else {
      setFilterType('all');
    }

    if (tab && ['sessions', 'jumps'].includes(tab)) {
      setActiveTab(tab as 'sessions' | 'jumps');
    }
  }, [location.search]);

  const loading = sessionsLoading;

  // Flatten all jumps with session info for Jump History tab
  const allJumps = useMemo((): JumpWithSession[] => {
    const jumps: JumpWithSession[] = [];
    sessions.forEach(session => {
      (session.jumps || []).forEach(jump => {
        jumps.push({
          ...jump,
          sessionId: session.id || '',
          sessionDate: session.date,
          sessionType: session.sessionType || 'Training',
          sessionLocation: session.location || '',
        });
      });
    });
    return jumps;
  }, [sessions]);

  // Get dates that have session data (for calendar dots) - separated by type
  const { competitionDates, trainingDates } = useMemo(() => {
    const compDates = new Set<string>();
    const trainDates = new Set<string>();
    sessions.forEach(session => {
      const date = typeof session.date === 'string' ? new Date(session.date) : session.date;
      const dateStr = date.toISOString().split('T')[0];
      const type = session.sessionType?.toLowerCase() || '';
      if (type.includes('competition') || type.includes('comp')) {
        compDates.add(dateStr);
      } else {
        trainDates.add(dateStr);
      }
    });
    return { competitionDates: compDates, trainingDates: trainDates };
  }, [sessions]);

  // Convert to Date objects for the calendar modifiers
  const competitionDatesArray = useMemo(() => {
    return Array.from(competitionDates).map(d => new Date(d + 'T12:00:00'));
  }, [competitionDates]);

  const trainingDatesArray = useMemo(() => {
    return Array.from(trainingDates).map(d => new Date(d + 'T12:00:00'));
  }, [trainingDates]);

  // Format date for jump history
  const formatJumpDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Check if a date is within the selected range
  const isDateInRange = (date: string | Date): boolean => {
    if (!dateRange?.from) return true;
    const d = typeof date === 'string' ? new Date(date) : date;
    const from = dateRange.from;
    const to = dateRange.to || dateRange.from;
    // Normalize dates to start of day for comparison
    const dNorm = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const fromNorm = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    const toNorm = new Date(to.getFullYear(), to.getMonth(), to.getDate());
    return dNorm >= fromNorm && dNorm <= toNorm;
  };

  // Format date range for display
  const formatDateRange = () => {
    if (!dateRange?.from) return null;
    const from = dateRange.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!dateRange.to || dateRange.from.getTime() === dateRange.to.getTime()) {
      return from;
    }
    const to = dateRange.to.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${from} - ${to}`;
  };

  // Smart search function for jumps
  const jumpMatchesSearch = (jump: JumpWithSession, term: string): boolean => {
    if (!term.trim()) return true;

    const searchLower = term.toLowerCase().trim();
    const poleName = getPoleDisplayName(jump.pole, poles)?.toLowerCase() || '';
    const jumpHeight = parseFloat(jump.height) || 0;

    // Check for range (e.g., "5.0-5.5", "5.0 to 5.5")
    const rangeMatch = searchLower.match(/^(\d+\.?\d*)\s*[-–to]+\s*(\d+\.?\d*)$/);
    if (rangeMatch) {
      const min = parseFloat(rangeMatch[1]);
      const max = parseFloat(rangeMatch[2]);
      return jumpHeight >= min && jumpHeight <= max;
    }

    // Check for steps search (e.g., "8 steps", "steps:8", "8s")
    const stepsMatch = searchLower.match(/^(\d+)\s*(?:steps?|s)$|^steps?[:\s]*(\d+)$/);
    if (stepsMatch) {
      const stepsValue = parseInt(stepsMatch[1] || stepsMatch[2]);
      return jump.steps === stepsValue;
    }

    // Check for rating search (e.g., "great", "good", "ok")
    const ratingTerms = ['runthru', 'run thru', 'glider', 'ok', 'good', 'great'];
    if (ratingTerms.some(r => searchLower === r || searchLower === r.replace(' ', ''))) {
      const normalizedSearch = searchLower.replace(' ', '');
      return jump.rating?.toLowerCase() === normalizedSearch ||
             ratingLabels[jump.rating]?.toLowerCase().replace(' ', '') === normalizedSearch;
    }

    // Check for result search (e.g., "make", "miss", "made", "missed")
    if (['make', 'made', 'clear', 'cleared'].includes(searchLower)) {
      return jump.result === 'make';
    }
    if (['miss', 'missed', 'fail', 'failed'].includes(searchLower)) {
      return jump.result === 'miss' || jump.result === 'no-make';
    }

    // Check for type search
    if (['comp', 'competition'].includes(searchLower)) {
      const type = jump.sessionType?.toLowerCase() || '';
      return type.includes('competition') || type.includes('comp') || type === 'comp-w';
    }
    if (['training', 'train', 'practice'].includes(searchLower)) {
      const type = jump.sessionType?.toLowerCase() || '';
      return !type.includes('competition') && !type.includes('comp');
    }

    // Check for video search
    if (['video', 'videos', 'has video', 'with video'].includes(searchLower)) {
      return !!(jump.videoUrl || jump.videoLocalUri);
    }

    // Default: search across multiple text fields
    const searchableText = [
      jump.height,
      poleName,
      jump.notes,
      jump.sessionLocation,
      jump.gripHeight,
      jump.takeOff,
      jump.runUpLength,
      jump.midMark,
      jump.steps?.toString(),
      ratingLabels[jump.rating] || jump.rating,
      formatJumpDate(jump.sessionDate),
    ].filter(Boolean).join(' ').toLowerCase();

    // Support multiple search terms (space-separated)
    const searchTerms = searchLower.split(/\s+/).filter(t => t.length > 0);
    return searchTerms.every(t => searchableText.includes(t));
  };

  // Filter and sort jumps for Jump History
  const filteredAndSortedJumps = useMemo(() => {
    let filtered = allJumps.filter(jump => {
      const matchesSearch = jumpMatchesSearch(jump, searchTerm);
      const matchesDateRange = isDateInRange(jump.sessionDate);

      const matchesFilter =
        filterType === 'all' ||
        (filterType === 'with-videos' && (jump.videoUrl || jump.videoLocalUri)) ||
        (filterType === 'competition' && jump.sessionType?.toLowerCase().includes('competition')) ||
        (filterType === 'training' && !jump.sessionType?.toLowerCase().includes('competition'));

      return matchesSearch && matchesFilter && matchesDateRange;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (jumpSortField) {
        case 'date':
          const dateA = new Date(a.sessionDate).getTime();
          const dateB = new Date(b.sessionDate).getTime();
          comparison = dateA - dateB;
          break;
        case 'height':
          const heightA = parseFloat(a.height) || 0;
          const heightB = parseFloat(b.height) || 0;
          comparison = heightA - heightB;
          break;
        case 'steps':
          comparison = (a.steps || 0) - (b.steps || 0);
          break;
        case 'rating':
          const ratingOrder = { runthru: 1, glider: 2, ok: 3, good: 4, great: 5 };
          const ratingA = ratingOrder[a.rating as keyof typeof ratingOrder] || 0;
          const ratingB = ratingOrder[b.rating as keyof typeof ratingOrder] || 0;
          comparison = ratingA - ratingB;
          break;
      }
      return jumpSortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [allJumps, searchTerm, filterType, jumpSortField, jumpSortDirection, poles, dateRange]);

  // Handle sort toggle
  const handleSort = (field: SortField) => {
    if (jumpSortField === field) {
      setJumpSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setJumpSortField(field);
      setJumpSortDirection('desc');
    }
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'sessions' | 'jumps');
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tab);
    setSearchParams(newParams);
  };

  // Get sort icon
  const SortIcon = ({ field }: { field: SortField }) => {
    if (jumpSortField !== field) return null;
    return jumpSortDirection === 'asc' ?
      <ChevronUp className="h-4 w-4 inline ml-1" /> :
      <ChevronDown className="h-4 w-4 inline ml-1" />;
  };

  // Format session type for display
  const formatSessionType = (type: string) => {
    if (type.toLowerCase().includes('competition')) {
      if (type.toLowerCase().includes('warmup') || type.toLowerCase() === 'comp-w') {
        return 'Comp-W';
      }
      return 'Comp';
    }
    return 'Training';
  };

  // Get current jump index in filtered list
  const currentJumpIndex = selectedJump
    ? filteredAndSortedJumps.findIndex(j => j.id === selectedJump.id && j.sessionId === selectedJump.sessionId)
    : -1;

  // Navigation functions for jump modal
  const goToPreviousJump = () => {
    if (currentJumpIndex > 0) {
      setSelectedJump(filteredAndSortedJumps[currentJumpIndex - 1]);
    }
  };

  const goToNextJump = () => {
    if (currentJumpIndex < filteredAndSortedJumps.length - 1) {
      setSelectedJump(filteredAndSortedJumps[currentJumpIndex + 1]);
    }
  };

  // Keyboard navigation for jump modal
  useEffect(() => {
    if (!selectedJump) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPreviousJump();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNextJump();
      } else if (e.key === 'Escape') {
        setSelectedJump(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedJump, currentJumpIndex]);

  // Smart search function for sessions
  const sessionMatchesSearch = (session: Session, term: string): boolean => {
    if (!term.trim()) return true;

    const searchLower = term.toLowerCase().trim();

    // Format date for searching
    const sessionDate = typeof session.date === 'string' ? new Date(session.date) : session.date;
    const dateStr = sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const monthName = sessionDate.toLocaleDateString('en-US', { month: 'long' }).toLowerCase();

    // Get max height from jumps
    const maxHeight = session.jumps?.reduce((max, jump) => {
      const h = parseFloat(jump.height) || 0;
      return h > max ? h : max;
    }, 0) || 0;

    // Check for type search
    if (['comp', 'competition'].includes(searchLower)) {
      const type = session.sessionType?.toLowerCase() || '';
      return type.includes('competition') || type.includes('comp');
    }
    if (['training', 'train', 'practice'].includes(searchLower)) {
      const type = session.sessionType?.toLowerCase() || '';
      return !type.includes('competition') && !type.includes('comp');
    }

    // Check for indoor/outdoor
    if (['indoor', 'indoors'].includes(searchLower)) {
      return session.isIndoor === true;
    }
    if (['outdoor', 'outdoors'].includes(searchLower)) {
      return session.isIndoor === false;
    }

    // Check for video search
    if (['video', 'videos', 'has video', 'with video'].includes(searchLower)) {
      return (session.jumps || []).some(jump => jump.videoUrl || jump.videoLocalUri);
    }

    // Build searchable text from all session fields
    const searchableText = [
      session.location,
      session.sessionType,
      session.sessionGoal,
      session.competitionName,
      session.weather,
      session.mentalNotes,
      dateStr,
      monthName,
      maxHeight > 0 ? maxHeight.toString() : null,
    ].filter(Boolean).join(' ').toLowerCase();

    // Support multiple search terms (space-separated, all must match)
    const searchTerms = searchLower.split(/\s+/).filter(t => t.length > 0);
    return searchTerms.every(t => searchableText.includes(t));
  };

  // Filter sessions
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = sessionMatchesSearch(session, searchTerm);
    const matchesDateRange = isDateInRange(session.date);

    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'with-videos' && (session.jumps || []).some(jump => jump.videoUrl || jump.videoLocalUri)) ||
      (filterType === 'competition' && (session.sessionType?.toLowerCase().includes('competition') || session.sessionType?.toLowerCase().includes('comp'))) ||
      (filterType === 'training' && !session.sessionType?.toLowerCase().includes('competition') && !session.sessionType?.toLowerCase().includes('comp'));

    return matchesSearch && matchesFilter && matchesDateRange;
  });

  // Calculate stats
  const totalJumps = sessions.reduce((sum, session) => sum + (session.jumps?.length || 0), 0);
  const totalVideos = sessions.reduce((sum, session) =>
    sum + (session.jumps?.filter(jump => jump.videoUrl || jump.videoLocalUri).length || 0), 0);
  const sessionsWithVideos = sessions.filter(session =>
    (session.jumps || []).some(jump => jump.videoUrl || jump.videoLocalUri)).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-vault-text">
              Session History
            </h1>
            <p className="text-vault-text-secondary mt-1">
              View and manage your training sessions
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl px-4 py-3 border border-vault-border-light shadow-vault text-center">
              <div className="text-xl font-bold text-vault-primary">{sessions.length}</div>
              <div className="text-xs text-vault-text-secondary">Sessions</div>
            </div>
            <div className="bg-white rounded-xl px-4 py-3 border border-vault-border-light shadow-vault text-center">
              <div className="text-xl font-bold text-vault-success">{totalJumps}</div>
              <div className="text-xs text-vault-text-secondary">Jumps</div>
            </div>
            <div className="bg-white rounded-xl px-4 py-3 border border-vault-border-light shadow-vault text-center">
              <div className="text-xl font-bold text-vault-warning">{totalVideos}</div>
              <div className="text-xs text-vault-text-secondary">Videos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="bg-transparent w-full justify-start h-auto p-0 gap-4">
            <TabsTrigger
              value="sessions"
              className="px-6 py-2.5 rounded-lg border-2 font-semibold transition-all data-[state=active]:border-vault-primary data-[state=active]:bg-white data-[state=active]:text-vault-primary data-[state=active]:shadow-sm data-[state=inactive]:border-transparent data-[state=inactive]:bg-transparent data-[state=inactive]:text-vault-text-secondary data-[state=inactive]:hover:bg-gray-100"
            >
              Sessions
            </TabsTrigger>
            <TabsTrigger
              value="jumps"
              className="px-6 py-2.5 rounded-lg border-2 font-semibold transition-all data-[state=active]:border-vault-primary data-[state=active]:bg-white data-[state=active]:text-vault-primary data-[state=active]:shadow-sm data-[state=inactive]:border-transparent data-[state=inactive]:bg-transparent data-[state=inactive]:text-vault-text-secondary data-[state=inactive]:hover:bg-gray-100"
            >
              Jump History
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vault-text-muted" />
          <Input
            placeholder={
              activeTab === 'sessions' ? "Search by meet name, location, date..." :
              "Try: 5.0-5.5, 8 steps, great, make..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-vault-border rounded-xl focus:border-vault-primary focus:ring-vault-primary"
          />
        </div>

        <div className="flex gap-3">
          {/* Filter Dropdown */}
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48 border-vault-border rounded-xl">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-vault-border">
              <SelectItem value="all">All</SelectItem>
              {activeTab !== 'videos' && <SelectItem value="with-videos">With Videos</SelectItem>}
              <SelectItem value="competition">Competition</SelectItem>
              <SelectItem value="training">Training Only</SelectItem>
            </SelectContent>
          </Select>

          {/* Date picker */}
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`border-vault-border rounded-xl px-3 ${dateRange?.from ? 'bg-vault-primary-muted border-vault-primary' : ''}`}
              >
                <CalendarDays className={`h-4 w-4 ${dateRange?.from ? 'text-vault-primary' : ''}`} />
                {formatDateRange() && (
                  <span className="ml-2 text-sm text-vault-primary">{formatDateRange()}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Select Date Range</span>
                  {dateRange?.from && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDateRange(undefined);
                        setCalendarOpen(false);
                      }}
                      className="h-8 px-2 text-xs"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
              <CalendarComponent
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range);
                  // Close popover when both dates are selected
                  if (range?.from && range?.to) {
                    setTimeout(() => setCalendarOpen(false), 300);
                  }
                }}
                numberOfMonths={1}
                modifiers={{
                  competition: competitionDatesArray,
                  training: trainingDatesArray
                }}
                modifiersStyles={{
                  competition: {
                    position: 'relative'
                  },
                  training: {
                    position: 'relative'
                  }
                }}
                modifiersClassNames={{
                  competition: 'competition-dot',
                  training: 'training-dot'
                }}
                className="rounded-md"
              />
              <div className="px-3 pb-3 pt-1 border-t flex items-center justify-center gap-4 text-xs text-vault-text-secondary">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                  <span>Training</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                  <span>Competition</span>
                </div>
              </div>
              <style>{`
                .competition-dot::after {
                  content: '';
                  position: absolute;
                  bottom: 2px;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 5px;
                  height: 5px;
                  background-color: #f97316;
                  border-radius: 50%;
                }
                .training-dot::after {
                  content: '';
                  position: absolute;
                  bottom: 2px;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 5px;
                  height: 5px;
                  background-color: #3b82f6;
                  border-radius: 50%;
                }
              `}</style>
            </PopoverContent>
          </Popover>

          {/* Layout Toggle - Only show for Sessions tab */}
          {activeTab === 'sessions' && (
            <div className="flex items-center bg-white rounded-xl border border-vault-border-light shadow-vault-sm p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`h-8 px-3 rounded-lg ${viewMode === 'grid' ? 'bg-vault-primary hover:bg-vault-primary-dark text-white' : 'text-vault-text-secondary hover:text-vault-primary hover:bg-vault-primary-muted'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`h-8 px-3 rounded-lg ${viewMode === 'list' ? 'bg-vault-primary hover:bg-vault-primary-dark text-white' : 'text-vault-text-secondary hover:text-vault-primary hover:bg-vault-primary-muted'}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Sessions Tab Content */}
      {activeTab === 'sessions' && (
        <>
          {filteredSessions.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-vault border border-vault-border-light p-12 text-center">
              {sessions.length === 0 ? (
                <>
                  <div className="w-16 h-16 bg-vault-primary-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-vault-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-vault-text mb-2">
                    No training sessions yet
                  </h3>
                  <p className="text-vault-text-secondary mb-6">
                    Start logging sessions in your mobile app to see them here
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button asChild className="bg-gradient-to-r from-vault-primary-dark to-vault-primary text-white font-semibold rounded-xl hover:shadow-vault-md transition-all">
                      <Link to="/vault">Learn More About Vault</Link>
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-vault-primary-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-vault-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-vault-text mb-2">
                    No sessions match your filters
                  </h3>
                  <p className="text-vault-text-secondary mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button variant="outline" onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                  }} className="border-vault-primary text-vault-primary hover:bg-vault-primary-muted font-semibold rounded-xl">
                    Clear Filters
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }>
              {filteredSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  className={viewMode === 'list' ? 'w-full' : ''}
                />
              ))}
            </div>
          )}

          {/* Results Summary */}
          {filteredSessions.length > 0 && (
            <div className="mt-8 text-center text-vault-text-muted text-sm">
              Showing {filteredSessions.length} of {sessions.length} sessions
              {sessionsWithVideos > 0 && (
                <span> • {sessionsWithVideos} sessions have videos</span>
              )}
            </div>
          )}
        </>
      )}

      {/* Jump History Tab Content */}
      {activeTab === 'jumps' && (
        <>
          {filteredAndSortedJumps.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-vault border border-vault-border-light p-12 text-center">
              {allJumps.length === 0 ? (
                <>
                  <div className="w-16 h-16 bg-vault-primary-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-8 w-8 text-vault-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-vault-text mb-2">
                    No jumps recorded yet
                  </h3>
                  <p className="text-vault-text-secondary mb-6">
                    Start logging jumps in your mobile app to see them here
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-vault-primary-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-vault-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-vault-text mb-2">
                    No jumps match your filters
                  </h3>
                  <p className="text-vault-text-secondary mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button variant="outline" onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                  }} className="border-vault-primary text-vault-primary hover:bg-vault-primary-muted font-semibold rounded-xl">
                    Clear Filters
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-vault border border-vault-border-light overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead
                        className="cursor-pointer select-none font-semibold text-vault-text"
                        onClick={() => handleSort('date')}
                      >
                        Date <SortIcon field="date" />
                      </TableHead>
                      <TableHead className="font-semibold text-vault-text">Type</TableHead>
                      <TableHead className="text-center font-semibold text-vault-text">Result</TableHead>
                      <TableHead
                        className="cursor-pointer select-none font-semibold text-vault-text"
                        onClick={() => handleSort('height')}
                      >
                        Height <SortIcon field="height" />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer select-none font-semibold text-vault-text hidden sm:table-cell"
                        onClick={() => handleSort('steps')}
                      >
                        Steps <SortIcon field="steps" />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer select-none font-semibold text-vault-text"
                        onClick={() => handleSort('rating')}
                      >
                        Rating <SortIcon field="rating" />
                      </TableHead>
                      <TableHead className="font-semibold text-vault-text hidden md:table-cell">Pole</TableHead>
                      <TableHead className="font-semibold text-vault-text hidden lg:table-cell">Grip</TableHead>
                      <TableHead className="font-semibold text-vault-text hidden lg:table-cell">Take-off</TableHead>
                      <TableHead className="font-semibold text-vault-text hidden xl:table-cell">Run-up</TableHead>
                      <TableHead className="font-semibold text-vault-text hidden xl:table-cell">Mid</TableHead>
                      <TableHead className="font-semibold text-vault-text hidden md:table-cell">Location</TableHead>
                      <TableHead className="font-semibold text-vault-text hidden lg:table-cell">Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedJumps.map((jump, index) => (
                      <TableRow
                        key={`${jump.sessionId}-${jump.id || index}`}
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setSelectedJump(jump)}
                      >
                        <TableCell className="font-medium text-vault-text">
                          {formatJumpDate(jump.sessionDate)}
                        </TableCell>
                        <TableCell className="text-vault-text-secondary">
                          {formatSessionType(jump.sessionType)}
                        </TableCell>
                        <TableCell className="text-center">
                          {jump.result === 'make' ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                          ) : jump.result === 'miss' || jump.result === 'no-make' ? (
                            <XCircle className="h-5 w-5 text-red-600 mx-auto" />
                          ) : (
                            <Minus className="h-4 w-4 text-gray-300 mx-auto" />
                          )}
                        </TableCell>
                        <TableCell className="font-semibold text-vault-text">
                          {formatHeight(jump.height, jump.barUnits)}
                        </TableCell>
                        <TableCell className="text-vault-text-secondary hidden sm:table-cell">
                          {jump.steps || <Minus className="h-4 w-4 text-gray-300" />}
                        </TableCell>
                        <TableCell>
                          {jump.rating ? (
                            <Badge
                              variant="secondary"
                              className="text-xs"
                              style={{
                                backgroundColor: `${ratingColors[jump.rating]}20`,
                                color: ratingColors[jump.rating]
                              }}
                            >
                              {ratingLabels[jump.rating] || jump.rating}
                            </Badge>
                          ) : (
                            <Minus className="h-4 w-4 text-gray-300" />
                          )}
                        </TableCell>
                        <TableCell className="text-vault-text-secondary text-sm max-w-[120px] truncate hidden md:table-cell">
                          {getPoleDisplayName(jump.pole, poles) || <Minus className="h-4 w-4 text-gray-300" />}
                        </TableCell>
                        <TableCell className="text-vault-text-secondary hidden lg:table-cell">
                          {jump.gripHeight || <Minus className="h-4 w-4 text-gray-300" />}
                        </TableCell>
                        <TableCell className="text-vault-text-secondary hidden lg:table-cell">
                          {jump.takeOff || <Minus className="h-4 w-4 text-gray-300" />}
                        </TableCell>
                        <TableCell className="text-vault-text-secondary hidden xl:table-cell">
                          {jump.runUpLength || <Minus className="h-4 w-4 text-gray-300" />}
                        </TableCell>
                        <TableCell className="text-vault-text-secondary hidden xl:table-cell">
                          {jump.midMark || <Minus className="h-4 w-4 text-gray-300" />}
                        </TableCell>
                        <TableCell className="text-vault-text-secondary text-sm max-w-[100px] truncate hidden md:table-cell">
                          {jump.sessionLocation || <Minus className="h-4 w-4 text-gray-300" />}
                        </TableCell>
                        <TableCell className="text-vault-text-secondary text-sm max-w-[100px] truncate hidden lg:table-cell">
                          {jump.notes || <Minus className="h-4 w-4 text-gray-300" />}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Results Summary */}
          {filteredAndSortedJumps.length > 0 && (
            <div className="mt-8 text-center text-vault-text-muted text-sm">
              Showing {filteredAndSortedJumps.length} of {allJumps.length} jumps
            </div>
          )}
        </>
      )}

      {/* Jump Detail Modal */}
      {selectedJump && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedJump(null)}
        >
          {/* Previous Button */}
          {currentJumpIndex > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); goToPreviousJump(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 shadow-lg rounded-full h-12 w-12"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}

          {/* Next Button */}
          {currentJumpIndex < filteredAndSortedJumps.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); goToNextJump(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 shadow-lg rounded-full h-12 w-12"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}

          <Card
            className="max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-bold text-vault-text">
                      {formatHeight(selectedJump.height, selectedJump.barUnits)}
                    </h3>
                    {selectedJump.result === 'make' ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : selectedJump.result === 'miss' || selectedJump.result === 'no-make' ? (
                      <XCircle className="h-6 w-6 text-red-600" />
                    ) : null}
                    {selectedJump.rating && (
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: `${ratingColors[selectedJump.rating]}20`,
                          color: ratingColors[selectedJump.rating]
                        }}
                      >
                        {ratingLabels[selectedJump.rating] || selectedJump.rating}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-vault-text-secondary">
                    <span>{formatJumpDate(selectedJump.sessionDate)}</span>
                    <span>•</span>
                    <span>{formatSessionType(selectedJump.sessionType)}</span>
                    {selectedJump.sessionLocation && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{selectedJump.sessionLocation}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedJump(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Jump Counter */}
              <div className="text-center text-sm text-vault-text-muted mb-4">
                Jump {currentJumpIndex + 1} of {filteredAndSortedJumps.length}
              </div>

              {/* Video Player */}
              {(selectedJump.videoUrl || selectedJump.videoLocalUri) && (
                <div className="mb-6">
                  <div className="bg-black rounded-lg overflow-hidden min-h-[60vh] flex items-center justify-center">
                    {selectedJump.videoUrl && selectedJump.videoUrl.startsWith('https://') ? (
                      <video
                        key={selectedJump.videoUrl}
                        controls
                        className="w-full h-auto max-h-[50vh]"
                        preload="auto"
                        playsInline
                        autoPlay
                      >
                        <source src={selectedJump.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : selectedJump.videoLocalUri && selectedJump.videoLocalUri.startsWith('https://') ? (
                      <video
                        key={selectedJump.videoLocalUri}
                        controls
                        className="w-full h-auto max-h-[50vh]"
                        preload="auto"
                        playsInline
                        autoPlay
                      >
                        <source src={selectedJump.videoLocalUri} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="p-8 text-center text-white">
                        <Video className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-300 mb-2">Video not available</p>
                        <p className="text-sm text-gray-400">
                          This video is stored locally on your mobile device and hasn't been uploaded yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Jump Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* Pole */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-vault-text-muted uppercase mb-1">Pole</div>
                  <div className="text-sm font-semibold text-vault-text">
                    {getPoleDisplayName(selectedJump.pole, poles) || '—'}
                  </div>
                </div>

                {/* Steps */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-vault-text-muted uppercase mb-1">Steps</div>
                  <div className="text-sm font-semibold text-vault-text">
                    {selectedJump.steps || '—'}
                  </div>
                </div>

                {/* Grip */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-vault-text-muted uppercase mb-1">Grip</div>
                  <div className="text-sm font-semibold text-vault-text">
                    {selectedJump.gripHeight || '—'}
                  </div>
                </div>

                {/* Take-off */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-vault-text-muted uppercase mb-1">Take-off</div>
                  <div className="text-sm font-semibold text-vault-text">
                    {selectedJump.takeOff || '—'}
                  </div>
                </div>

                {/* Run-up */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-vault-text-muted uppercase mb-1">Run-up</div>
                  <div className="text-sm font-semibold text-vault-text">
                    {selectedJump.runUpLength || '—'}
                  </div>
                </div>

                {/* Mid Mark */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-vault-text-muted uppercase mb-1">Mid Mark</div>
                  <div className="text-sm font-semibold text-vault-text">
                    {selectedJump.midMark || '—'}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedJump.notes && (
                <div className="mt-4 bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-vault-text-muted uppercase mb-1">Notes</div>
                  <div className="text-sm text-vault-text">{selectedJump.notes}</div>
                </div>
              )}

              {/* View Session Link */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(`/vault/sessions/${selectedJump.sessionId}`)}
                >
                  View Full Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VaultSessions;