import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { getUser } from '@/services/adminService';
import { AdminUser } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Crown, Mail, Smartphone, LogOut, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

const VaultProfile = () => {
  const { user, signOut } = useFirebaseAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (user?.uid) {
        try {
          const profile = await getUser(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Failed to load user profile:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadUserProfile();
  }, [user]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
      navigate('/vault/login');
    }
  };

  const getSubscriptionBadge = () => {
    if (!userProfile) return null;

    const tier = userProfile.subscriptionTier;
    const status = userProfile.subscriptionStatus;

    if (tier === 'lifetime') {
      return <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
        <Crown className="w-3 h-3 mr-1" />
        Lifetime Pro
      </Badge>;
    }

    if (status === 'active' && tier === 'athlete_plus') {
      return <Badge className="bg-[#00A6FF] text-white border-0">Pro</Badge>;
    }

    if (status === 'active' && tier === 'athlete') {
      return <Badge className="bg-[#3176FF] text-white border-0">Plus</Badge>;
    }

    if (status === 'trial') {
      return <Badge variant="outline" className="border-blue-500 text-blue-700">
        Trial {userProfile.trialDaysRemaining ? `(${userProfile.trialDaysRemaining} days left)` : ''}
      </Badge>;
    }

    return <Badge variant="outline">Free</Badge>;
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account and subscription
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                <div className="animate-pulse h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="animate-pulse h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <p className="text-gray-900 mt-1">{user.email}</p>
                </div>
                {userProfile?.username && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Username</label>
                    <p className="text-gray-900 mt-1">@{userProfile.username}</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5" />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2"></div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Current Plan:</span>
                  {getSubscriptionBadge()}
                </div>
                {userProfile?.subscriptionStatus === 'active' && (
                  <p className="text-sm text-gray-600">
                    Manage your subscription in the mobile app
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* App Settings Note */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Smartphone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Mobile App Settings</h3>
                <p className="text-sm text-gray-600">
                  Personal records, training preferences, notifications, and other settings are managed in the Vault mobile app.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full justify-start"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>

            <div className="pt-3 border-t">
              <p className="text-sm text-gray-600 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                To delete your account or change your email, use the settings in the mobile app
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VaultProfile;
