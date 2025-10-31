import { useAdminAnalytics } from '@/hooks/useAdminData';
import { Users, Award, Ticket, TrendingUp, RefreshCw, Crown, Clock, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { debugUserFields } from '@/services/debugService';
import { toast } from 'sonner';

const VaultAdminOverview = () => {
  const { analytics, loading, refresh } = useAdminAnalytics();

  const handleDebug = async () => {
    toast.info('Running debug... check browser console (F12)');
    await debugUserFields();
    toast.success('Debug complete! Check console for details');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A6FF]"></div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: analytics.totalUsers,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Lifetime Access Users',
      value: analytics.lifetimeAccessUsers,
      icon: Award,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Active Promo Codes',
      value: analytics.activePromoCodes,
      icon: Ticket,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Total Redemptions',
      value: analytics.totalPromoCodeRedemptions,
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Overview</h2>
          <p className="text-gray-600 mt-1">Dashboard analytics and insights</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleDebug}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Bug className="w-4 h-4" />
            Debug Users
          </Button>
          <Button
            onClick={refresh}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Redemptions */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Ticket className="w-5 h-5" />
            Recent Promo Code Redemptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.recentRedemptions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Ticket className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No redemptions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {analytics.recentRedemptions.map((redemption, index) => (
                <div
                  key={`${redemption.userId}-${index}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{redemption.userEmail}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Used code: <span className="text-[#00A6FF]">{redemption.promoCode}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {new Date(redemption.redeemedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscription Breakdown */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Subscription Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{analytics.freeUsers}</div>
              <div className="text-sm text-gray-600 mt-1">Free Users</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-orange-600">
                <Clock className="w-5 h-5" />
                {analytics.trialUsers}
              </div>
              <div className="text-sm text-orange-600 mt-1">On Pass</div>
              <div className="text-xs text-orange-500 mt-0.5">Onboarding/Trial/Day</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{analytics.athletePlusUsers}</div>
              <div className="text-sm text-purple-600 mt-1">Pro (Paying)</div>
              <div className="text-xs text-purple-500 mt-0.5">$9.99/mo or $79/yr</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-700">Lifetime Access (Comp)</span>
              <span className="text-xl font-bold text-green-600">{analytics.lifetimeAccessUsers}</span>
            </div>
            <div className="text-xs text-green-600 mt-1">Not included in revenue calculations</div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#00A6FF]">
              {analytics.totalUsers > 0
                ? ((analytics.lifetimeAccessUsers / analytics.totalUsers) * 100).toFixed(1)
                : 0}%
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Users with lifetime access
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Average Redemptions per Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#00A6FF]">
              {analytics.activePromoCodes > 0
                ? (analytics.totalPromoCodeRedemptions / analytics.activePromoCodes).toFixed(1)
                : 0}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Across all active promo codes
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VaultAdminOverview;
