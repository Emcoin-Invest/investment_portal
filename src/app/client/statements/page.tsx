'use client';

import { useEffect, useState } from 'react';
import { ClientLayout } from '@/components/ClientLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getUserStatements } from '@/lib/api';
import type { Statement } from '@/lib/types';
import { Download, FileText } from 'lucide-react';

export default function ClientStatements() {
  const { user } = useAuth();
  const [statements, setStatements] = useState<Statement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStatements = async () => {
      if (!user) return;
      try {
        setLoading(true);
        setError(null);
        const userStatements = await getUserStatements(user.id);
        setStatements(userStatements);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load statements');
      } finally {
        setLoading(false);
      }
    };

    loadStatements();
  }, [user]);

  const handleDownload = (statement: Statement) => {
    // In a real app, this would download the file from Firebase Storage
    const link = document.createElement('a');
    link.href = statement.fileUrl;
    link.download = `statement-${statement.period}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading statements...</p>
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
          <h1 className="text-3xl font-bold text-slate-900">Statements</h1>
          <p className="text-slate-600 mt-2">Download your account statements</p>
        </div>

        {/* Statements List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {statements.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600">No statements available yet.</p>
              <p className="text-sm text-slate-500 mt-2">Your statements will appear here as they are generated.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Period</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Created Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">File</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {statements.map((statement) => (
                    <tr key={statement.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{statement.period}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(statement.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-slate-400" />
                          <span>PDF Statement</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDownload(statement)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <Download size={16} />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
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
