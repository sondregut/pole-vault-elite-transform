import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Share2, Users, QrCode, Copy, Check, Smartphone, Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { inviteService } from '@/services/inviteService';

const VaultShareSection = () => {
  const { toast } = useToast();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const generateInviteLink = async () => {
    setIsGenerating(true);
    try {
      // For demo purposes, using placeholder data
      // In production, this would use actual user data
      const result = await inviteService.createInvite(
        'app_share',
        'demo_user',
        'demo_id',
        'Demo User'
      );

      setInviteLink(result.url);
      setInviteCode(result.code);
      setShowShareDialog(true);

      toast({
        title: "Invite link created!",
        description: `Link expires in ${result.expires_in_days} days`,
      });
    } catch (error) {
      toast({
        title: "Error creating invite",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const shareViaSystem = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on Vault',
          text: `Join me on Vault - the ultimate pole vaulting app! Use my invite code: ${inviteCode}`,
          url: inviteLink,
        });
      } catch (error) {
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      copyToClipboard(inviteLink, 'link');
    }
  };

  const copyToClipboard = async (text: string, type: 'link' | 'code') => {
    try {
      await navigator.clipboard.writeText(text);

      if (type === 'link') {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } else {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      }

      toast({
        title: `${type === 'link' ? 'Link' : 'Code'} copied!`,
        description: "Share it with your friends",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Share Vault With Your Team
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Invite your teammates and coaches to join Vault. Train together, compete better.
          </p>
        </div>

        {/* Share Options */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Direct Share */}
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={generateInviteLink}>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Share2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Share Link</h3>
              <p className="text-gray-600 text-sm">
                Generate a personalized invite link to share via any platform
              </p>
            </div>
          </Card>

          {/* Friend Invite */}
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={generateInviteLink}>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Invite Friends</h3>
              <p className="text-gray-600 text-sm">
                Send a friend invitation with your username included
              </p>
            </div>
          </Card>

          {/* QR Code */}
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={generateInviteLink}>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <QrCode className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">QR Code</h3>
              <p className="text-gray-600 text-sm">
                Show a QR code for quick in-person sharing
              </p>
            </div>
          </Card>
        </div>

        {/* App Store Badges */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Available on iOS</p>
          <div className="flex justify-center gap-4">
            <a
              href="https://apps.apple.com/app/vault/id123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <img
                src="/lovable-uploads/app-store-badge.png"
                alt="Download on the App Store"
                className="h-12"
              />
            </a>
          </div>
        </div>

        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Vault</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Invite Link */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Invite Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="flex-1 px-3 py-2 border rounded-md bg-gray-50 text-sm"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(inviteLink, 'link')}
                  >
                    {copiedLink ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Invite Code */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Invite Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inviteCode}
                    readOnly
                    className="flex-1 px-3 py-2 border rounded-md bg-gray-50 text-sm font-mono font-bold"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(inviteCode, 'code')}
                  >
                    {copiedCode ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Share Options */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Share via</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={shareViaSystem}
                    className="flex items-center gap-2"
                  >
                    <Smartphone className="w-4 h-4" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(inviteLink, 'link')}
                    className="flex items-center gap-2"
                  >
                    <Link className="w-4 h-4" />
                    Copy Link
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-900">
                <p className="font-semibold mb-1">How it works:</p>
                <ol className="list-decimal list-inside space-y-1 text-blue-800">
                  <li>Share this link or code with friends</li>
                  <li>They'll be directed to download Vault</li>
                  <li>After installing, you'll automatically connect</li>
                </ol>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default VaultShareSection;