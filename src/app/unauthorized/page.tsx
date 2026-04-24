'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl font-bold text-slate-900 mb-4">403</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
        <p className="text-slate-600 mb-8">
          You do not have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-slate-200 text-slate-900 font-medium rounded-lg hover:bg-slate-300 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
