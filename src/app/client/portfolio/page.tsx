'use client';

import { useEffect, useState } from 'react';
import { ClientLayout } from '@/components/ClientLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getUserPortfolioPositions, getLatestPrice, getAllProducts } from '@/lib/firestore';
import type { PortfolioPosition, Product, Price } from '@/lib/types';
import { PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function ClientPortfolio() {
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

        const userPositions = await getUserPortfolioPositions(user.id);
        setPositions(userPositions);

        const allProducts = await getAllProducts();
        const productMap = new Map(allProducts.map((p) => [p.id, p]));
        setProducts(productMap);

        const pricesMap = new Map<string, Price>();
        for (const position of userPositions) {
          const price = await getLatestPrice(position.productId);
          if (price) {
            pricesMap.set(position.productId, price);
          }
        }
        setPrices(pricesMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load portfolio data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Calculate allocation by product type
  const getAllocationByType = () => {
    const allocation: Record<string, number> = {};

    positions.forEach((position) => {
      const product = products.get(position.productId);
      const price = prices.get(position.productId);
      if (product && price) {
        const value = position.quantity * price.price;
        allocation[product.type] = (allocation[product.type] || 0) + value;
      }
    });

    return Object.entries(allocation).map(([type, value]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: Math.round(value * 100) / 100,
    }));
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const allocationData = getAllocationByType();
  const totalValue = allocationData.reduce((sum, item) => sum + item.value, 0);

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading portfolio...</p>
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
          <h1 className="text-3xl font-bold text-slate-900">Portfolio</h1>
          <p className="text-slate-600 mt-2">View your asset allocation and holdings breakdown</p>
        </div>

        {positions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <p className="text-slate-600">No holdings yet. Contact your advisor to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Allocation Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Asset Allocation</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Allocation Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Breakdown by Type</h2>
              <div className="space-y-4">
                {allocationData.map((item, index) => {
                  const percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
                  return (
                    <div key={item.name}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span className="font-medium text-slate-900">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">
                            ${item.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-sm text-slate-600">{percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Detailed Holdings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Detailed Holdings</h2>
          </div>
          {positions.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-600">No holdings to display.</p>
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
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Total Value</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">% of Portfolio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {positions.map((position) => {
                    const product = products.get(position.productId);
                    const price = prices.get(position.productId);
                    const currentPrice = price?.price || 0;
                    const positionValue = position.quantity * currentPrice;
                    const percentage = totalValue > 0 ? (positionValue / totalValue) * 100 : 0;

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
                        <td className="px-6 py-4 text-sm text-right text-slate-900">
                          {percentage.toFixed(2)}%
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
