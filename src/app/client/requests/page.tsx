'use client';

import { useEffect, useState } from 'react';
import { ClientLayout } from '@/components/ClientLayout';
import { Toast, ToastContainer, useToast } from '@/components/Toast';
import { useAuth } from '@/contexts/AuthContext';
import { getUserRequests, createRequest, getAllProducts } from '@/lib/api';
import type { InvestmentRequest, Product, RequestType } from '@/lib/types';
import { Plus, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { nanoid } from 'nanoid';

export default function ClientRequests() {
  const { user } = useAuth();
  const { toasts, addToast, removeToast, success, error: showError } = useToast();
  const [requests, setRequests] = useState<InvestmentRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    type: 'buy' as RequestType,
    productId: '',
    amount: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        setError(null);
        const userRequests = await getUserRequests(user.id);
        setRequests(userRequests);

        const allProducts = await getAllProducts();
        setProducts(allProducts);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load requests';
        setError(errorMsg);
        showError('Error', errorMsg);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, showError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSubmitting(true);
      setError(null);

      const requestId = nanoid();
      await createRequest(requestId, {
        userId: user.id,
        type: formData.type as RequestType,
        productId: formData.productId || undefined,
        amount: formData.amount ? parseFloat(formData.amount) : undefined,
        message: formData.message,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Show success toast
      success('Request Submitted', 'Your request has been submitted successfully and is pending review.');

      // Reset form and refresh requests
      setFormData({ type: 'buy', productId: '', amount: '', message: '' });
      setShowForm(false);

      const userRequests = await getUserRequests(user.id);
      setRequests(userRequests);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to submit request';
      setError(errorMsg);
      showError('Submission Failed', errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={18} className="text-yellow-600" />;
      case 'approved':
        return <CheckCircle size={18} className="text-green-600" />;
      case 'rejected':
        return <XCircle size={18} className="text-red-600" />;
      case 'executed':
        return <CheckCircle size={18} className="text-blue-600" />;
      default:
        return <AlertCircle size={18} className="text-slate-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      executed: 'bg-blue-100 text-blue-800',
    };
    return styles[status] || 'bg-slate-100 text-slate-800';
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading requests...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Service Requests</h1>
            <p className="text-slate-600 mt-2">Submit and track your investment requests</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus size={20} />
            New Request
          </button>
        </div>

        {/* Request Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-slideIn">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Submit a New Request</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Request Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-2">
                  Request Type
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as RequestType })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                  <option value="subscribe">Subscribe</option>
                  <option value="withdraw">Withdraw</option>
                </select>
              </div>

              {/* Product */}
              <div>
                <label htmlFor="product" className="block text-sm font-medium text-slate-700 mb-2">
                  Product (Optional)
                </label>
                <select
                  id="product"
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a product...</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-2">
                  Amount (Optional)
                </label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Describe your request..."
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-medium"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Requests List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Your Requests</h2>
          </div>
          {requests.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600">No requests yet.</p>
              <p className="text-sm text-slate-500 mt-2">Submit a new request to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {requests.map((request) => {
                const product = products.find((p) => p.id === request.productId);
                return (
                  <div key={request.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        {getStatusIcon(request.status)}
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {request.type.charAt(0).toUpperCase() + request.type.slice(1)} Request
                          </h3>
                          {product && <p className="text-sm text-slate-600">{product.name}</p>}
                          {request.amount && (
                            <p className="text-sm text-slate-600">
                              Amount: ${request.amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          request.status
                        )}`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-slate-700 mb-3">{request.message}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>
                        Created:{' '}
                        {new Date(request.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      {request.rejectionReason && (
                        <span className="text-red-600">Reason: {request.rejectionReason}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ClientLayout>
  );
}
