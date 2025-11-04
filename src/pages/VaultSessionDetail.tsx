import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
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
  ChevronRight
} from 'lucide-react';

const VaultSessionDetail = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Session Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Session Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {session.weather && (
          <div>
            <div className="text-sm font-medium text-gray-900 mb-1">Weather</div>
            <div className="text-sm text-gray-600">{session.weather}</div>
          </div>
            )}

            {session.temperature && (
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-gray-600">
            {session.temperature}° {session.temperatureScale || 'F'}
            </span>
          </div>
            )}

            {session.windSpeed && (
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600">
            {session.windSpeed} {session.windDirection && `(${session.windDirection})`}
            </span>
          </div>
            )}

            {session.sessionGoal && (
          <div>
            <div className="text-sm font-medium text-gray-900 mb-1">Session Goal</div>
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
            {session.sessionGoal}
            </div>
          </div>
            )}

            {session.energyLevel && (
          <div>
            <div className="text-sm font-medium text-gray-900 mb-1">Energy Level</div>
            <div className="flex items-center gap-2">
            <div className="flex">
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
            <span className="text-sm text-gray-600">
          {session.energyLevel}/5
            </span>
            </div>
          </div>
            )}

            {bestJump && (
          <div>
            <div className="text-sm font-medium text-gray-900 mb-1">Session Best</div>
            <div className="text-2xl font-bold text-green-600">
            {formatHeight(bestJump.height, bestJump.barUnits)}
            </div>
          </div>
            )}
          </CardContent>
        </Card>

        {/* Jumps List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          {isCompetition ? 'Competition Jumps' : 'Jumps'} ({jumps.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {jumps.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No jumps recorded in this session</p>
          </div>
            ) : (
          <>
            {/* Warmup Jumps Section - Only for competitions */}
            {isCompetition && warmupJumps.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase">Warmup ({warmupJumps.length})</h3>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                <div className="space-y-3">
                  {warmupJumps.map((jump, index) => (
                    <Card
                      key={jump.id || `warmup-${index}`}
                      className="hover:shadow-md transition-shadow cursor-pointer bg-yellow-50"
                      onClick={() => setSelectedJump(jump)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-yellow-700">
                                W{index + 1}
                              </span>
                            </div>

                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <span className="text-lg font-semibold text-gray-900">
                                  {formatHeight(jump.height, jump.barUnits)}
                                </span>
                                {jump.rating && (
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
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-sm text-gray-600">
                                <span>{getPoleDisplayName(jump.pole, poles)}</span>
                                {jump.gripHeight && <span>Grip: {jump.gripHeight}</span>}
                                {(jump.videoUrl || jump.videoLocalUri) && (
                                  <div className="flex items-center gap-1">
                                    <Video className="h-4 w-4" />
                                    <span
                                      className={
                                        jump.videoUploadStatus === 'completed' ? 'text-green-600' :
                                        jump.videoUploadStatus === 'uploading' ? 'text-blue-600' :
                                        jump.videoUploadStatus === 'failed' ? 'text-red-600' :
                                        jump.videoUploadStatus === 'pending' ? 'text-yellow-600' :
                                        'text-gray-600'
                                      }
                                    >
                                      {jump.videoUploadStatus === 'completed' ? 'Video Ready' :
                                       jump.videoUploadStatus === 'uploading' ? 'Uploading...' :
                                       jump.videoUploadStatus === 'failed' ? 'Upload Failed' :
                                       jump.videoUploadStatus === 'pending' ? 'Upload Pending' :
                                       'Video'}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {(jump.videoUrl || jump.videoLocalUri) && jump.thumbnailUrl && (
                            <div className="w-16 h-12 bg-gray-100 rounded border overflow-hidden flex-shrink-0">
                              <img
                                src={jump.thumbnailUrl}
                                alt="Jump thumbnail"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Competition Jumps Section */}
            {isCompetition && competitionJumps.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase">Competition ({competitionJumps.length})</h3>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
              </div>
            )}

            <div className="space-y-3">
            {competitionJumps.map((jump, index) => (
            <Card
          key={jump.id || index}
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setSelectedJump(jump)}
            >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">
                    {index + 1}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-lg font-semibold text-gray-900">
                      {formatHeight(jump.height, jump.barUnits)}
                    </span>
                    {!jump.isWarmup && session.sessionType !== 'training' && (
                      jump.result === 'make' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : jump.result === 'miss' ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : null
                    )}
                    {jump.rating && (
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
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>{getPoleDisplayName(jump.pole, poles)}</span>
                    {jump.gripHeight && <span>Grip: {jump.gripHeight}</span>}
                    {(jump.videoUrl || jump.videoLocalUri) && (
                      <div className="flex items-center gap-1">
                        <Video className="h-4 w-4" />
                        <span
                          className={
                            jump.videoUploadStatus === 'completed' ? 'text-green-600' :
                            jump.videoUploadStatus === 'uploading' ? 'text-blue-600' :
                            jump.videoUploadStatus === 'failed' ? 'text-red-600' :
                            jump.videoUploadStatus === 'pending' ? 'text-yellow-600' :
                            'text-gray-600'
                          }
                        >
                          {jump.videoUploadStatus === 'completed' ? 'Video Ready' :
                           jump.videoUploadStatus === 'uploading' ? 'Uploading...' :
                           jump.videoUploadStatus === 'failed' ? 'Upload Failed' :
                           jump.videoUploadStatus === 'pending' ? 'Upload Pending' :
                           'Video'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {(jump.videoUrl || jump.videoLocalUri) && jump.thumbnailUrl && (
                <div className="w-16 h-12 bg-gray-100 rounded border overflow-hidden flex-shrink-0">
                  <img
                    src={jump.thumbnailUrl}
                    alt="Jump thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </CardContent>
            </Card>
            ))}
          </div>
          </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Jump Detail Modal */}
      {selectedJump && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedJump(null)}
        >
          <Card
            className="max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Jump {currentJumpIndex + 1} - {formatHeight(selectedJump.height, selectedJump.barUnits)}
            </h3>
            <Button variant="ghost" onClick={() => setSelectedJump(null)}>
              ×
            </Button>
          </div>

          {/* Video Player with Navigation */}
          {(selectedJump.videoUrl || selectedJump.videoLocalUri) && (
            <>
              <div className="mb-4 relative">
                {/* Previous Button */}
                {currentJumpIndex > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToPreviousJump}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full h-12 w-12"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                )}

                {/* Next Button */}
                {currentJumpIndex < jumps.length - 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToNextJump}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full h-12 w-12"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                )}

                <div className="bg-black rounded-lg overflow-hidden">
                  {selectedJump.videoUrl && selectedJump.videoUrl.startsWith('https://') ? (
                    <video
                      controls
                      className="w-full h-auto max-h-[60vh]"
                      preload="metadata"
                      playsInline
                      autoPlay
                    >
                      <source src={selectedJump.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : selectedJump.videoLocalUri && selectedJump.videoLocalUri.startsWith('https://') ? (
                    <video
                      controls
                      className="w-full h-auto max-h-[60vh]"
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
                        This video is stored locally on your mobile device and hasn't been uploaded to the cloud yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Jump Counter */}
              <div className="text-center text-sm text-gray-600 mb-4">
                Jump {currentJumpIndex + 1} of {jumps.length}
              </div>
            </>
          )}

          {/* Jump Info */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">Height</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatHeight(selectedJump.height, selectedJump.barUnits)}
              </div>
            </div>
            {!selectedJump.isWarmup && session.sessionType !== 'training' && (
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">Result</div>
                <div className="flex items-center gap-2">
                  {selectedJump.result === 'make' ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="capitalize">Make</span>
                    </>
                  ) : selectedJump.result === 'miss' ? (
                    <>
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span className="capitalize">Miss</span>
                    </>
                  ) : (
                    <span className="text-gray-500">Not tracked</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            {selectedJump.rating && (
              <div className="flex-1 min-w-[150px]">
                <div className="text-sm font-medium text-gray-900 mb-1">Rating</div>
                <Badge
                  variant="secondary"
                  style={{
                    backgroundColor: `${ratingColors[selectedJump.rating]}20`,
                    color: ratingColors[selectedJump.rating]
                  }}
                >
                  {ratingLabels[selectedJump.rating] || selectedJump.rating}
                </Badge>
              </div>
            )}

            <div className="flex-1 min-w-[150px]">
              <div className="text-sm font-medium text-gray-900 mb-1">Equipment</div>
              <div className="text-sm text-gray-600">{getPoleDisplayName(selectedJump.pole, poles)}</div>
              {selectedJump.gripHeight && (
                <div className="text-sm text-gray-500">Grip: {selectedJump.gripHeight}</div>
              )}
            </div>

            {selectedJump.steps && (
              <div className="flex-1 min-w-[150px]">
                <div className="text-sm font-medium text-gray-900 mb-1">Approach</div>
                <div className="text-sm text-gray-600">{selectedJump.steps} steps</div>
              </div>
            )}
          </div>

          {selectedJump.notes && (
            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">Notes</div>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border">
                {selectedJump.notes}
              </div>
            </div>
          )}

          {!selectedJump.videoUrl && !selectedJump.videoLocalUri && (
            <Card className="p-8 text-center border-dashed border-2 border-gray-300 mt-4">
              <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Video Available
              </h3>
              <p className="text-gray-600">
                This jump doesn't have a video recording
              </p>
            </Card>
          )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VaultSessionDetail;