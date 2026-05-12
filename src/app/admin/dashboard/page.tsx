'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getAllUsers, getAllRequests, getUserPortfolioPositions, getLatestPrice } from '@/lib/api';
import type { User, InvestmentRequest, PortfolioPosition, Price } from '@/lib/types';
import { Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { MetricCard, MetricsGrid } from '@/components/MetricCard';
import { ShimmerLoadingState } from '@/components/LoadingShimmer';
import { EmptyState, ErrorState } from '@/components/StateMessages';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<InvestmentRequest[]>([]);
  const [totalAUM, setTotalAUM] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load all users
        const allUsers = await getAllUsers();
        setUsers((allUsers as User[]).filter((u: User) => u.role === 'client'));

        // Load all requests
        const allRequests = await getAllRequests();
        setRequests(allRequests);

        // Calculate total AUM
        let aum = 0;
        for (const client of allUsers) {
          if (client.role === 'client') {
            const positions = await getUserPortfolioPositions(client.id);
            for (const position of positions) {
              const price = await getLatestPrice(position.productId);
              if (price) {
                aum += position.quantity * price.price;
              }
            }
          }
        }
        setTotalAUM(aum);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const pendingRequests = requests.filter((r) => r.status === 'pending').length;
  const approvedRequests = requests.filter((r) => r.status === 'approved').length;
  const recentActivity = requests.slice(0, 5);

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 mt-2">Overview of clients, portfolios, and requests</p>
          </div>
          <ShimmerLoadingState />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 mt-2">Overview of clients, portfolios, and requests</p>
          </div>
          <ErrorState message={error} retry={() => window.location.reload()} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="heading-xl text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-2">Overview of clients, portfolios, and requests</p>
        </div>

        {/* Key Metrics - Enhanced Card Design */}
        <MetricsGrid
          metrics={[
            {
              title: 'Total Clients',
              value: users.length,
              icon: <Users className="w-6 h-6" />,
              variant: 'primary',
              trend: 12,
              trendLabel: 'vs last month',
            },
            {
              title: 'Total AUM',
              value: `$${(totalAUM / 1000000).toFixed(1)}M`,
              icon: <TrendingUp className="w-6 h-6" />,
              variant: 'success',
              trend: 8.5,
              trendLabel: 'growth',
            },
            {
              title: 'Pending Requests',
              value: pendingRequests,
              icon: <Clock className="w-6 h-6" />,
              variant: 'warning',
              subtitle: 'Awaiting action',
            },
            {
              title: 'Approved Requests',
              value: approvedRequests,
              icon: <CheckCircle className="w-6 h-6" />,
              variant: 'success',
              trendLabel: 'this month',
            },
          ]}
          columns={4}
        />

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Requests - Enhanced Design */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-elevated transition-all duration-300">
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
              <h2 className="heading-md text-slate-900">Recent Requests</h2>
              <p className="text-sm text-slate-600 mt-1">Latest investment and account requests</p>
            </div>
            {recentActivity.length === 0 ? (
              <EmptyState
                title="No Recent Activity"
                description="All requests processed. Everything is up to date."
              />
            ) : (
              <div className="divide-y divide-slate-100">
                {recentActivity.map((request, idx) => (
                  <div
                    key={request.id}
                    className="p-5 hover:bg-slate-50/50 transition-colors duration-200 group animate-slideIn"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {request.type.charAt(0).toUpperCase() + request.type.slice(1)} Request
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                            request.status === 'pending'
                              ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-200'
                              : request.status === 'approved'
                                ? 'bg-green-100 text-green-700 ring-1 ring-green-200'
                                : 'bg-red-100 text-red-700 ring-1 ring-red-200'
                          }`}
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2 group-hover:text-slate-700 transition-colors">{request.message}</p>
                      <p className="text-xs text-slate-500 font-medium">
                        {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Client Statistics - Enhanced Design */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-elevated transition-all duration-300">
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
              <h2 className="heading-md text-slate-900">Client Statistics</h2>
            </div>
            <div className="p-6 space-y-5">
              {[
                {
                  label: 'Active Clients',
                  value: users.filter((u) => u.status === 'active').length,
                  color: 'from-green-50 to-emerald-50',
                  accent: 'text-green-600',
                },
                {
                  label: 'Suspended Clients',
                  value: users.filter((u) => u.status === 'suspended').length,
                  color: 'from-red-50 to-rose-50',
                  accent: 'text-red-600',
                },
                {
                  label: 'Total Requests',
                  value: requests.length,
                  color: 'from-blue-50 to-indigo-50',
                  accent: 'text-blue-600',
                },
                {
                  label: 'Avg AUM / Client',
                  value: `$${users.length > 0 ? (totalAUM / users.length / 1000000).toFixed(2) : '0'}M`,
                  color: 'from-purple-50 to-indigo-50',
                  accent: 'text-purple-600',
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg bg-gradient-to-br ${stat.color} border border-slate-100 hover:border-slate-200 transition-all duration-200 group`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-700">{stat.label}</span>
                    <span className={`text-xl font-bold ${stat.accent}`}>{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
