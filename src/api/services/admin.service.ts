import apiClient, { formatApiError } from '../client';
import { AdminStats, SystemMetrics, User, Product, PaginatedResponse } from '@/types';

export const adminService = {
  // Stats
  async getStats(): Promise<AdminStats> {
    try {
      const response = await apiClient.get<AdminStats>('/api/admin/stats');
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async getSystemMetrics(): Promise<SystemMetrics> {
    try {
      const response = await apiClient.get<SystemMetrics>('/api/admin/metrics');
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  // Users
  async getAllUsers(page = 1, pageSize = 50): Promise<PaginatedResponse<User>> {
    try {
      const response = await apiClient.get<PaginatedResponse<User>>('/api/admin/users', {
        params: { page, pageSize },
      });
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async getUser(userId: number): Promise<User> {
    try {
      const response = await apiClient.get<User>(`/api/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async updateUser(userId: number, updates: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<User>(`/api/admin/users/${userId}`, updates);
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  // Products
  async getAllProducts(page = 1, pageSize = 100): Promise<PaginatedResponse<Product>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Product>>('/api/products', {
        params: { page, pageSize },
      });
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async createProduct(data: Omit<Product, 'id'>): Promise<Product> {
    try {
      const response = await apiClient.post<Product>('/api/admin/products', data);
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async updateProduct(productId: number, updates: Partial<Product>): Promise<Product> {
    try {
      const response = await apiClient.put<Product>(`/api/admin/products/${productId}`, updates);
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async deleteProduct(productId: number): Promise<void> {
    try {
      await apiClient.delete(`/api/admin/products/${productId}`);
    } catch (error) {
      throw formatApiError(error);
    }
  },
};

export default adminService;
