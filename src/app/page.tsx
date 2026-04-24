'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDefaultRedirectPath } from '@/lib/routeProtection';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (user) {
      // Redirect to appropriate dashboard based on role
      router.push(getDefaultRedirectPath(user.role));
    } else {
      // Redirect to login
      router.push('/login');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Redirecting...</p>
      </div>
    </div>
  );
}
