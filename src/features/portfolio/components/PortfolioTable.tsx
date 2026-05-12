'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePortfolioPositions } from '@/hooks/useApi';
import { Table, Card, Skeleton } from '@/design-system/components';
import { formatCurrency, formatPercentage, formatNumber } from '@/utils/helpers';
import { PortfolioPosition } from '@/types';

const columns = [
  {
    key: 'productId' as const,
    label: 'Asset',
    format: (value: unknown) => `Asset #${value}`,
  },
  {
    key: 'quantity' as const,
    label: 'Quantity',
    format: (value: unknown) => formatNumber(value as number),
  },
  {
    key: 'purchasePrice' as const,
    label: 'Cost Basis',
    format: (value: unknown) => formatCurrency(value as number),
  },
  {
    key: 'currentPrice' as const,
    label: 'Current Price',
    format: (value: unknown) => formatCurrency(value as number || 0),
  },
  {
    key: 'value' as const,
    label: 'Total Value',
    format: (value: unknown, row: PortfolioPosition) => 
      formatCurrency((row.currentPrice || row.purchasePrice) * row.quantity),
  },
  {
    key: 'percentageChange' as const,
    label: 'Change',
    format: (value: unknown, row: PortfolioPosition) => {
      const change = ((row.currentPrice || row.purchasePrice) - row.purchasePrice) / row.purchasePrice;
      return (
        <span className={change >= 0 ? 'text-green-600' : 'text-red-600'}>
          {formatPercentage(change)}
        </span>
      );
    },
  },
];

export function PortfolioTable() {
  const { user } = useAuth();
  const { data: positions, isLoading } = usePortfolioPositions(user?.id.toString());

  return (
    <Card variant="outlined" padding="md">
      <h2 className="text-lg font-semibold mb-4 text-neutral-900">Portfolio Positions</h2>
      <Table
        columns={columns}
        data={positions || []}
        isLoading={isLoading}
        emptyState={<p>No positions yet. Start investing to see them here.</p>}
      />
    </Card>
  );
}

export default PortfolioTable;
