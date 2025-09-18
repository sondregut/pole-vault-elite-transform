import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useVaultSessions } from '@/hooks/useVaultData';
import SessionCard from '@/components/vault/sessions/SessionCard';
import {
  BarChart3,
  Calendar,
  ArrowLeft,
  Search,
  Filter,
  Activity,
  Video,
  Target,
  Grid3X3,
  List
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const VaultSessions = () => {
  const { user, loading: authLoading } = useFirebaseAuth();
  const { sessions, loading: sessionsLoading } = useVaultSessions(user);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();
  const location = useLocation();

  // Check for filter parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter');
    if (filter && ['all', 'with-videos', 'competition', 'training'].includes(filter)) {
      setFilterType(filter);
    }
  }, [location.search]);

  const loading = authLoading || sessionsLoading;

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/vault/login');
    }
  }, [user, authLoading, navigate]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your sessions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button asChild variant="ghost" className="text-blue-600 hover:text-blue-700">
                <Link to="/vault/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary">
                    <Calendar className="mr-2 h-4 w-4" />
                    Training Sessions
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Your Training History
                </h1>
                <p className="text-gray-600 mt-1">
                  Review your sessions, analyze performance, and watch training videos
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 text-center">
                  <div className="text-xl font-bold text-blue-600">{sessions.length}</div>
                  <div className="text-xs text-gray-600">Sessions</div>
                </div>
                <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 text-center">
                  <div className="text-xl font-bold text-green-600">{totalJumps}</div>
                  <div className="text-xs text-gray-600">Jumps</div>
                </div>
                <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 text-center">
                  <div className="text-xl font-bold text-purple-600">{totalVideos}</div>
                  <div className="text-xs text-gray-600">Videos</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search sessions by location, type, or goal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-3">
              {/* Filter Dropdown */}
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter sessions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sessions</SelectItem>
                  <SelectItem value="with-videos">With Videos</SelectItem>
                  <SelectItem value="competition">Competition</SelectItem>
                  <SelectItem value="training">Training Only</SelectItem>
                </SelectContent>
              </Select>

              {/* Layout Toggle */}
              <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 px-3"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sessions Display */}
          {filteredSessions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                {sessions.length === 0 ? (
                  <>
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No training sessions yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start logging sessions in your mobile app to see them here
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button asChild>
                        <Link to="/vault">Learn More About Vault</Link>
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No sessions match your filters
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search or filter criteria
                    </p>
                    <Button variant="outline" onClick={() => {
                      setSearchTerm('');
                      setFilterType('all');
                    }}>
                      Clear Filters
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
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
            <div className="mt-8 text-center text-gray-500 text-sm">
              Showing {filteredSessions.length} of {sessions.length} sessions
              {sessionsWithVideos > 0 && (
                <span> • {sessionsWithVideos} sessions have videos</span>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VaultSessions;