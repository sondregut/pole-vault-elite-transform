import { useState, useEffect } from 'react';
import { searchUsers, toggleUserLifetimeAccess } from '@/services/adminService';
import { AdminUser } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Award, Calendar, Ticket, Shield, ShieldOff, Clock, Crown, Users, DollarSign, TrendingUp, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import {
  calculateUserOverview,
  calculateSubscriptionDistribution,
  calculateUserGrowth,
  getMostActiveUsers,
  getRecentlyJoinedUsers
} from '@/utils/adminAnalytics';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const VaultAdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]); // For analytics
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

      // If no search term, store all users for analytics
      if (!searchTerm) {
        setAllUsers(results);
      }
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

  // Calculate analytics
  const userOverview = calculateUserOverview(allUsers);
  const subscriptionDistribution = calculateSubscriptionDistribution(allUsers);
  const userGrowth = calculateUserGrowth(allUsers);
  const mostActiveUsers = getMostActiveUsers(allUsers, 5);
  const recentlyJoinedUsers = getRecentlyJoinedUsers(allUsers, 5);

  // Chart colors
  const COLORS = ['#3176FF', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
        <p className="text-gray-600 mt-1">Search and manage user access</p>
      </div>

      {/* User Overview Stats */}
      {allUsers.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {userOverview.totalUsers}
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    {userOverview.activeUsers} active (30d)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Paying Users</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {userOverview.payingUsers}
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    {((userOverview.payingUsers / Math.max(userOverview.totalUsers, 1)) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Trial Users</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {userOverview.trialUsers}
                  </p>
                  <p className="text-xs text-orange-600 font-medium">
                    Potential conversions
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Crown className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Lifetime (Comp)</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {userOverview.lifetimeUsers}
                  </p>
                  <p className="text-xs text-purple-600 font-medium">
                    Free access granted
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  User Growth (Last 6 Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userGrowth.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={userGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="newUsers" stroke="#3176FF" strokeWidth={2} name="New Users" />
                      <Line type="monotone" dataKey="cumulative" stroke="#10b981" strokeWidth={2} name="Total Users" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Subscription Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {subscriptionDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={subscriptionDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ tier, percentage }) => `${tier}: ${percentage.toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {subscriptionDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Most Active & Recently Joined */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Most Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mostActiveUsers.map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between pb-3 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user.email}</p>
                          <p className="text-xs text-gray-500">
                            {user.lastActive && new Date(user.lastActive).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={user.hasLifetimeAccess ? 'default' : 'secondary'}>
                        {user.subscriptionTier === 'lifetime' ? 'Lifetime' :
                         user.subscriptionTier === 'athlete_plus' ? 'Pro' :
                         user.subscriptionTier === 'athlete' ? 'Pro' : 'Free'}
                      </Badge>
                    </div>
                  ))}
                  {mostActiveUsers.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No active users yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Recently Joined
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentlyJoinedUsers.map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between pb-3 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user.email}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={user.hasLifetimeAccess ? 'default' : 'secondary'}>
                        {user.subscriptionTier === 'lifetime' ? 'Lifetime' :
                         user.subscriptionTier === 'athlete_plus' ? 'Pro' :
                         user.subscriptionTier === 'athlete' ? 'Pro' : 'Free'}
                      </Badge>
                    </div>
                  ))}
                  {recentlyJoinedUsers.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No users yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

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
