import apiClient, { formatApiError } from '../client';
import { AuthRequest, AuthResponse, RegisterRequest, User } from '@/types';

export const authService = {
  async login(credentials: AuthRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async refresh(): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/refresh');
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/api/auth/me');
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      throw formatApiError(error);
    }
  },
};

export default authService;
