'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePortfolio, useAdminStats } from '@/hooks/useApi';
import { StatCard, Card, Skeleton } from '@/design-system/components';
import { TrendingUp, Wallet, BarChart3, Users } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/utils/helpers';

export function DashboardStats() {
  const { user } = useAuth();
  const { data: portfolio, isLoading: portfolioLoading } = usePortfolio(user?.id.toString());
  const { data: adminStats, isLoading: statsLoading } = useAdminStats();

  if (portfolioLoading || statsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} variant="outlined" padding="md">
            <Skeleton height={24} width="60%" />
            <Skeleton height={32} width="80%" className="mt-2" />
          </Card>
        ))}
      </div>
    );
  }

  const stats = user?.role === 'admin' ? adminStats : portfolio;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {user?.role === 'admin' ? (
        <>
          <StatCard
            title="Total Users"
            value={adminStats?.totalUsers || 0}
            icon={<Users className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Total Assets"
            value={formatCurrency(adminStats?.totalAssets || 0)}
            icon={<Wallet className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Total Transactions"
            value={adminStats?.totalTransactions || 0}
            icon={<BarChart3 className="w-6 h-6" />}
            color="purple"
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(adminStats?.totalRevenue || 0)}
            icon={<TrendingUp className="w-6 h-6" />}
            color="yellow"
          />
        </>
      ) : (
        <>
          <StatCard
            title="Portfolio Value"
            value={formatCurrency(portfolio?.totalValue || 0)}
            trend={{
              value: portfolio?.percentageGain || 0,
              direction: (portfolio?.percentageGain || 0) >= 0 ? 'up' : 'down',
            }}
            icon={<Wallet className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Total Gain/Loss"
            value={formatCurrency(portfolio?.totalGain || 0)}
            trend={{
              value: portfolio?.percentageGain || 0,
              direction: (portfolio?.percentageGain || 0) >= 0 ? 'up' : 'down',
            }}
            icon={<TrendingUp className="w-6 h-6" />}
            color={portfolio?.totalGain || 0 >= 0 ? 'green' : 'red'}
          />
          <StatCard
            title="Positions"
            value={(portfolio?.positions || []).length}
            icon={<BarChart3 className="w-6 h-6" />}
            color="purple"
          />
          <StatCard
            title="Portfolio Change"
            value={formatPercentage(portfolio?.percentageGain || 0)}
            icon={<TrendingUp className="w-6 h-6" />}
            color={portfolio?.percentageGain || 0 >= 0 ? 'green' : 'red'}
          />
        </>
      )}
    </div>
  );
}

export default DashboardStats;
