'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && user) {
        const redirectPath =
          user.role === 'admin'
            ? '/admin/dashboard'
            : '/client/dashboard';
        router.push(redirectPath);
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, user, loading, router]);

  // Show a simple loading state instead of a blank screen
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-400">Loading Investment Portal...</p>
    </div>
  );
}
