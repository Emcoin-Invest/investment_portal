'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getAllUsers, updateUser, createUser } from '@/lib/api';
import type { User } from '@/lib/types';
import { Plus, Edit2, X, Check } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Badge } from '@/components/PremiumTable';
import { EmptyState, ErrorState, InfoMessage } from '@/components/StateMessages';
import { ShimmerTable } from '@/components/LoadingShimmer';

export default function AdminClients() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: 'active' as 'active' | 'suspended',
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const allUsers = await getAllUsers();
        setUsers(allUsers.filter((u) => u.role === 'client'));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load clients');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing user
        await updateUser(editingId, {
          name: formData.name,
          email: formData.email,
          status: formData.status,
          updatedAt: new Date(),
        });
      } else {
        // Create new user
        const userId = nanoid();
        await createUser(userId, {
          email: formData.email,
          name: formData.name,
          role: 'client',
          status: formData.status,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // Refresh users list
      const allUsers = await getAllUsers();
      setUsers(allUsers.filter((u) => u.role === 'client'));

      // Reset form
      setFormData({ name: '', email: '', status: 'active' });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save client');
    }
  };

  const handleEdit = (client: User) => {
    setFormData({
      name: client.name,
      email: client.email,
      status: client.status,
    });
    setEditingId(client.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({ name: '', email: '', status: 'active' });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="heading-lg text-slate-900">Clients</h1>
              <p className="text-slate-600 mt-2">Manage client accounts and portfolios</p>
            </div>
          </div>
          <ShimmerTable />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fadeIn">
        {/* Header with CTA */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading-lg text-slate-900">Clients</h1>
            <p className="text-slate-600 mt-2">Manage client accounts and investment portfolios</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary gap-2 shadow-lg hover:shadow-blue-500/30"
          >
            <Plus size={20} />
            Add New Client
          </button>
        </div>

        {/* Success/Info Messages */}
        {editingId ===  null && !showForm  && (
          <InfoMessage
            type="info"
            title="Client Management"
            message="Add, edit, and manage client accounts. Clients can access their portfolios and statements."
          />
        )}

        {/* Form - Enhanced Design */}
        {showForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 animate-slideInUp">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="heading-md text-slate-900">
                  {editingId ? 'Edit Client' : 'Create New Client'}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {editingId ? 'Update client information' : 'Add a new client to the platform'}
                </p>
              </div>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-slate-700 mb-2">
                  Account Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'suspended' })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <Check size={18} />
                  {editingId ? 'Update Client' : 'Create Client'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Error message */}
        {error && (
          <ErrorState message={error} title="Error Loading Clients" retry={() => window.location.reload()} />
        )}

        {/* Clients Table - Premium Design */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-elevated transition-all duration-300">
          {users.length === 0 ? (
            <EmptyState
              title="No Clients Yet"
              description="Get started by adding your first client to the platform"
              action={{ label: 'Add Client', onClick: () => setShowForm(true) }}
            />
          ) : (
            <div>
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                <h2 className="heading-sm text-slate-900">All Clients ({users.length})</h2>
              </div>
              <div className="overflow-x-auto animate-slideInUp">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Joined</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((client, idx) => (
                      <tr
                        key={client.id}
                        className="hover:bg-slate-50/50 transition-colors duration-200 group animate-fadeIn"
                        style={{ animationDelay: `${idx * 25}ms` }}
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {client.name}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{client.email}</td>
                        <td className="px-6 py-4">
                          <Badge
                            label={client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                            variant={client.status === 'active' ? 'success' : 'danger'}
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(client.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={() => handleEdit(client)}
                              className="p-2.5 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 group/btn"
                              title="Edit Client"
                            >
                              <Edit2 size={18} className="text-slate-400 group-hover/btn:text-blue-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
