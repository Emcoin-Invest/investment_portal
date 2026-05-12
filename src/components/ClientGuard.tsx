'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingShimmer } from './LoadingShimmer';

interface ClientGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ClientGuard component ensures that only users with client role can access protected content.
 * - Redirects non-authenticated users to /login
 * - Redirects non-client users to /unauthorized
 * - Shows loading state during auth check
 */
export function ClientGuard({ children, fallback }: ClientGuardProps) {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    // Skip redirect logic during server-side rendering
    if (typeof window === 'undefined') return;

    // If still loading, show spinner
    if (loading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    // Redirect to unauthorized if not client
    if (user.role !== 'client') {
      router.push('/unauthorized');
      return;
    }
  }, [user, loading, isAuthenticated, router]);

  // Show loading state
  if (loading) {
    return fallback || <LoadingShimmer />;
  }

  // Show unauthorized state
  if (!isAuthenticated || !user || user.role !== 'client') {
    return null;
  }

  return <>{children}</>;
}

export default ClientGuard;
