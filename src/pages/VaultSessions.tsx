import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useVaultSessions } from '@/hooks/useVaultData';
import SessionCard from '@/components/vault/sessions/SessionCard';
import {
  BarChart3,
  Calendar,
  Search,
  Filter,
  Activity,
  Video,
  Target,
  Grid3X3,
  List
} from 'lucide-react';

const VaultSessions = () => {
  const { user } = useFirebaseAuth();
  const { sessions, loading: sessionsLoading } = useVaultSessions(user);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const location = useLocation();

  // Check for filter parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter');
    if (filter && ['all', 'with-videos', 'competition', 'training'].includes(filter)) {
      setFilterType(filter);
    } else {
      // Reset to 'all' if no valid filter in URL
      setFilterType('all');
    }
  }, [location.search]);

  const loading = sessionsLoading;

  // Filter sessions
  const filteredSessions = sessions.filter(session => {
    const matchesSearch =
      session.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.sessionType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.sessionGoal?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'with-videos' && (session.jumps || []).some(jump => jump.videoUrl || jump.videoLocalUri)) ||
      (filterType === 'competition' && session.sessionType?.toLowerCase().includes('competition')) ||
      (filterType === 'training' && !session.sessionType?.toLowerCase().includes('competition'));

    return matchesSearch && matchesFilter;
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
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
            <Badge className="bg-vault-primary-muted text-vault-primary border-vault-primary/20">
          <Calendar className="mr-2 h-4 w-4" />
          Training Sessions
            </Badge>
            </div>
            <h1 className="text-3xl font-bold text-vault-text">
            Your Training History
            </h1>
            <p className="text-vault-text-secondary mt-1">
            Review your sessions, analyze performance, and watch training videos
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

          {/* Search & Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vault-text-muted" />
          <Input
            placeholder="Search sessions by location, type, or goal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-vault-border rounded-xl focus:border-vault-primary focus:ring-vault-primary"
          />
            </div>

            <div className="flex gap-3">
          {/* Filter Dropdown */}
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48 border-vault-border rounded-xl">
            <SelectValue placeholder="Filter sessions" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-vault-border">
            <SelectItem value="all">All Sessions</SelectItem>
            <SelectItem value="with-videos">With Videos</SelectItem>
            <SelectItem value="competition">Competition</SelectItem>
            <SelectItem value="training">Training Only</SelectItem>
            </SelectContent>
          </Select>

          {/* Layout Toggle */}
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
            </div>
          </div>

          {/* Sessions Display */}
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
    </div>
  );
};

export default VaultSessions;