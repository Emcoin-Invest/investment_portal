'use client';

import { AdminLayout } from '@/components/AdminLayout';
import { PieChart, TrendingUp } from 'lucide-react';
import { EmptyState } from '@/components/StateMessages';

export default function AdminPortfolios() {
  return (
    <AdminLayout>
      <div className="space-y-8 animate-fadeIn">
        <div>
          <h1 className="heading-lg text-slate-900">Portfolio Management</h1>
          <p className="text-slate-600 mt-2">Monitor and manage client portfolio positions and allocations</p>
        </div>

        <EmptyState
          title="Portfolio Features Coming Soon"
          description="Advanced portfolio management tools including position tracking, rebalancing, and performance analytics will be available soon."
          icon={<PieChart className="w-12 h-12" />}
        />

        {/* Feature Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 p-6 hover:shadow-elevated transition-all duration-300">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
              <PieChart className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Position Tracking</h3>
            <p className="text-sm text-slate-600">Monitor all client holdings, valuations, and performance metrics in real-time.</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200/50 p-6 hover:shadow-elevated transition-all duration-300">
            <div className="p-3 bg-green-100 rounded-lg w-fit mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Portfolio Rebalancing</h3>
            <p className="text-sm text-slate-600">Implement automatic rebalancing strategies and maintain optimal asset allocation.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
