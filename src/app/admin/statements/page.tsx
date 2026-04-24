'use client';

import { AdminLayout } from '@/components/AdminLayout';

export default function AdminStatements() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Statements</h1>
          <p className="text-slate-600 mt-2">Upload and manage client statements</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <p className="text-slate-600">Statement management interface coming soon.</p>
        </div>
      </div>
    </AdminLayout>
  );
}
