'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user && !loading) {
      const redirectPath =
        user.role === 'admin'
          ? '/admin/dashboard'
          : '/client/dashboard';

      router.push(redirectPath);
    }
  }, [isAuthenticated, user, loading, router]);

  if (!isAuthenticated || loading) {
    return null; // أو loading UI
  }

  return null;
}