import { UserRole } from './types';

export const ROUTE_CONFIG = {
  // Public routes
  public: ['/login', '/signup', '/forgot-password'],

  // Client routes
  client: ['/client/dashboard', '/client/portfolio', '/client/statements', '/client/requests', '/client/notifications', '/client/profile'],

  // Admin routes
  admin: [
    '/admin/dashboard',
    '/admin/clients',
    '/admin/products',
    '/admin/portfolios',
    '/admin/pricing',
    '/admin/requests',
    '/admin/statements',
    '/admin/notifications',
    '/admin/profile',
  ],
};

export function isPublicRoute(pathname: string): boolean {
  return ROUTE_CONFIG.public.some((route) => pathname === route || pathname.startsWith(route + '/'));
}

export function isClientRoute(pathname: string): boolean {
  return ROUTE_CONFIG.client.some((route) => pathname === route || pathname.startsWith(route + '/'));
}

export function isAdminRoute(pathname: string): boolean {
  return ROUTE_CONFIG.admin.some((route) => pathname === route || pathname.startsWith(route + '/'));
}

export function getDefaultRedirectPath(role: UserRole): string {
  return role === 'admin' ? '/admin/dashboard' : '/client/dashboard';
}

export function canAccessRoute(pathname: string, role: UserRole | null): boolean {
  if (isPublicRoute(pathname)) {
    return true;
  }

  if (!role) {
    return false;
  }

  if (role === 'admin') {
    return isAdminRoute(pathname);
  }

  if (role === 'client') {
    return isClientRoute(pathname);
  }

  return false;
}
