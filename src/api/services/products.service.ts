import apiClient, { formatApiError } from '../client';
import { Product, MarketData } from '@/types';

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await apiClient.get<Product[]>('/api/products');
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async getProduct(productId: number): Promise<Product> {
    try {
      const response = await apiClient.get<Product>(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async getProductsByType(type: Product['type']): Promise<Product[]> {
    try {
      const response = await apiClient.get<Product[]>('/api/products', {
        params: { type },
      });
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await apiClient.get<Product[]>('/api/products/search', {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async getMarketData(symbol: string): Promise<MarketData> {
    try {
      const response = await apiClient.get<MarketData>(`/api/market/${symbol}`);
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async getLatestPrice(productId: number): Promise<number | null> {
    try {
      const response = await apiClient.get<{ price: number }>('/api/prices/latest', {
        params: { productId },
      });
      return response.data.price;
    } catch (error) {
      return null;
    }
  },
};

export default productService;
