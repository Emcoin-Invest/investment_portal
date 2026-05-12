'use client';

import { useEffect, useState } from 'react';
import { ClientLayout } from '@/components/ClientLayout';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, TrendingDown, DollarSign, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MetricCard, MetricsGrid } from '@/components/MetricCard';
import { ShimmerLoadingState } from '@/components/LoadingShimmer';
import { ErrorState, EmptyState } from '@/components/StateMessages';

interface PortfolioPosition {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
}

interface Product {
  id: string;
  name: string;
  symbol: string;
  description: string;
  category: string;
}

interface Price {
  id: string;
  productId: string;
  price: number;
  date: string;
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const [positions, setPositions] = useState<PortfolioPosition[]>([]);
  const [products, setProducts] = useState<Map<string, Product>>(new Map());
  const [prices, setPrices] = useState<Map<string, Price>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        setError(null);

        // Load portfolio positions
        const posResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio?userId=${user.id}`);
        if (!posResponse.ok) throw new Error('Failed to load portfolio');
        const userPositions = (await posResponse.json()) as PortfolioPosition[];
        setPositions(userPositions);

        // Load products
        const prodResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        if (!prodResponse.ok) throw new Error('Failed to load products');
        const allProducts = (await prodResponse.json()) as Product[];
        const productMap = new Map<string, Product>(allProducts.map((product) => [product.id, product]));
        setProducts(productMap);

        // Load latest prices
        const pricesMap = new Map<string, Price>();
        for (const position of userPositions) {
          const priceResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prices/latest?productId=${position.productId}`);
          if (priceResponse.ok) {
            const price = (await priceResponse.json()) as Price;
            pricesMap.set(position.productId, price);
          }
        }
        setPrices(pricesMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  const calculatePortfolioValue = () => {
    return positions.reduce((total, pos) => {
      const price = prices.get(pos.productId);
      return total + (pos.quantity * (price?.price || pos.purchasePrice));
    }, 0);
  };

  const calculateUnrealizedPL = () => {
    return positions.reduce((total, pos) => {
      const price = prices.get(pos.productId);
      const currentValue = pos.quantity * (price?.price || pos.purchasePrice);
      const costBasis = pos.quantity * pos.purchasePrice;
      return total + (currentValue - costBasis);
    }, 0);
  };

  const portfolioValue = calculatePortfolioValue();
  const unrealizedPL = calculateUnrealizedPL();
  const plPercentage = portfolioValue > 0 ? (unrealizedPL / (portfolioValue - unrealizedPL)) * 100 : 0;

  if (loading) {
    return (
      <ClientLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-2">Welcome back, {user?.name}</p>
          </div>
          <ShimmerLoadingState />
        </div>
      </ClientLayout>
    );
  }

  if (error) {
    return (
      <ClientLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-2">Welcome back, {user?.name}</p>
          </div>
          <ErrorState message={error} retry={() => window.location.reload()} />
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="space-y-8">
        {/* Header with personalization */}
        <div className="animate-slideIn">
          <h1 className="heading-xl text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2">Welcome back, <span className="font-semibold text-slate-900">{user?.name}</span></p>
        </div>

        {/* Key Metrics - Enhanced Design */}
        <MetricsGrid
          metrics={[
            {
              title: 'Portfolio Value',
              value: `$${portfolioValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
              icon: <DollarSign className="w-6 h-6" />,
              variant: 'primary',
              subtitle: `${positions.length} holdings`,
            },
            {
              title: 'Unrealized P&L',
              value: `$${unrealizedPL.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
              icon: unrealizedPL >= 0 ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />,
              variant: unrealizedPL >= 0 ? 'success' : 'danger',
              trend: undefined,
            },
            {
              title: 'Return %',
              value: `${plPercentage.toFixed(2)}%`,
              icon: <PieChart className="w-6 h-6" />,
              variant: plPercentage >= 0 ? 'success' : 'danger',
              trendLabel: plPercentage >= 0 ? 'gain' : 'loss',
            },
          ]}
          columns={3}
        />

        {/* Holdings Table - Premium Design */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-elevated transition-all duration-300">
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
            <h2 className="heading-md text-slate-900">Your Holdings</h2>
            <p className="text-sm text-slate-600 mt-1">Current portfolio positions and performance</p>
          </div>

          {positions.length === 0 ? (
            <EmptyState
              title="No Holdings Yet"
              description="Start investing to build your portfolio"
              icon={<PieChart className="w-8 h-8" />}
            />
          ) : (
            <div className="overflow-x-auto animate-slideInUp">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Product</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Quantity</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Price</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Value</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((position, idx) => {
                    const product = products.get(position.productId);
                    const price = prices.get(position.productId);
                    const currentPrice = price?.price || position.purchasePrice;
                    const value = position.quantity * currentPrice;
                    const costBasis = position.quantity * position.purchasePrice;
                    const pl = value - costBasis;
                    const plPercent = costBasis > 0 ? (pl / costBasis) * 100 : 0;

                    return (
                      <tr
                        key={position.id}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors duration-200 group animate-fadeIn"
                        style={{ animationDelay: `${idx * 30}ms` }}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {product?.name}
                            </p>
                            <p className="text-sm text-slate-500">{product?.symbol}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-slate-900 font-medium">
                          {position.quantity}
                        </td>
                        <td className="px-6 py-4 text-right text-slate-900 font-medium">
                          ${currentPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="font-semibold text-slate-900">
                            ${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                          </p>
                        </td>
                        <td className={`px-6 py-4 text-right font-semibold ${
                          pl >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <div className="flex items-center justify-end gap-1">
                            {pl >= 0 ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4" />
                            )}
                            <span>
                              {pl >= 0 ? '+' : ''} ${Math.abs(pl).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                            </span>
                            <span className="text-xs">({plPercent > 0 ? '+' : ''}{plPercent.toFixed(1)}%)</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
