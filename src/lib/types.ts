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

export interface UserWithPassword extends Omit<User, 'profileFields'> {
  password?: string;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

// Product types
export type ProductType = 'stock' | 'crypto' | 'fund' | 'sukuk' | 'private';
export type PricingMode = 'api' | 'manual';

export interface ProductBase {
  name: string;
  type: ProductType;
  pricingMode: PricingMode;
  currency: string;
  isActive: boolean;
}

export interface Product extends ProductBase {
  id: string;
  createdAt: Date;
}

// Portfolio position types
export interface PortfolioPositionBase {
  userId: string;
  productId: string;
  quantity: number;
  avgPrice: number;
}

export interface PortfolioPosition extends PortfolioPositionBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Portfolio {
  id: string;
  userId: string;
  positions: PortfolioPosition[];
  totalValue: number;
  totalCost: number;
  totalGain: number;
  percentageGain: number;
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

export interface PriceHistoryEntry {
  id: string;
  productId: string;
  price: number;
  source: 'manual' | 'api';
  createdAt: Date;
}

// Request types
export type RequestType = 'buy' | 'sell' | 'subscribe' | 'withdraw';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'executed';

export interface InvestmentRequestBase {
  userId: string;
  type: RequestType;
  productId?: string;
  amount?: number;
  message: string;
  status: RequestStatus;
}

export interface InvestmentRequest extends InvestmentRequestBase {
  id: string;
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

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Error types
export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export type ClientRequest = InvestmentRequest;

// Route configuration types
export interface RouteConfig {
  path: string;
  public: boolean;
  requiredRole?: UserRole;
  description: string;
}
