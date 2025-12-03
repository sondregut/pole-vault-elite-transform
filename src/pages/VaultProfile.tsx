import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { getUser } from '@/services/adminService';
import { redirectToPortal } from '@/services/stripeService';
import { AdminUser } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Crown, Mail, Smartphone, LogOut, HelpCircle, CreditCard, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const VaultProfile = () => {
  const { user, signOut } = useFirebaseAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

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

  const handleManageSubscription = async () => {
    if (!user?.uid) return;

    setPortalLoading(true);
    try {
      await redirectToPortal(user.uid);
    } catch (error) {
      console.error('Failed to open customer portal:', error);
      toast.error('Failed to open subscription management. Please try again.');
    } finally {
      setPortalLoading(false);
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
        <h1 className="text-3xl font-bold text-vault-text">Profile & Settings</h1>
        <p className="text-vault-text-secondary mt-1">
          Manage your account and subscription
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Information */}
        <div className="bg-white rounded-2xl shadow-vault border border-vault-border-light overflow-hidden">
          <div className="px-6 py-5 border-b border-vault-border-light">
            <h2 className="text-xl font-bold text-vault-text flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-vault-primary-muted flex items-center justify-center">
                <User className="h-4 w-4 text-vault-primary" />
              </div>
              Account Information
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {loading ? (
              <div className="space-y-3">
                <div className="animate-pulse h-4 bg-vault-primary-muted rounded w-1/3"></div>
                <div className="animate-pulse h-4 bg-vault-primary-muted rounded w-2/3"></div>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium text-vault-text-secondary flex items-center gap-2">
                    <Mail className="w-4 h-4 text-vault-text-muted" />
                    Email
                  </label>
                  <p className="text-vault-text mt-1 font-medium">{user.email}</p>
                </div>
                {userProfile?.username && (
                  <div>
                    <label className="text-sm font-medium text-vault-text-secondary">Username</label>
                    <p className="text-vault-text mt-1 font-medium">@{userProfile.username}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-white rounded-2xl shadow-vault border border-vault-border-light overflow-hidden">
          <div className="px-6 py-5 border-b border-vault-border-light">
            <h2 className="text-xl font-bold text-vault-text flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <Crown className="h-4 w-4 text-vault-warning" />
              </div>
              Subscription
            </h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="animate-pulse h-4 bg-vault-primary-muted rounded w-1/2"></div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-vault-text-secondary">Current Plan:</span>
                  {getSubscriptionBadge()}
                </div>
                {userProfile?.subscriptionStatus === 'active' && (
                  // Show Manage Subscription if: platform is 'web' OR has stripeCustomerId (fallback)
                  (userProfile?.subscriptionPlatform === 'web' || userProfile?.stripeCustomerId) ? (
                    <div className="space-y-2">
                      <Button
                        onClick={handleManageSubscription}
                        variant="outline"
                        className="w-full sm:w-auto border-vault-primary text-vault-primary hover:bg-vault-primary hover:text-white transition-colors"
                        disabled={portalLoading}
                      >
                        {portalLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Opening...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Manage Subscription
                            <ExternalLink className="w-3 h-3 ml-2" />
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-vault-text-muted">
                        Update payment method, change plan, or cancel subscription
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-vault-text-muted">
                      Manage your subscription in the mobile app
                    </p>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* App Settings Note */}
        <div className="bg-vault-primary-muted rounded-2xl border border-vault-primary/20 p-6">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-vault-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5 h-5 text-vault-primary" />
            </div>
            <div>
              <h3 className="font-bold text-vault-text mb-1">Mobile App Settings</h3>
              <p className="text-sm text-vault-text-secondary">
                Personal records, training preferences, notifications, and other settings are managed in the Vault mobile app.
              </p>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-2xl shadow-vault border border-vault-border-light overflow-hidden">
          <div className="px-6 py-5 border-b border-vault-border-light">
            <h2 className="text-xl font-bold text-vault-text">Account Actions</h2>
          </div>
          <div className="p-6 space-y-3">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full justify-start border-vault-error text-vault-error hover:bg-red-50 font-semibold rounded-xl"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>

            <div className="pt-3 border-t border-vault-border-light">
              <p className="text-sm text-vault-text-muted flex items-start gap-2">
                <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-vault-text-muted" />
                To delete your account or change your email, use the settings in the mobile app
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultProfile;
