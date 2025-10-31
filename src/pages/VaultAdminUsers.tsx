import { useState, useEffect } from 'react';
import { searchUsers, toggleUserLifetimeAccess } from '@/services/adminService';
import { AdminUser } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Award, Calendar, Ticket, Shield, ShieldOff, Clock, Crown } from 'lucide-react';
import { toast } from 'sonner';

const VaultAdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    // Load all users on mount
    handleSearch();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setSearchPerformed(true);
    try {
      const results = await searchUsers(searchTerm);
      setUsers(results);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLifetimeAccess = async (user: AdminUser) => {
    const newStatus = !user.hasLifetimeAccess;
    const result = await toggleUserLifetimeAccess(user.id, newStatus);

    if (result.success) {
      toast.success(
        newStatus
          ? `Granted lifetime access to ${user.email}`
          : `Revoked lifetime access from ${user.email}`
      );
      // Refresh the user list
      handleSearch();
    } else {
      toast.error(result.error || 'Failed to update user access');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
        <p className="text-gray-600 mt-1">Search and manage user access</p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search by email or username..."
            className="pl-10 bg-white border-gray-300"
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={loading}
          className="bg-[#00A6FF] hover:bg-[#0095E8]"
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A6FF]"></div>
        </div>
      ) : !searchPerformed ? (
        <Card className="bg-white border-gray-200">
          <CardContent className="text-center py-12">
            <Search className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600">Search for users to manage their access</p>
          </CardContent>
        </Card>
      ) : users.length === 0 ? (
        <Card className="bg-white border-gray-200">
          <CardContent className="text-center py-12">
            <Search className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600">No users found</p>
            <p className="text-sm text-gray-500 mt-1">Try a different search term</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Found {users.length} user{users.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {users.map((user) => (
              <Card key={user.id} className="bg-white border-gray-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900">{user.email}</CardTitle>
                      {user.username && (
                        <p className="text-sm text-gray-600 mt-1">@{user.username}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {/* Subscription Tier Badge */}
                        <Badge
                          variant={user.subscriptionTier === 'lifetime' ? 'default' : 'secondary'}
                          className={
                            user.subscriptionTier === 'lifetime' ? 'bg-green-500' :
                            user.subscriptionTier === 'athlete_plus' ? 'bg-purple-500' :
                            user.subscriptionTier === 'athlete' ? 'bg-blue-500' : ''
                          }
                        >
                          {user.subscriptionTier === 'lifetime' && <Crown className="w-3 h-3 mr-1" />}
                          {user.subscriptionTier === 'lifetime' ? 'Lifetime' :
                           user.subscriptionTier === 'athlete_plus' ? 'Pro' :
                           user.subscriptionTier === 'athlete' ? 'Pro' : 'Free'}
                        </Badge>

                        {/* Payment Status Indicator */}
                        {user.hasLifetimeAccess && (
                          <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50">
                            <Crown className="w-3 h-3 mr-1" />
                            Comp (Not Paying)
                          </Badge>
                        )}

                        {/* Trial Badge */}
                        {user.trialDaysRemaining && user.trialDaysRemaining > 0 && !user.hasLifetimeAccess && (
                          <Badge variant="outline" className="border-orange-500 text-orange-600">
                            <Clock className="w-3 h-3 mr-1" />
                            Trial: {user.trialDaysRemaining}d left (Not Paying)
                          </Badge>
                        )}

                        {/* Paying Status - Must match revenue service logic EXACTLY */}
                        {(() => {
                          // EXCLUDE comp/lifetime (no recurring revenue)
                          if (user.hasLifetimeAccess === true) return null;

                          // EXCLUDE trial users (not paying yet) - check Firestore field
                          if (user.isTrialing === true) return null;

                          // EXCLUDE if not a paid tier
                          if (user.subscriptionTier !== 'athlete' && user.subscriptionTier !== 'athlete_plus') return null;

                          // Only count users with active subscriptions OR users with paid tiers (backwards compatibility)
                          const status = user.subscriptionStatus?.toLowerCase();
                          const tier = user.subscriptionTier?.toLowerCase();
                          const isActive = status === 'active' ||
                                          (!status && (tier === 'athlete' || tier === 'athlete_plus' || tier === 'athleteplus'));

                          if (!isActive) return null;

                          // EXCLUDE if subscription has expired
                          if (user.subscriptionExpiresAt) {
                            const expiresAt = new Date(user.subscriptionExpiresAt);
                            if (expiresAt < new Date()) return null;
                          }

                          // If we got here, user is PAYING
                          return (
                            <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-50">
                              💰 Paying
                            </Badge>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    {user.promoCodeUsed && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Ticket className="w-4 h-4" />
                        <span>
                          Used code: <span className="text-[#00A6FF] font-mono">{user.promoCodeUsed}</span>
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {user.lastActive && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Award className="w-4 h-4" />
                        <span>
                          Last active: {new Date(user.lastActive).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {user.subscriptionExpiresAt && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          Subscription expires: {new Date(user.subscriptionExpiresAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <Button
                      onClick={() => handleToggleLifetimeAccess(user)}
                      variant={user.hasLifetimeAccess ? 'destructive' : 'default'}
                      size="sm"
                      className={
                        user.hasLifetimeAccess
                          ? 'w-full gap-2'
                          : 'w-full gap-2 bg-[#00A6FF] hover:bg-[#0095E8]'
                      }
                    >
                      {user.hasLifetimeAccess ? (
                        <>
                          <ShieldOff className="w-4 h-4" />
                          Revoke Lifetime Access
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          Grant Lifetime Access
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultAdminUsers;
