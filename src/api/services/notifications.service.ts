import apiClient, { formatApiError } from '../client';
import { Notification, PaginatedResponse } from '@/types';

export const notificationService = {
  async getUserNotifications(
    userId: string,
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<Notification>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Notification>>('/api/notifications', {
        params: { userId, page, pageSize },
      });
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const response = await apiClient.get<{ count: number }>('/api/notifications/unread-count', {
        params: { userId },
      });
      return response.data.count;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async markAsRead(notificationId: number): Promise<Notification> {
    try {
      const response = await apiClient.patch<Notification>(`/api/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async markAllAsRead(userId: string): Promise<void> {
    try {
      await apiClient.patch('/api/notifications/read-all', { userId });
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async deleteNotification(notificationId: number): Promise<void> {
    try {
      await apiClient.delete(`/api/notifications/${notificationId}`);
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async deleteAllNotifications(userId: string): Promise<void> {
    try {
      await apiClient.delete('/api/notifications', { params: { userId } });
    } catch (error) {
      throw formatApiError(error);
    }
  },
};

export default notificationService;
