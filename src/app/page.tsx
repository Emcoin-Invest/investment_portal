'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoginPage from './login/page';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user && !loading) {
      const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/client/dashboard';
      router.push(redirectPath);
    }
  }, [isAuthenticated, user, loading, router]);

  // Show login page if not authenticated
  if (!isAuthenticated || loading) {
    return <LoginPage />;
  }

  // This shouldn't be reached due to redirect above
  return null;
}
