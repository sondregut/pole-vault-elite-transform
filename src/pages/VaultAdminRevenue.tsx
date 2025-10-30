import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { revenueService } from '@/services/revenueService';
import { DollarSign, TrendingUp, Users, TrendingDown } from 'lucide-react';

export default function VaultAdminRevenue() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRevenueData();
  }, []);

  async function loadRevenueData() {
    setLoading(true);
    setError(null);

    try {
      const dashboardData = await revenueService.getDashboardData();
      setData(dashboardData);
    } catch (err) {
      console.error('Error loading revenue data:', err);
      setError('Failed to load revenue data');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A6FF]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button
          onClick={loadRevenueData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-gray-600">
        No revenue data available
      </div>
    );
  }

  // Prepare chart data
  const tierData = [
    { name: 'Athlete', revenue: data.tierRevenue.athlete, color: '#00A6FF' },
    { name: 'Athlete+', revenue: data.tierRevenue.athlete_plus, color: '#0095E8' },
  ];

  const funnelData = [
    { stage: 'Total Users', count: data.funnel.totalUsers },
    { stage: 'Free', count: data.funnel.freeUsers },
    { stage: 'Trial', count: data.funnel.trialUsers },
    { stage: 'Paid', count: data.funnel.paidUsers },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Revenue Analytics</h2>
        <p className="text-gray-600 mt-1">
          Financial metrics and subscription performance
        </p>
      </div>

      {/* Key Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(data.metrics.mrr)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Monthly Recurring Revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ARR</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(data.metrics.arr)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Annual Recurring Revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ARPU</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#00A6FF]">
              {formatCurrency(data.metrics.arpu)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Avg Revenue Per User</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {data.churn.churnRate.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-600 mt-1">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <p className="text-sm text-gray-600">Monthly recurring revenue over time</p>
        </CardHeader>
        <CardContent>
          {data.revenueOverTime && data.revenueOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.revenueOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#00A6FF"
                  strokeWidth={2}
                  name="MRR"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No historical revenue data available yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue by Tier & Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue by Tier */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Tier</CardTitle>
            <p className="text-sm text-gray-600">Monthly revenue breakdown</p>
          </CardHeader>
          <CardContent>
            {tierData.some((d) => d.revenue > 0) ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={tierData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${formatCurrency(entry.revenue)}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {tierData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-700">Athlete</span>
                    <span className="text-sm font-bold text-[#00A6FF]">
                      {formatCurrency(data.tierRevenue.athlete)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-700">Athlete+</span>
                    <span className="text-sm font-bold text-[#0095E8]">
                      {formatCurrency(data.tierRevenue.athlete_plus)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No paid subscribers yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <p className="text-sm text-gray-600">User journey from trial to paid</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#00A6FF" />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-sm font-medium text-gray-700">Conversion Rate</span>
                <span className="text-sm font-bold text-green-600">
                  {data.funnel.conversionRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Total Paid Users</span>
                <span className="text-sm font-semibold text-gray-900">
                  {data.funnel.paidUsers}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Trial Users</span>
                <span className="text-sm font-semibold text-gray-900">
                  {data.funnel.trialUsers}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Churn & User Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Churn Details */}
        <Card>
          <CardHeader>
            <CardTitle>Churn Analysis</CardTitle>
            <p className="text-sm text-gray-600">Subscription cancellations</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Monthly Churn Rate</div>
                <div className="text-3xl font-bold text-orange-600">
                  {data.churn.churnRate.toFixed(1)}%
                </div>
              </div>
              <TrendingDown className="h-10 w-10 text-orange-600 opacity-50" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Cancelled This Month</span>
                <span className="text-lg font-semibold text-gray-900">
                  {data.churn.cancelledThisMonth}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Active Paid Users</span>
                <span className="text-lg font-semibold text-gray-900">
                  {data.churn.activePaidUsers}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-600">Retention Rate</span>
                <span className="text-lg font-semibold text-green-600">
                  {(100 - data.churn.churnRate).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Metrics</CardTitle>
            <p className="text-sm text-gray-600">Key performance indicators</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Total Paid</div>
                <div className="text-2xl font-bold text-[#00A6FF]">
                  {data.metrics.totalPaidUsers}
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Total Users</div>
                <div className="text-2xl font-bold text-purple-600">
                  {data.funnel.totalUsers}
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">MRR</div>
                <div className="text-xl font-bold text-green-600">
                  {formatCurrency(data.metrics.mrr)}
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">ARPU</div>
                <div className="text-xl font-bold text-yellow-600">
                  {formatCurrency(data.metrics.arpu)}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Revenue Potential</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>If all trials convert to Athlete:</span>
                  <span className="font-semibold">
                    +{formatCurrency(data.funnel.trialUsers * 9.99)}/mo
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>If all trials convert to Athlete+:</span>
                  <span className="font-semibold">
                    +{formatCurrency(data.funnel.trialUsers * 19.99)}/mo
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={loadRevenueData}
          disabled={loading}
          className="px-4 py-2 bg-[#00A6FF] text-white rounded-lg hover:bg-[#0095E8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
}
