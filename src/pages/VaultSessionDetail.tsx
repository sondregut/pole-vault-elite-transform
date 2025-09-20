import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { Session, Jump, formatDate, formatHeight, ratingLabels, ratingColors } from '@/types/vault';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseDb } from '@/utils/firebase';
import VideoPlayer from '@/components/vault/video/VideoPlayer';
import {
  BarChart3,
  Calendar,
  ArrowLeft,
  MapPin,
  Target,
  Activity,
  Video,
  Wrench,
  CheckCircle,
  XCircle,
  Star,
  Clock,
  Wind,
  Thermometer,
  Flag
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const VaultSessionDetail = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user, loading: authLoading } = useFirebaseAuth();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedJump, setSelectedJump] = useState<Jump | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/vault/login', { state: { from: location } });
    }
  }, [user, authLoading, navigate, location]);

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

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!user || !session) {
    return null;
  }

  const jumps = session.jumps || [];
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
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
                  Jumps ({jumps.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {jumps.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No jumps recorded in this session</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {jumps.map((jump, index) => (
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
                                  {jump.result === 'make' ? (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-red-600" />
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
                                  <span>{jump.pole}</span>
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
                )}
              </CardContent>
            </Card>
          </div>

          {/* Jump Detail Modal */}
          {selectedJump && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <Card className="max-w-4xl w-full max-h-[90vh] overflow-auto">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      Jump Details - {formatHeight(selectedJump.height, selectedJump.barUnits)}
                    </CardTitle>
                    <Button variant="ghost" onClick={() => setSelectedJump(null)}>
                      ×
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Jump Info */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-1">Height</div>
                          <div className="text-2xl font-bold text-gray-900">
                            {formatHeight(selectedJump.height, selectedJump.barUnits)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-1">Result</div>
                          <div className="flex items-center gap-2">
                            {selectedJump.result === 'make' ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                            <span className="capitalize">{selectedJump.result || 'Unknown'}</span>
                          </div>
                        </div>
                      </div>

                      {selectedJump.rating && (
                        <div>
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

                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-1">Equipment</div>
                        <div className="text-sm text-gray-600">{selectedJump.pole}</div>
                        {selectedJump.gripHeight && (
                          <div className="text-sm text-gray-500">Grip: {selectedJump.gripHeight}</div>
                        )}
                      </div>

                      {selectedJump.steps && (
                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-1">Approach</div>
                          <div className="text-sm text-gray-600">{selectedJump.steps} steps</div>
                        </div>
                      )}

                      {selectedJump.notes && (
                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-1">Notes</div>
                          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border">
                            {selectedJump.notes}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Video Player */}
                    <div>
                      {(selectedJump.videoUrl || selectedJump.videoLocalUri) ? (
                        <VideoPlayer
                          videoUrl={selectedJump.videoUrl || selectedJump.videoLocalUri || ''}
                          thumbnailUrl={selectedJump.thumbnailUrl}
                          title={`Jump ${jumps.indexOf(selectedJump) + 1} - ${formatHeight(selectedJump.height, selectedJump.barUnits)}`}
                          videoUploadStatus={selectedJump.videoUploadStatus}
                          className="w-full"
                        />
                      ) : (
                        <Card className="p-8 text-center border-dashed border-2 border-gray-300">
                          <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No Video Available
                          </h3>
                          <p className="text-gray-600">
                            This jump doesn't have a video recording
                          </p>
                        </Card>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VaultSessionDetail;