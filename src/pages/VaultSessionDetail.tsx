import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useVaultPoles } from '@/hooks/useVaultData';
import { Session, Jump, formatDate, formatHeight, ratingLabels, ratingColors } from '@/types/vault';
import { getPoleDisplayName } from '@/utils/poleHelpers';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseDb } from '@/utils/firebase';
import {
  Calendar,
  ArrowLeft,
  MapPin,
  Activity,
  Video,
  CheckCircle,
  XCircle,
  Star,
  Wind,
  Thermometer,
  ChevronLeft,
  ChevronRight,
  Minus,
  X
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const VaultSessionDetail = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useFirebaseAuth();
  const { poles } = useVaultPoles(user);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedJump, setSelectedJump] = useState<Jump | null>(null);
  const navigate = useNavigate();

  // Fetch session data
  useEffect(() => {
    if (!user || !sessionId) return;

    const fetchSession = async () => {
      try {
        const sessionRef = doc(firebaseDb, 'users', user.uid, 'sessions', sessionId);
        const sessionSnap = await getDoc(sessionRef);

        if (sessionSnap.exists()) {
      const sessionData = sessionSnap.data() as Session;
      setSession({ ...sessionData, id: sessionSnap.id });
        } else {
      console.error('Session not found');
      navigate('/vault/sessions');
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        navigate('/vault/sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [user, sessionId, navigate]);

  // Auto-open jump modal from URL params (e.g., ?jump=3&autoplay=true)
  useEffect(() => {
    if (!session || !session.jumps) return;

    const jumpIndexParam = searchParams.get('jump');
    if (jumpIndexParam !== null) {
      const jumpIndex = parseInt(jumpIndexParam, 10);
      if (!isNaN(jumpIndex) && jumpIndex >= 0 && jumpIndex < session.jumps.length) {
        setSelectedJump(session.jumps[jumpIndex]);
        // Clear the URL params after opening the modal so closing doesn't re-open it
        setSearchParams({}, { replace: true });
      }
    }
  }, [session, searchParams, setSearchParams]);

  // Keyboard shortcuts - must be defined before early returns
  useEffect(() => {
    if (!selectedJump || !session) return;

    const jumps = session.jumps || [];
    const currentJumpIndex = jumps.findIndex(j => j.id === selectedJump.id);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentJumpIndex > 0) {
          setSelectedJump(jumps[currentJumpIndex - 1]);
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentJumpIndex < jumps.length - 1) {
          setSelectedJump(jumps[currentJumpIndex + 1]);
        }
      } else if (e.key === 'Escape') {
        setSelectedJump(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedJump, session]);

  if (!session) {
    return null;
  }

  const jumps = session.jumps || [];

  // Separate warmup and competition jumps for competition sessions
  const isCompetition = session.sessionType?.toLowerCase().includes('competition');
  const warmupJumps = isCompetition ? jumps.filter(jump => jump.isWarmup) : [];
  const competitionJumps = isCompetition ? jumps.filter(jump => !jump.isWarmup) : jumps;

  // Video navigation
  const currentJumpIndex = selectedJump ? jumps.findIndex(j => j.id === selectedJump.id) : -1;

  const goToPreviousJump = () => {
    if (currentJumpIndex > 0) {
      setSelectedJump(jumps[currentJumpIndex - 1]);
    }
  };

  const goToNextJump = () => {
    if (currentJumpIndex < jumps.length - 1) {
      setSelectedJump(jumps[currentJumpIndex + 1]);
    }
  };
  const successfulJumps = jumps.filter(jump => jump.result === 'make');
  const videoJumps = jumps.filter(jump => jump.videoUrl || jump.videoLocalUri);
  const successRate = jumps.length > 0 ? Math.round((successfulJumps.length / jumps.length) * 100) : 0;

  // Best jump
  const bestJump = successfulJumps.length > 0
    ? successfulJumps.reduce((max, jump) => {
        const height = parseFloat(jump.height) || 0;
        const maxHeight = parseFloat(max.height) || 0;
        return height > maxHeight ? jump : max;
      })
    : null;

  // Equipment used
  const uniquePoles = [...new Set(jumps.map(jump => jump.pole).filter(Boolean))];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button asChild variant="ghost" className="text-blue-600 hover:text-blue-700">
            <Link to="/vault/sessions">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sessions
            </Link>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {formatDate(session.date)}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{session.location || 'Training'}</span>
          </div>
          {session.sessionType && (
            <Badge variant="outline">
            {session.sessionType}
            </Badge>
          )}
            </div>
          </div>

          {/* Session Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 text-center">
          <div className="text-xl font-bold text-blue-600">{jumps.length}</div>
          <div className="text-xs text-gray-600">Jumps</div>
            </div>
            <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 text-center">
          <div className="text-xl font-bold text-green-600">{successRate}%</div>
          <div className="text-xs text-gray-600">Success</div>
            </div>
            <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 text-center">
          <div className="text-xl font-bold text-purple-600">{videoJumps.length}</div>
          <div className="text-xs text-gray-600">Videos</div>
            </div>
            <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 text-center">
          <div className="text-xl font-bold text-orange-600">{uniquePoles.length}</div>
          <div className="text-xs text-gray-600">Poles</div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Details - Grid of info boxes */}
      {(bestJump || session.weather || session.temperature || session.windSpeed || session.energyLevel || session.sessionGoal) && (
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {/* Session Best */}
          {bestJump && (
            <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 text-center">
              <div className="text-xs text-gray-500 mb-1">Best</div>
              <div className="text-lg font-bold text-green-600">
                {formatHeight(bestJump.height, bestJump.barUnits)}
              </div>
            </div>
          )}

          {/* Temperature */}
          {session.temperature && (
            <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 text-center">
              <div className="text-xs text-gray-500 mb-1">Temp</div>
              <div className="flex items-center justify-center gap-1">
                <Thermometer className="h-4 w-4 text-orange-500" />
                <span className="text-lg font-bold text-gray-900">
                  {session.temperature}°{session.temperatureScale || 'F'}
                </span>
              </div>
            </div>
          )}

          {/* Wind */}
          {session.windSpeed && (
            <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 text-center">
              <div className="text-xs text-gray-500 mb-1">Wind</div>
              <div className="flex items-center justify-center gap-1">
                <Wind className="h-4 w-4 text-blue-500" />
                <span className="text-lg font-bold text-gray-900">{session.windSpeed}</span>
              </div>
              {session.windDirection && (
                <div className="text-xs text-gray-500">{session.windDirection}</div>
              )}
            </div>
          )}

          {/* Weather */}
          {session.weather && (
            <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 text-center">
              <div className="text-xs text-gray-500 mb-1">Weather</div>
              <div className="text-sm font-medium text-gray-900">{session.weather}</div>
            </div>
          )}

          {/* Energy Level */}
          {session.energyLevel && (
            <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 text-center">
              <div className="text-xs text-gray-500 mb-1">Energy</div>
              <div className="flex justify-center">
                {[1, 2, 3, 4, 5].map((level) => (
                  <Star
                    key={level}
                    className={`h-4 w-4 ${
                      level <= session.energyLevel
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Session Goal */}
          {session.sessionGoal && (
            <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-6">
              <div className="text-xs text-gray-500 mb-1">Goal</div>
              <div className="text-sm text-gray-900">{session.sessionGoal}</div>
            </div>
          )}
        </div>
      )}

      {/* Competition Progress - X's and O's */}
      {isCompetition && competitionJumps.length > 0 && (() => {
        // Group competition jumps by height and calculate attempts
        const heightAttempts = new Map<string, { height: string; attempts: ('make' | 'miss' | 'pass')[] }>();

        competitionJumps.forEach(jump => {
          const height = jump.height;
          if (!heightAttempts.has(height)) {
            heightAttempts.set(height, { height, attempts: [] });
          }
          const entry = heightAttempts.get(height)!;
          if (jump.result === 'make') {
            entry.attempts.push('make');
          } else if (jump.result === 'miss' || jump.result === 'no-make') {
            entry.attempts.push('miss');
          } else {
            entry.attempts.push('pass');
          }
        });

        // Sort by height
        const sortedHeights = Array.from(heightAttempts.values()).sort((a, b) => {
          return parseFloat(a.height) - parseFloat(b.height);
        });

        return (
          <Card className="mb-6">
            <CardContent className="py-4 px-6">
              <div className="overflow-x-auto">
                <div className="flex gap-6 min-w-max">
                  {sortedHeights.map(({ height, attempts }) => (
                    <div key={height} className="text-center">
                      <div className="text-lg font-bold text-gray-900 mb-1">
                        {formatHeight(height, competitionJumps[0]?.barUnits)}
                      </div>
                      <div className="flex justify-center gap-0.5 text-base font-mono">
                        {attempts.map((attempt, idx) => (
                          <span
                            key={idx}
                            className={
                              attempt === 'make' ? 'text-green-600' :
                              attempt === 'miss' ? 'text-red-600' :
                              'text-gray-400'
                            }
                          >
                            {attempt === 'make' ? 'O' : attempt === 'miss' ? 'X' : '-'}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })()}

      {/* Jumps List - Full Width */}
      <Card>
          <CardHeader>
            <CardTitle>
              {isCompetition ? 'Competition Jumps' : 'Jumps'} ({jumps.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {jumps.length === 0 ? (
          <div className="text-center py-8 px-6">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No jumps recorded in this session</p>
          </div>
            ) : (
          <>
            {/* Warmup Jumps Section - Only for competitions */}
            {isCompetition && warmupJumps.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border-b">
                  <h3 className="text-sm font-semibold text-yellow-800 uppercase">Warmup ({warmupJumps.length})</h3>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-12 text-center">#</TableHead>
                        <TableHead>Height</TableHead>
                        <TableHead className="hidden sm:table-cell">Steps</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead className="hidden md:table-cell">Pole</TableHead>
                        <TableHead className="hidden lg:table-cell">Grip</TableHead>
                        <TableHead className="hidden lg:table-cell">Take-off</TableHead>
                        <TableHead className="hidden xl:table-cell">Run-up</TableHead>
                        <TableHead className="hidden xl:table-cell">Mid</TableHead>
                        <TableHead className="hidden md:table-cell">Notes</TableHead>
                        <TableHead className="w-20 text-center">Video</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {warmupJumps.map((jump, index) => (
                        <TableRow
                          key={jump.id || `warmup-${index}`}
                          className="cursor-pointer hover:bg-yellow-50 transition-colors"
                          onClick={() => setSelectedJump(jump)}
                        >
                          <TableCell className="text-center">
                            <span className="text-sm font-medium text-yellow-700">W{index + 1}</span>
                          </TableCell>
                          <TableCell className="font-semibold">
                            {formatHeight(jump.height, jump.barUnits)}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-gray-600">
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
                          <TableCell className="hidden md:table-cell text-gray-600 text-sm max-w-[150px] truncate">
                            {getPoleDisplayName(jump.pole, poles) || <Minus className="h-4 w-4 text-gray-300" />}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-gray-600">
                            {jump.gripHeight || <Minus className="h-4 w-4 text-gray-300" />}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-gray-600">
                            {jump.takeOff || <Minus className="h-4 w-4 text-gray-300" />}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell text-gray-600">
                            {jump.runUpLength || <Minus className="h-4 w-4 text-gray-300" />}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell text-gray-600">
                            {jump.midMark || <Minus className="h-4 w-4 text-gray-300" />}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-gray-600 text-sm max-w-[120px] truncate">
                            {jump.notes || <Minus className="h-4 w-4 text-gray-300" />}
                          </TableCell>
                          <TableCell className="text-center">
                            {(jump.videoUrl || jump.videoLocalUri) ? (
                              <div className="flex items-center justify-center gap-1">
                                {jump.thumbnailUrl ? (
                                  <div className="w-12 h-9 bg-gray-100 rounded overflow-hidden">
                                    <img
                                      src={jump.thumbnailUrl}
                                      alt="Jump thumbnail"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <Video className={`h-4 w-4 ${
                                    jump.videoUploadStatus === 'completed' ? 'text-green-600' :
                                    jump.videoUploadStatus === 'pending' ? 'text-yellow-600' :
                                    'text-gray-400'
                                  }`} />
                                )}
                              </div>
                            ) : (
                              <Minus className="h-4 w-4 text-gray-300 mx-auto" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Competition Jumps Header */}
            {isCompetition && competitionJumps.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-b">
                <h3 className="text-sm font-semibold text-blue-800 uppercase">Competition ({competitionJumps.length})</h3>
              </div>
            )}

            {/* Main Jumps Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12 text-center">#</TableHead>
                    {!isCompetition && session.sessionType !== 'training' && (
                      <TableHead className="w-16 text-center">Result</TableHead>
                    )}
                    {isCompetition && <TableHead className="w-16 text-center">Result</TableHead>}
                    <TableHead>Height</TableHead>
                    <TableHead className="hidden sm:table-cell">Steps</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="hidden md:table-cell">Pole</TableHead>
                    <TableHead className="hidden lg:table-cell">Grip</TableHead>
                    <TableHead className="hidden lg:table-cell">Take-off</TableHead>
                    <TableHead className="hidden xl:table-cell">Run-up</TableHead>
                    <TableHead className="hidden xl:table-cell">Mid</TableHead>
                    <TableHead className="hidden md:table-cell">Notes</TableHead>
                    <TableHead className="w-20 text-center">Video</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {competitionJumps.map((jump, index) => (
                    <TableRow
                      key={jump.id || index}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setSelectedJump(jump)}
                    >
                      <TableCell className="text-center">
                        <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                      </TableCell>
                      {(!isCompetition && session.sessionType !== 'training') && (
                        <TableCell className="text-center">
                          {jump.result === 'make' ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                          ) : jump.result === 'miss' || jump.result === 'no-make' ? (
                            <XCircle className="h-5 w-5 text-red-600 mx-auto" />
                          ) : (
                            <Minus className="h-4 w-4 text-gray-300 mx-auto" />
                          )}
                        </TableCell>
                      )}
                      {isCompetition && (
                        <TableCell className="text-center">
                          {jump.result === 'make' ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                          ) : jump.result === 'miss' || jump.result === 'no-make' ? (
                            <XCircle className="h-5 w-5 text-red-600 mx-auto" />
                          ) : (
                            <Minus className="h-4 w-4 text-gray-300 mx-auto" />
                          )}
                        </TableCell>
                      )}
                      <TableCell className="font-semibold">
                        {formatHeight(jump.height, jump.barUnits)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-gray-600">
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
                      <TableCell className="hidden md:table-cell text-gray-600 text-sm max-w-[150px] truncate">
                        {getPoleDisplayName(jump.pole, poles) || <Minus className="h-4 w-4 text-gray-300" />}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-gray-600">
                        {jump.gripHeight || <Minus className="h-4 w-4 text-gray-300" />}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-gray-600">
                        {jump.takeOff || <Minus className="h-4 w-4 text-gray-300" />}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-gray-600">
                        {jump.runUpLength || <Minus className="h-4 w-4 text-gray-300" />}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-gray-600">
                        {jump.midMark || <Minus className="h-4 w-4 text-gray-300" />}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-gray-600 text-sm max-w-[120px] truncate">
                        {jump.notes || <Minus className="h-4 w-4 text-gray-300" />}
                      </TableCell>
                      <TableCell className="text-center">
                        {(jump.videoUrl || jump.videoLocalUri) ? (
                          <div className="flex items-center justify-center gap-1">
                            {jump.thumbnailUrl ? (
                              <div className="w-12 h-9 bg-gray-100 rounded overflow-hidden">
                                <img
                                  src={jump.thumbnailUrl}
                                  alt="Jump thumbnail"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <Video className={`h-4 w-4 ${
                                jump.videoUploadStatus === 'completed' ? 'text-green-600' :
                                jump.videoUploadStatus === 'pending' ? 'text-yellow-600' :
                                'text-gray-400'
                              }`} />
                            )}
                          </div>
                        ) : (
                          <Minus className="h-4 w-4 text-gray-300 mx-auto" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
            )}
          </CardContent>
        </Card>

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
          {currentJumpIndex < jumps.length - 1 && (
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
                    <h3 className="text-2xl font-bold text-gray-900">
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
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    {selectedJump.isWarmup && <span className="text-yellow-600 font-medium">Warmup</span>}
                    {session.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{session.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedJump(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Jump Counter */}
              <div className="text-center text-sm text-gray-500 mb-4">
                Jump {currentJumpIndex + 1} of {jumps.length}
              </div>

              {/* Video Player */}
              {(selectedJump.videoUrl || selectedJump.videoLocalUri) && (
                <div className="mb-6">
                  <div className="bg-black rounded-lg overflow-hidden">
                    {selectedJump.videoUrl && selectedJump.videoUrl.startsWith('https://') ? (
                      <video
                        key={selectedJump.videoUrl}
                        controls
                        className="w-full h-auto max-h-[50vh]"
                        preload="metadata"
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
                        preload="metadata"
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
                  <div className="text-xs font-medium text-gray-500 uppercase mb-1">Pole</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {getPoleDisplayName(selectedJump.pole, poles) || '—'}
                  </div>
                </div>

                {/* Steps */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-1">Steps</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {selectedJump.steps || '—'}
                  </div>
                </div>

                {/* Grip */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-1">Grip</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {selectedJump.gripHeight || '—'}
                  </div>
                </div>

                {/* Take-off */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-1">Take-off</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {selectedJump.takeOff || '—'}
                  </div>
                </div>

                {/* Run-up */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-1">Run-up</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {selectedJump.runUpLength || '—'}
                  </div>
                </div>

                {/* Mid Mark */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-1">Mid Mark</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {selectedJump.midMark || '—'}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedJump.notes && (
                <div className="mt-4 bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-1">Notes</div>
                  <div className="text-sm text-gray-900">{selectedJump.notes}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VaultSessionDetail;