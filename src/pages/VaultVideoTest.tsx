import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Video, XCircle } from 'lucide-react';

const VaultVideoTest = () => {
  const [testUrl, setTestUrl] = useState('');
  const [testResult, setTestResult] = useState<{
    canFetch: boolean;
    canPlay: boolean;
    error?: string;
    details?: any;
  } | null>(null);
  const [testing, setTesting] = useState(false);

  const testVideoUrl = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      // Test 1: Can we fetch the URL?
      console.log('[VideoTest] Testing URL:', testUrl);

      const fetchResponse = await fetch(testUrl, {
        method: 'HEAD',
        mode: 'cors'
      });

      console.log('[VideoTest] Fetch response:', {
        status: fetchResponse.status,
        headers: Object.fromEntries(fetchResponse.headers.entries())
      });

      if (!fetchResponse.ok) {
        setTestResult({
          canFetch: false,
          canPlay: false,
          error: `HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`,
          details: {
            status: fetchResponse.status,
            statusText: fetchResponse.statusText,
            headers: Object.fromEntries(fetchResponse.headers.entries())
          }
        });
        setTesting(false);
        return;
      }

      // Test 2: Try to create video element and load
      const video = document.createElement('video');

      const loadPromise = new Promise((resolve, reject) => {
        video.onloadedmetadata = () => {
          console.log('[VideoTest] Video metadata loaded successfully', {
            duration: video.duration,
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight
          });
          resolve(true);
        };

        video.onerror = (e) => {
          console.error('[VideoTest] Video error:', e);
          const error = video.error;
          reject({
            code: error?.code,
            message: error?.message,
            details: {
              MEDIA_ERR_ABORTED: error?.code === 1,
              MEDIA_ERR_NETWORK: error?.code === 2,
              MEDIA_ERR_DECODE: error?.code === 3,
              MEDIA_ERR_SRC_NOT_SUPPORTED: error?.code === 4
            }
          });
        };

        video.src = testUrl;
        video.load();
      });

      try {
        await loadPromise;
        setTestResult({
          canFetch: true,
          canPlay: true,
          details: {
            duration: video.duration,
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight,
            contentType: fetchResponse.headers.get('content-type')
          }
        });
      } catch (videoError: any) {
        console.error('[VideoTest] Video load error:', videoError);
        setTestResult({
          canFetch: true,
          canPlay: false,
          error: `Video Load Error: ${videoError.message || 'Unknown error'}`,
          details: videoError
        });
      }

    } catch (error: any) {
      console.error('[VideoTest] Fetch error:', error);
      setTestResult({
        canFetch: false,
        canPlay: false,
        error: error.message || 'Network error',
        details: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Video URL Diagnostic Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Paste a Firebase Storage video URL to test if it can be accessed and played.
            </p>

            <div className="flex gap-2">
              <Input
                placeholder="https://firebasestorage.googleapis.com/..."
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={testVideoUrl}
                disabled={!testUrl || testing}
              >
                {testing ? 'Testing...' : 'Test URL'}
              </Button>
            </div>
          </div>

          {testResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className={testResult.canFetch ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}>
                  <CardContent className="p-4 flex items-center gap-3">
                    {testResult.canFetch ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600" />
                    )}
                    <div>
                      <div className="font-medium">URL Accessible</div>
                      <div className="text-sm text-gray-600">
                        {testResult.canFetch ? 'URL can be fetched' : 'Cannot fetch URL'}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={testResult.canPlay ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}>
                  <CardContent className="p-4 flex items-center gap-3">
                    {testResult.canPlay ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600" />
                    )}
                    <div>
                      <div className="font-medium">Video Playable</div>
                      <div className="text-sm text-gray-600">
                        {testResult.canPlay ? 'Video can be played' : 'Cannot play video'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {testResult.error && (
                <Card className="border-red-300 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-red-900 mb-1">Error</div>
                        <div className="text-sm text-red-800">{testResult.error}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {testResult.details && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Technical Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-64">
                      {JSON.stringify(testResult.details, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}

              {!testResult.canFetch && (
                <Card className="border-blue-300 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="text-sm space-y-2">
                      <p className="font-medium text-blue-900">Possible Solutions:</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-800">
                        <li>Configure CORS in Firebase Storage</li>
                        <li>Check Firebase Storage security rules</li>
                        <li>Verify the URL token is valid</li>
                        <li>Ensure your Firebase project allows public read access</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}

              {testResult.canFetch && !testResult.canPlay && (
                <Card className="border-blue-300 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="text-sm space-y-2">
                      <p className="font-medium text-blue-900">Possible Solutions:</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-800">
                        <li>Video format may not be supported by browser</li>
                        <li>File may be corrupted or incomplete</li>
                        <li>Try re-encoding the video in H.264/AAC format</li>
                        <li>Check if the video file is actually a valid MP4</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <Card className="border-yellow-300 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-2">Firebase Storage Configuration Needed:</p>
                  <p className="mb-2">If videos aren't playing, you likely need to configure CORS and security rules in Firebase Console:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Go to Firebase Console → Storage</li>
                    <li>Set storage rules to allow read access</li>
                    <li>Configure CORS using gsutil or Firebase Console</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default VaultVideoTest;
