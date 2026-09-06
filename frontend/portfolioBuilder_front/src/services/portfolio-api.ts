import axios from 'axios';
import { apiClient } from '../lib/api-client';
import type { ApiResponse } from '../types/auth';
import type { Portfolio } from '../types/portfolio';

export const portfolioApi = {
  async getPortfolio(): Promise<Portfolio | null> {
    try {
      const response = await apiClient.instance.get<ApiResponse<Portfolio>>('/portfolio');
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
};
