'use client';

import { AdminLayout } from '@/components/AdminLayout';
import { DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import { EmptyState } from '@/components/StateMessages';

export default function AdminPricing() {
  return (
    <AdminLayout>
      <div className="space-y-8 animate-fadeIn">
        <div>
          <h1 className="heading-lg text-slate-900">Pricing Management</h1>
          <p className="text-slate-600 mt-2">Set and manage product prices for accurate portfolio valuations</p>
        </div>

        <EmptyState
          title="Pricing Tools Available Soon"
          description="Manage product prices, import market data, and configure valuation rules for your portfolio."
          icon={<DollarSign className="w-12 h-12" />}
        />

        {/* Feature Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200/50 p-6 hover:shadow-elevated transition-all duration-300">
            <div className="p-3 bg-amber-100 rounded-lg w-fit mb-4">
              <DollarSign className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Manual Pricing</h3>
            <p className="text-sm text-slate-600">Set custom prices for products and manage valuation overrides.</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200/50 p-6 hover:shadow-elevated transition-all duration-300">
            <div className="p-3 bg-green-100 rounded-lg w-fit mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Market Data</h3>
            <p className="text-sm text-slate-600">Import real-time market data and pricing feeds automatically.</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200/50 p-6 hover:shadow-elevated transition-all duration-300">
            <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Price History</h3>
            <p className="text-sm text-slate-600">Track historical pricing data and generate valuation reports.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
