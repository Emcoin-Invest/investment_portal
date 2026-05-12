import apiClient, { formatApiError } from '../client';
import { Statement, PaginatedResponse } from '@/types';

export const statementService = {
  async getUserStatements(userId: string, page = 1, pageSize = 20): Promise<PaginatedResponse<Statement>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Statement>>('/api/statements', {
        params: { userId, page, pageSize },
      });
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async getStatement(statementId: number): Promise<Statement> {
    try {
      const response = await apiClient.get<Statement>(`/api/statements/${statementId}`);
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  async downloadStatements(userId: string, format: 'pdf' | 'csv' = 'pdf'): Promise<Blob> {
    try {
      const response = await apiClient.get(`/api/statements/download`, {
        params: { userId, format },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },
};

export default statementService;
