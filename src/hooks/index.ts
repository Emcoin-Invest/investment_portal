// Hooks exports

export { useApi, useCurrentUser, useLogin, useRegister, useLogout } from './useApi';
export { usePortfolio, usePortfolioPositions, useAddPosition, useUpdatePosition, useRemovePosition } from './useApi';
export { useStatements, useUserRequests, useAllRequests, useCreateRequest, useUpdateRequest } from './useApi';
export { useProducts, useProduct } from './useApi';
export { useNotifications, useUnreadNotificationCount, useMarkNotificationAsRead } from './useApi';
export { useAdminStats, useAllUsers, useUpdateUser } from './useApi';

export { useRealtime, usePortfolioUpdates, usePriceUpdates, useNotificationUpdates, useRequestStatusUpdates } from './useRealtime';

// hooks/index.ts
