// ========== AUTH TYPES ==========
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'client';
  createdAt?: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterRequest extends AuthRequest {
  name: string;
}

// ========== PORTFOLIO TYPES ==========
export interface PortfolioPosition {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  purchasePrice: number;
  currentPrice?: number;
  value?: number;
  percentageChange?: number;
  createdAt?: string;
}

export interface Portfolio {
  positions: PortfolioPosition[];
  totalValue: number;
  totalCost: number;
  totalGain: number;
  percentageGain: number;
}

// ========== PRODUCT TYPES ==========
export interface Product {
  id: number;
  name: string;
  symbol: string;
  type: 'stock' | 'crypto' | 'commodity' | 'fund';
  currentPrice: number;
  dayChange: number;
  dayChangePercent: number;
  marketCap?: number;
  description?: string;
  updatedAt?: string;
}

// ========== STATEMENT TYPES ==========
export interface Statement {
  id: number;
  userId: number;
  type: 'transaction' | 'dividend' | 'fee' | 'interest';
  amount: number;
  description: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
}

// ========== REQUEST TYPES ==========
export interface ClientRequest {
  id: number;
  userId: number;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt?: string;
  assignedTo?: number;
}

// ========== NOTIFICATION TYPES ==========
export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
  action?: {
    label: string;
    href: string;
  };
}

// ========== MARKET TYPES ==========
export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high?: number;
  low?: number;
  volume?: number;
  timestamp: string;
}

// ========== ADMIN TYPES ==========
export interface AdminStats {
  totalUsers: number;
  totalAssets: number;
  totalTransactions: number;
  totalRevenue: number;
  activeUsers: number;
  pendingRequests: number;
}

export interface SystemMetrics {
  uptime: number;
  requestsPerSecond: number;
  errorRate: number;
  avgResponseTime: number;
}

// ========== API RESPONSE TYPES ==========
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
  hasMore: boolean;
}

// ========== ERROR TYPES ==========
export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

// ========== UI COMPONENT TYPES ==========
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  format?: (value: unknown) => React.ReactNode;
  width?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
}

// ========== STATE TYPES ==========
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
