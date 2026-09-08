import axios from 'axios';
import { apiClient } from '../lib/api-client';
import type { ApiResponse } from '../types/auth';
import type { Portfolio } from '../types/portfolio';

export type PortfolioInput = {
  username: string;
  title: string;
  bio: string | null;
};

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

  async createPortfolio(input: PortfolioInput): Promise<Portfolio> {
    const response = await apiClient.instance.post<ApiResponse<Portfolio>>('/portfolio', input);
    return response.data.data;
  },

  async updatePortfolio(input: PortfolioInput): Promise<Portfolio> {
    const response = await apiClient.instance.put<ApiResponse<Portfolio>>('/portfolio', input);
    return response.data.data;
  },
};
