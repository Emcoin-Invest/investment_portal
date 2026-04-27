'use client';

import { useEffect, useState } from 'react';
import { ClientLayout } from '@/components/ClientLayout';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';

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
        const userPositions = await posResponse.json();
        setPositions(userPositions);

        // Load products
        const prodResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        if (!prodResponse.ok) throw new Error('Failed to load products');
        const allProducts = await prodResponse.json();
        const productMap = new Map(allProducts.map((p: Product) => [p.id, p]));
        setProducts(productMap);

        // Load latest prices
        const pricesMap = new Map<string, Price>();
        for (const position of userPositions) {
          const priceResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prices/latest?productId=${position.productId}`);
          if (priceResponse.ok) {
            const price = await priceResponse.json();
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
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2">Welcome back, {user?.name}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Portfolio Value</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">${portfolioValue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Unrealized P&L</p>
                <p className={`text-2xl font-bold mt-2 ${unrealizedPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${unrealizedPL.toFixed(2)}
                </p>
              </div>
              {unrealizedPL >= 0 ? (
                <TrendingUp className="w-10 h-10 text-green-600 opacity-20" />
              ) : (
                <TrendingDown className="w-10 h-10 text-red-600 opacity-20" />
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Return %</p>
                <p className={`text-2xl font-bold mt-2 ${plPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {plPercentage.toFixed(2)}%
                </p>
              </div>
              <PieChart className="w-10 h-10 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Holdings */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Holdings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Quantity</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Current Price</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Value</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">P&L</th>
                </tr>
              </thead>
              <tbody>
                {positions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No holdings yet
                    </td>
                  </tr>
                ) : (
                  positions.map((position) => {
                    const product = products.get(position.productId);
                    const price = prices.get(position.productId);
                    const currentPrice = price?.price || position.purchasePrice;
                    const value = position.quantity * currentPrice;
                    const costBasis = position.quantity * position.purchasePrice;
                    const pl = value - costBasis;

                    return (
                      <tr key={position.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-slate-900">{product?.name}</p>
                            <p className="text-sm text-slate-500">{product?.symbol}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-900">{position.quantity}</td>
                        <td className="px-6 py-4 text-slate-900">${currentPrice.toFixed(2)}</td>
                        <td className="px-6 py-4 text-slate-900">${value.toFixed(2)}</td>
                        <td className={`px-6 py-4 font-medium ${pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${pl.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
