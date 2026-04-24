'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getAllUsers, getAllRequests, getUserPortfolioPositions, getLatestPrice } from '@/lib/firestore';
import type { User, InvestmentRequest, PortfolioPosition, Price } from '@/lib/types';
import { Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';

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
        setUsers(allUsers.filter((u) => u.role === 'client'));

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
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-2">Overview of clients, portfolios, and requests</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Clients */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-2">Total Clients</p>
                <p className="text-3xl font-bold text-slate-900">{users.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total AUM */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-2">Total AUM</p>
                <p className="text-3xl font-bold text-slate-900">
                  ${totalAUM.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-2">Pending Requests</p>
                <p className="text-3xl font-bold text-slate-900">{pendingRequests}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Approved Requests */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-2">Approved Requests</p>
                <p className="text-3xl font-bold text-slate-900">{approvedRequests}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Requests */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Recent Requests</h2>
            </div>
            {recentActivity.length === 0 ? (
              <div className="p-6 text-center text-slate-600">No recent activity</div>
            ) : (
              <div className="divide-y divide-slate-200">
                {recentActivity.map((request) => (
                  <div key={request.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-slate-900">
                        {request.type.charAt(0).toUpperCase() + request.type.slice(1)} Request
                      </p>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          request.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{request.message}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Client Statistics */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Client Statistics</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Active Clients</span>
                <span className="font-semibold text-slate-900">
                  {users.filter((u) => u.status === 'active').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Suspended Clients</span>
                <span className="font-semibold text-slate-900">
                  {users.filter((u) => u.status === 'suspended').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Total Requests</span>
                <span className="font-semibold text-slate-900">{requests.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Average AUM per Client</span>
                <span className="font-semibold text-slate-900">
                  ${users.length > 0 ? (totalAUM / users.length).toLocaleString('en-US', { maximumFractionDigits: 0 }) : '0'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
