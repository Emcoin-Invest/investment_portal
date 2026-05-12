import apiClient, { formatApiError } from '../client';
import { Portfolio, PortfolioPosition, Product } from '@/types';

export const portfolioService = {
  async getUserPortfolio(userId: string): Promise<Portfolio> {
    try {
      const response = await apiClient.get<Portfolio>(`/api/portfolio?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async getPortfolioPositions(userId: string): Promise<PortfolioPosition[]> {
    try {
      const response = await apiClient.get<PortfolioPosition[]>(`/api/portfolio/positions?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async addPosition(position: Omit<PortfolioPosition, 'id' | 'createdAt'>): Promise<PortfolioPosition> {
    try {
      const response = await apiClient.post<PortfolioPosition>('/api/portfolio/positions', position);
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async updatePosition(
    positionId: number,
    updates: Partial<PortfolioPosition>
  ): Promise<PortfolioPosition> {
    try {
      const response = await apiClient.put<PortfolioPosition>(
        `/api/portfolio/positions/${positionId}`,
        updates
      );
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async removePosition(positionId: number): Promise<void> {
    try {
      await apiClient.delete(`/api/portfolio/positions/${positionId}`);
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async getLatestPrices(productIds: number[]): Promise<Record<number, number>> {
    try {
      const response = await apiClient.get<Record<number, number>>('/api/prices/latest', {
        params: { productIds: productIds.join(',') },
      });
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },
};

export default portfolioService;
