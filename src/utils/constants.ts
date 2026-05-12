// Application Constants

export const APP_NAME = 'Investment Portal';
export const APP_DESCRIPTION = 'Secure investment client portal and admin backoffice';

// API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  PORTFOLIO: '/api/portfolio',
  POSITIONS: '/api/portfolio/positions',
  STATEMENTS: '/api/statements',
  REQUESTS: '/api/requests',
  PRODUCTS: '/api/products',
  ADMIN: '/api/admin',
  NOTIFICATIONS: '/api/notifications',
} as const;

// Routes
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  CLIENT_DASHBOARD: '/client/dashboard',
  CLIENT_PORTFOLIO: '/client/portfolio',
  CLIENT_STATEMENTS: '/client/statements',
  CLIENT_REQUESTS: '/client/requests',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_REQUESTS: '/admin/requests',
} as const;

// Request Statuses
export const REQUEST_STATUSES = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
} as const;

// Request Priorities
export const REQUEST_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

// Product Types
export const PRODUCT_TYPES = {
  STOCK: 'stock',
  CRYPTO: 'crypto',
  COMMODITY: 'commodity',
  FUND: 'fund',
} as const;

// User Roles
export const USER_ROLES = {
  CLIENT: 'client',
  ADMIN: 'admin',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  ADMIN_PAGE_SIZE: 50,
} as const;

// Cache Duration (in milliseconds)
export const CACHE_DURATION = {
  SHORT: 1 * 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 30 * 60 * 1000, // 30 minutes
} as const;
