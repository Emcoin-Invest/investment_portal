import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle token refresh on 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const refreshResponse = await axios.post(`${API_URL}/api/auth/refresh`, {
          token: localStorage.getItem('token'),
        });

        const { token } = refreshResponse.data;
        localStorage.setItem('token', token);

        // Retry original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Error formatter
export const formatApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.response?.data?.message || error.message || 'An error occurred',
      statusCode: error.response?.status || 500,
      details: error.response?.data,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: error instanceof Error ? error.message : 'An unknown error occurred',
    statusCode: 500,
  };
};

export default apiClient;
