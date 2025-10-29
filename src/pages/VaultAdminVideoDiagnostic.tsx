import { useState } from 'react';
import { collection, getDocs, doc, getDoc, query, limit } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function VaultAdminVideoDiagnostic() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  async function runDiagnostic() {
    setRunning(true);
    const diagnosticResults: any = {
      totalUsers: 0,
      usersWithSessions: 0,
      totalSessions: 0,
      sessionsWithJumps: 0,
      totalJumps: 0,
      jumpsWithVideos: 0,
      sampleUsers: [],
      sampleSessions: [],
      errors: [],
    };

    try {
      // Get all users
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      diagnosticResults.totalUsers = usersSnapshot.size;

      console.log(`Found ${usersSnapshot.size} users`);

      // Check first 5 users for sessions
      const userSamples = usersSnapshot.docs.slice(0, 5);

      for (const userDoc of userSamples) {
        const userId = userDoc.id;
        const userData = userDoc.data();

        try {
          const sessionsRef = collection(db, 'users', userId, 'sessions');
          const sessionsSnapshot = await getDocs(query(sessionsRef, limit(10)));

          const userDiagnostic: any = {
            userId,
            userName: userData.username || userData.displayName,
            sessionCount: sessionsSnapshot.size,
            sessions: [],
          };

          if (sessionsSnapshot.size > 0) {
            diagnosticResults.usersWithSessions++;
            diagnosticResults.totalSessions += sessionsSnapshot.size;
          }

          // Check each session
          sessionsSnapshot.forEach((sessionDoc) => {
            const sessionData = sessionDoc.data();

            const sessionInfo: any = {
              sessionId: sessionDoc.id,
              hasJumps: !!sessionData.jumps,
              jumpsCount: sessionData.jumps?.length || 0,
              jumpsWithVideos: 0,
              sampleJump: null,
            };

            if (sessionData.jumps && Array.isArray(sessionData.jumps)) {
              diagnosticResults.sessionsWithJumps++;
              diagnosticResults.totalJumps += sessionData.jumps.length;

              sessionData.jumps.forEach((jump: any) => {
                if (jump.videoUrl) {
                  sessionInfo.jumpsWithVideos++;
                  diagnosticResults.jumpsWithVideos++;

                  // Save first jump with video as sample
                  if (!sessionInfo.sampleJump) {
                    sessionInfo.sampleJump = {
                      id: jump.id,
                      videoUrl: jump.videoUrl,
                      hasCompressedSize: !!jump.compressedSize,
                      hasOriginalSize: !!jump.originalSize,
                      hasVideoSize: !!jump.videoSize,
                      compressedSize: jump.compressedSize,
                      originalSize: jump.originalSize,
                    };
                  }
                }
              });
            }

            userDiagnostic.sessions.push(sessionInfo);
          });

          diagnosticResults.sampleUsers.push(userDiagnostic);
        } catch (error: any) {
          console.error(`Error checking user ${userId}:`, error);
          diagnosticResults.errors.push({
            userId,
            error: error.message,
          });
        }
      }

      setResults(diagnosticResults);
    } catch (error: any) {
      console.error('Diagnostic error:', error);
      setResults({ error: error.message });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Video Diagnostic Tool</h2>
        <p className="text-gray-600 mt-1">
          Scan Firestore to understand video storage structure
        </p>
      </div>

      <Button onClick={runDiagnostic} disabled={running}>
        {running ? 'Running Diagnostic...' : 'Run Diagnostic'}
      </Button>

      {results && (
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{results.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{results.totalSessions}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Jumps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{results.totalJumps}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Jumps with Videos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {results.jumpsWithVideos}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results */}
          <Card>
            <CardHeader>
              <CardTitle>Sample Users (First 5)</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-50 p-4 rounded overflow-x-auto">
                {JSON.stringify(results.sampleUsers, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {results.errors.length > 0 && (
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle>Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-red-100 p-4 rounded overflow-x-auto">
                  {JSON.stringify(results.errors, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
