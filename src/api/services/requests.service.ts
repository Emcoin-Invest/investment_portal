import apiClient, { formatApiError } from '../client';
import { ClientRequest, PaginatedResponse } from '@/types';

export const requestService = {
  async getUserRequests(userId: string, page = 1, pageSize = 20): Promise<PaginatedResponse<ClientRequest>> {
    try {
      const response = await apiClient.get<PaginatedResponse<ClientRequest>>('/api/requests', {
        params: { userId, page, pageSize },
      });
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async getAllRequests(page = 1, pageSize = 50): Promise<PaginatedResponse<ClientRequest>> {
    try {
      const response = await apiClient.get<PaginatedResponse<ClientRequest>>('/api/requests/all', {
        params: { page, pageSize },
      });
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async getRequest(requestId: number): Promise<ClientRequest> {
    try {
      const response = await apiClient.get<ClientRequest>(`/api/requests/${requestId}`);
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async createRequest(data: Omit<ClientRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ClientRequest> {
    try {
      const response = await apiClient.post<ClientRequest>('/api/requests', data);
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async updateRequest(requestId: number, updates: Partial<ClientRequest>): Promise<ClientRequest> {
    try {
      const response = await apiClient.put<ClientRequest>(`/api/requests/${requestId}`, updates);
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async updateRequestStatus(
    requestId: number,
    status: ClientRequest['status']
  ): Promise<ClientRequest> {
    try {
      const response = await apiClient.patch<ClientRequest>(`/api/requests/${requestId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async deleteRequest(requestId: number): Promise<void> {
    try {
      await apiClient.delete(`/api/requests/${requestId}`);
    } catch (error) {
      throw formatApiError(error);
    }
  },
};

export default requestService;
