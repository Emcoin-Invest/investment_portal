import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import wsService, { RealtimeEvents } from '@/services/wsService';

export function useRealtime<T = unknown>(event: string, callback: (data: T) => void, enabled = true) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!enabled || !isAuthenticated) return;

    // Auto-connect if not connected
    if (!wsService.isConnected()) {
      const token = localStorage.getItem('token');
      if (token) {
        wsService.connect(token).catch((error) => {
          console.error('Failed to connect WebSocket:', error);
        });
      }
    }

    // Subscribe to event
    const unsubscribe = wsService.subscribe<T>(event, callback);

    return () => {
      unsubscribe();
    };
  }, [event, callback, enabled, isAuthenticated]);
}

// Specific realtime hooks
export function usePortfolioUpdates(callback: (data: unknown) => void) {
  useRealtime(RealtimeEvents.PORTFOLIO_UPDATED, callback);
}

export function usePriceUpdates(callback: (data: unknown) => void) {
  useRealtime(RealtimeEvents.PRICE_UPDATE, callback);
}

export function useNotificationUpdates(callback: (data: unknown) => void) {
  useRealtime(RealtimeEvents.NOTIFICATION_NEW, callback);
}

export function useRequestStatusUpdates(callback: (data: unknown) => void) {
  useRealtime(RealtimeEvents.REQUEST_STATUS_CHANGED, callback);
}
