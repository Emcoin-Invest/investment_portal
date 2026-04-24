'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Modal } from '@/components/Modal';
import { useAuth } from '@/contexts/AuthContext';
import { getAllRequests, getUser, getProduct, updateRequest } from '@/lib/firestore';
import type { InvestmentRequest, User, Product } from '@/lib/types';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function AdminRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<InvestmentRequest[]>([]);
  const [users, setUsers] = useState<Map<string, User>>(new Map());
  const [products, setProducts] = useState<Map<string, Product>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<InvestmentRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const allRequests = await getAllRequests();
        setRequests(allRequests);

        // Load user and product data for each request
        const usersMap = new Map<string, User>();
        const productsMap = new Map<string, Product>();

        for (const request of allRequests) {
          if (!usersMap.has(request.userId)) {
            const userData = await getUser(request.userId);
            if (userData) usersMap.set(request.userId, userData);
          }
          if (request.productId && !productsMap.has(request.productId)) {
            const productData = await getProduct(request.productId);
            if (productData) productsMap.set(request.productId, productData);
          }
        }

        setUsers(usersMap);
        setProducts(productsMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load requests');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleApprove = async (requestId: string) => {
    try {
      await updateRequest(requestId, {
        status: 'approved',
        updatedAt: new Date(),
      });

      // Refresh requests
      const allRequests = await getAllRequests();
      setRequests(allRequests);
      setSelectedRequest(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve request');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await updateRequest(requestId, {
        status: 'rejected',
        rejectionReason: rejectionReason,
        updatedAt: new Date(),
      });

      // Refresh requests
      const allRequests = await getAllRequests();
      setRequests(allRequests);
      setSelectedRequest(null);
      setRejectionReason('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject request');
    }
  };

  const handleExecute = async (requestId: string) => {
    try {
      await updateRequest(requestId, {
        status: 'executed',
        updatedAt: new Date(),
      });

      // Refresh requests
      const allRequests = await getAllRequests();
      setRequests(allRequests);
      setSelectedRequest(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute request');
    }
  };

  const filteredRequests =
    filterStatus === 'all' ? requests : requests.filter((r) => r.status === filterStatus);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading requests...</p>
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
          <h1 className="text-3xl font-bold text-slate-900">Requests</h1>
          <p className="text-slate-600 mt-2">Review and manage client service requests</p>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected', 'executed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Requests List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-600">No requests found.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredRequests.map((request) => {
                const requestUser = users.get(request.userId);
                const product = request.productId ? products.get(request.productId) : null;

                return (
                  <div key={request.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        {request.status === 'pending' && (
                          <Clock size={24} className="text-yellow-600 flex-shrink-0 mt-1" />
                        )}
                        {request.status === 'approved' && (
                          <CheckCircle size={24} className="text-green-600 flex-shrink-0 mt-1" />
                        )}
                        {request.status === 'rejected' && (
                          <XCircle size={24} className="text-red-600 flex-shrink-0 mt-1" />
                        )}
                        {request.status === 'executed' && (
                          <CheckCircle size={24} className="text-blue-600 flex-shrink-0 mt-1" />
                        )}
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {request.type.charAt(0).toUpperCase() + request.type.slice(1)} Request
                          </h3>
                          <p className="text-sm text-slate-600">
                            From: {requestUser?.name} ({requestUser?.email})
                          </p>
                          {product && <p className="text-sm text-slate-600">Product: {product.name}</p>}
                          {request.amount && (
                            <p className="text-sm text-slate-600">
                              Amount: ${request.amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          request.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : request.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>

                    <p className="text-slate-700 mb-4">{request.message}</p>

                    {request.rejectionReason && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                        <p className="text-sm text-red-700">
                          <strong>Rejection Reason:</strong> {request.rejectionReason}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500">
                        {new Date(request.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>

                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {request.status === 'approved' && (
                        <button
                          onClick={() => handleExecute(request.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Mark as Executed
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Rejection Modal */}
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => {
            setSelectedRequest(null);
            setRejectionReason('');
          }}
          title="Reject Request"
          footer={
            <div className="flex gap-3">
              <button
                onClick={() => selectedRequest && handleReject(selectedRequest.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          }
        >
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Enter rejection reason..."
          />
        </Modal>
      </div>
    </AdminLayout>
  );
}
