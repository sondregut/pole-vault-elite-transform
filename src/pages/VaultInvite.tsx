import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Users, Copy, Check, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { inviteService } from '@/services/inviteService';

interface InviteData {
  inviter_username: string;
  inviter_name?: string;
  type: string;
  expires_at: Date;
}

const VaultInvite = () => {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // App Store URL - Replace with your actual App Store URL
  const APP_STORE_URL = 'https://apps.apple.com/app/vault/id123456789';

  useEffect(() => {
    if (inviteCode) {
      fetchInviteData();
      // Copy invite code to clipboard for deferred deep linking
      copyToClipboard(inviteCode);
      // Store in localStorage as backup
      localStorage.setItem('vault_invite_code', inviteCode);
    }
  }, [inviteCode]);

  const fetchInviteData = async () => {
    try {
      setLoading(true);

      // Fetch invite details from Firebase
      const invite = await inviteService.getInvite(inviteCode!);

      if (!invite) {
        setError('Invalid or expired invite code');
        return;
      }

      // Check if invite is expired
      if (invite.expires_at < new Date()) {
        setError('This invite link has expired');
        return;
      }

      // Check if already used
      if (invite.used) {
        setError('This invite link has already been used');
        return;
      }

      setInviteData({
        inviter_username: invite.username,
        inviter_name: invite.display_name,
        type: invite.type,
        expires_at: invite.expires_at
      });

    } catch (err) {
      console.error('Error fetching invite:', err);
      setError('Failed to load invite details');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenApp = () => {
    // Try to open the app with Universal Link
    const universalLink = `https://${window.location.host}/vault/app/invite/${inviteCode}`;
    const appScheme = `vault://invite/${inviteCode}`;
    const startTime = Date.now();

    // Try opening the app
    window.location.href = universalLink;

    // Check if app opened after a short delay
    setTimeout(() => {
      if (Date.now() - startTime < 2000) {
        // App didn't open, redirect to App Store
        window.location.href = APP_STORE_URL;
      }
    }, 1500);
  };

  const handleCopyCode = () => {
    if (inviteCode) {
      copyToClipboard(inviteCode);
      toast({
        title: "Invite code copied!",
        description: "The code has been copied to your clipboard",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading invite...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invite</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => navigate('/vault')}
            className="w-full"
          >
            Learn More About Vault
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {inviteData
            ? `${inviteData.inviter_name || inviteData.inviter_username} invited you to Vault!`
            : 'You\'re invited to Vault!'}
        </title>
        <meta
          name="description"
          content={inviteData
            ? `${inviteData.inviter_name || inviteData.inviter_username} wants to connect with you on Vault. Track your athletic journey together!`
            : 'Join Vault to connect with athletes and track your training progress.'}
        />

        {/* Open Graph / Facebook */}
        <meta
          property="og:title"
          content={inviteData
            ? `${inviteData.inviter_name || inviteData.inviter_username} invited you to Vault!`
            : 'You\'re invited to Vault!'}
        />
        <meta
          property="og:description"
          content={inviteData
            ? `${inviteData.inviter_name || inviteData.inviter_username} wants to connect with you on Vault!`
            : 'Join Vault to connect with athletes and track your training progress.'}
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos/app%20icon%20tracker.png" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:image:alt" content="Vault App Icon" />
        <meta property="og:url" content={`https://stavhopp.no/vault/invite/${inviteCode}`} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content={inviteData
            ? `${inviteData.inviter_name || inviteData.inviter_username} invited you to Vault!`
            : 'You\'re invited to Vault!'}
        />
        <meta
          name="twitter:description"
          content={inviteData
            ? `${inviteData.inviter_name || inviteData.inviter_username} wants to connect with you on Vault!`
            : 'Join Vault to connect with athletes and track your training progress.'}
        />
        <meta name="twitter:image" content="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos/app%20icon%20tracker.png" />
        <meta name="twitter:image:alt" content="Vault App Icon" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-16 max-w-lg">
        <Card className="overflow-hidden shadow-2xl">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold mb-2">You're Invited to Vault!</h1>
            {inviteData && (
              <p className="text-blue-100">
                {inviteData.inviter_name || inviteData.inviter_username} wants to connect with you
              </p>
            )}
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Inviter info */}
              {inviteData && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Invited by</p>
                  <p className="text-xl font-semibold text-gray-900">
                    @{inviteData.inviter_username}
                  </p>
                </div>
              )}

              {/* Invite code display */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 mb-1">Your invite code</p>
                    <p className="text-lg font-mono font-bold text-blue-900">
                      {inviteCode}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyCode}
                    className="border-blue-200 hover:bg-blue-100"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-blue-600" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  {copied ? 'Copied to clipboard!' : 'Code automatically copied'}
                </p>
              </div>

              {/* App description */}
              <div className="text-center py-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Track Your Athletic Journey
                </h3>
                <p className="text-gray-600 text-sm">
                  Connect with coaches, track your progress, and achieve your pole vaulting goals
                </p>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleOpenApp}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Open in Vault App
                </Button>

                <Button
                  variant="outline"
                  onClick={() => window.location.href = APP_STORE_URL}
                  className="w-full"
                  size="lg"
                >
                  Download from App Store
                </Button>
              </div>

              {/* Instructions */}
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                <p className="font-semibold mb-2">How it works:</p>
                <ol className="space-y-1 list-decimal list-inside">
                  <li>Download the Vault app</li>
                  <li>Create your account</li>
                  <li>The app will automatically detect your invite</li>
                  <li>Connect with @{inviteData?.inviter_username}!</li>
                </ol>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>Questions? <a href="/vault" className="text-blue-600 hover:underline">Learn more about Vault</a></p>
        </div>
      </div>
    </div>
    </>
  );
};

export default VaultInvite;