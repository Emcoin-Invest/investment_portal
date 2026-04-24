'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessRoute, isPublicRoute } from '@/lib/routeProtection';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return; // Wait for auth state to load

    // If route is public, allow access
    if (isPublicRoute(pathname)) {
      return;
    }

    // If not authenticated, redirect to login
    if (!user) {
      router.push('/login');
      return;
    }

    // Check if user has access to this route
    if (!canAccessRoute(pathname, user.role)) {
      router.push('/unauthorized');
      return;
    }
  }, [user, loading, pathname, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not on public route, don't render
  if (!user && !isPublicRoute(pathname)) {
    return null;
  }

  // If authenticated but no access, don't render
  if (user && !canAccessRoute(pathname, user.role)) {
    return null;
  }

  return <>{children}</>;
}
