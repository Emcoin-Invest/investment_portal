import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  authService,
  portfolioService,
  statementService,
  requestService,
  adminService,
  productService,
  notificationService,
} from '@/api/services';
import { User, Portfolio, Statement, ClientRequest, Product, Notification, PortfolioPosition } from '@/types';

// ========== QUERY KEYS ==========
export const queryKeys = {
  auth: ['auth'],
  portfolio: ['portfolio'],
  statements: ['statements'],
  requests: ['requests'],
  admin: ['admin'],
  products: ['products'],
  notifications: ['notifications'],
  market: ['market'],
};

export const useApi = () => ({
  queryKeys,
});

// ========== AUTH HOOKS ==========
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth,
    queryFn: () => authService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth, data.user);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth, data.user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

// ========== PORTFOLIO HOOKS ==========
export const usePortfolio = (userId: string | undefined) => {
  return useQuery({
    queryKey: [...queryKeys.portfolio, userId],
    queryFn: () => portfolioService.getUserPortfolio(userId!),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const usePortfolioPositions = (userId: string | undefined) => {
  return useQuery({
    queryKey: [...queryKeys.portfolio, 'positions', userId],
    queryFn: () => portfolioService.getPortfolioPositions(userId!),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000,
  });
};

export const useAddPosition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: portfolioService.addPosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolio });
    },
  });
};

export const useUpdatePosition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ positionId, updates }: { positionId: number; updates: Partial<PortfolioPosition> }) =>
      portfolioService.updatePosition(positionId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolio });
    },
  });
};

export const useRemovePosition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: portfolioService.removePosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolio });
    },
  });
};

// ========== STATEMENTS HOOKS ==========
export const useStatements = (userId: string | undefined, page = 1) => {
  return useQuery({
    queryKey: [...queryKeys.statements, userId, page],
    queryFn: () => statementService.getUserStatements(userId!, page),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

// ========== REQUESTS HOOKS ==========
export const useUserRequests = (userId: string | undefined, page = 1) => {
  return useQuery({
    queryKey: [...queryKeys.requests, userId, page],
    queryFn: () => requestService.getUserRequests(userId!, page),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useAllRequests = (page = 1) => {
  return useQuery({
    queryKey: [...queryKeys.requests, 'all', page],
    queryFn: () => requestService.getAllRequests(page),
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestService.createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests });
    },
  });
};

export const useUpdateRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, updates }: { requestId: number; updates: Partial<ClientRequest> }) =>
      requestService.updateRequest(requestId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests });
    },
  });
};

// ========== PRODUCTS HOOKS ==========
export const useProducts = () => {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: productService.getAllProducts,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProduct = (productId: number | undefined) => {
  return useQuery({
    queryKey: [...queryKeys.products, productId],
    queryFn: () => productService.getProduct(productId!),
    enabled: !!productId,
    staleTime: 1 * 60 * 1000,
  });
};

// ========== NOTIFICATIONS HOOKS ==========
export const useNotifications = (userId: string | undefined, page = 1) => {
  return useQuery({
    queryKey: [...queryKeys.notifications, userId, page],
    queryFn: () => notificationService.getUserNotifications(userId!, page),
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useUnreadNotificationCount = (userId: string | undefined) => {
  return useQuery({
    queryKey: [...queryKeys.notifications, 'unread', userId],
    queryFn: () => notificationService.getUnreadCount(userId!),
    enabled: !!userId,
    staleTime: 10 * 1000,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
};

// ========== ADMIN HOOKS ==========
export const useAdminStats = () => {
  return useQuery({
    queryKey: [...queryKeys.admin, 'stats'],
    queryFn: adminService.getStats,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAllUsers = (page = 1) => {
  return useQuery({
    queryKey: [...queryKeys.admin, 'users', page],
    queryFn: () => adminService.getAllUsers(page),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, updates }: { userId: number; updates: Partial<User> }) =>
      adminService.updateUser(userId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.admin, 'users'] });
    },
  });
};
