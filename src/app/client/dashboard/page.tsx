'use client';

import { useEffect, useState } from 'react';
import { ClientLayout } from '@/components/ClientLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getUserPortfolioPositions, getLatestPrice, getAllProducts } from '@/lib/firestore';
import type { PortfolioPosition, Product, Price } from '@/lib/types';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [positions, setPositions] = useState<PortfolioPosition[]>([]);
  const [products, setProducts] = useState<Map<string, Product>>(new Map());
  const [prices, setPrices] = useState<Map<string, Price>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        setError(null);

        // Load portfolio positions
        const userPositions = await getUserPortfolioPositions(user.id);
        setPositions(userPositions);

        // Load products and prices
        const allProducts = await getAllProducts();
        const productMap = new Map(allProducts.map((p) => [p.id, p]));
        setProducts(productMap);

        // Load latest prices for each position
        const pricesMap = new Map<string, Price>();
        for (const position of userPositions) {
          const price = await getLatestPrice(position.productId);
          if (price) {
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
  }, [user]);

  // Calculate portfolio metrics
  const calculateMetrics = () => {
    let totalValue = 0;
    let totalCost = 0;

    positions.forEach((position) => {
      const price = prices.get(position.productId);
      if (price) {
        const positionValue = position.quantity * price.price;
        const positionCost = position.quantity * position.avgPrice;
        totalValue += positionValue;
        totalCost += positionCost;
      }
    });

    const unrealizedPnL = totalValue - totalCost;
    const pnLPercentage = totalCost > 0 ? (unrealizedPnL / totalCost) * 100 : 0;

    return { totalValue, unrealizedPnL, pnLPercentage };
  };

  const metrics = calculateMetrics();

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading dashboard...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name}!</h1>
          <p className="text-slate-600 mt-2">Here's your portfolio overview</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Portfolio Value */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-2">Total Portfolio Value</p>
                <p className="text-3xl font-bold text-slate-900">
                  ${metrics.totalValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          {/* Unrealized P&L */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-2">Unrealized P&L</p>
                <p
                  className={`text-3xl font-bold ${
                    metrics.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  ${metrics.unrealizedPnL.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </p>
                <p
                  className={`text-sm mt-2 ${
                    metrics.pnLPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {metrics.pnLPercentage >= 0 ? '+' : ''}
                  {metrics.pnLPercentage.toFixed(2)}%
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  metrics.unrealizedPnL >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {metrics.unrealizedPnL >= 0 ? (
                  <TrendingUp size={24} className="text-green-600" />
                ) : (
                  <TrendingDown size={24} className="text-red-600" />
                )}
              </div>
            </div>
          </div>

          {/* Holdings Count */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-2">Active Holdings</p>
                <p className="text-3xl font-bold text-slate-900">{positions.length}</p>
                <p className="text-sm text-slate-500 mt-2">
                  {positions.length === 1 ? 'position' : 'positions'}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <PieChart size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Your Holdings</h2>
          </div>
          {positions.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-600">No holdings yet. Contact your advisor to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Product</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Type</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Quantity</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Avg Price</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Current Price</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Value</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {positions.map((position) => {
                    const product = products.get(position.productId);
                    const price = prices.get(position.productId);
                    const currentPrice = price?.price || 0;
                    const positionValue = position.quantity * currentPrice;
                    const positionCost = position.quantity * position.avgPrice;
                    const positionPnL = positionValue - positionCost;
                    const positionPnLPercent = positionCost > 0 ? (positionPnL / positionCost) * 100 : 0;

                    return (
                      <tr key={position.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {product?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium">
                            {product?.type || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-slate-900">
                          {position.quantity.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-slate-900">
                          ${position.avgPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-slate-900">
                          ${currentPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-medium text-slate-900">
                          ${positionValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                        </td>
                        <td
                          className={`px-6 py-4 text-sm text-right font-medium ${
                            positionPnL >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {positionPnL >= 0 ? '+' : ''}${positionPnL.toFixed(2)} ({positionPnLPercent.toFixed(2)}%)
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
