// User types
export type UserRole = 'client' | 'admin';
export type UserStatus = 'active' | 'suspended';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  profileFields?: Record<string, unknown>;
}

// Product types
export type ProductType = 'stock' | 'crypto' | 'fund' | 'sukuk' | 'private';
export type PricingMode = 'api' | 'manual';

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  pricingMode: PricingMode;
  currency: string;
  isActive: boolean;
  createdAt: Date;
}

// Portfolio position types
export interface PortfolioPosition {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  avgPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

// Price types
export interface Price {
  id: string;
  productId: string;
  price: number;
  source: 'manual' | 'api';
  updatedAt: Date;
}

// Request types
export type RequestType = 'buy' | 'sell' | 'subscribe' | 'withdraw';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'executed';

export interface InvestmentRequest {
  id: string;
  userId: string;
  type: RequestType;
  productId?: string;
  amount?: number;
  message: string;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
  rejectionReason?: string;
}

// Statement types
export interface Statement {
  id: string;
  userId: string;
  period: string;
  fileUrl: string;
  filePath: string;
  createdAt: Date;
}

// Notification types
export type NotificationType = 'request_submitted' | 'request_approved' | 'request_rejected' | 'request_executed';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  relatedRequestId?: string;
}

// Audit log types
export interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: Record<string, unknown>;
  createdAt: Date;
}

// Price history types
export interface PriceHistory {
  id: string;
  productId: string;
  price: number;
  source: 'manual' | 'api';
  createdAt: Date;
}
