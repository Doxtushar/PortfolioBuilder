import axios from 'axios';
import { apiClient } from '../lib/api-client.js';
import type { ApiResponse } from '../types/auth.js';
import type { Portfolio } from '../types/portfolio.js';

export type PortfolioInput = {
  username: string;
  title: string;
  bio: string | null;
  fullName?: string;
  headline?: string;
  location?: string;
  introduction?: string;
  profileImageUrl?: string;
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
    const data = response.data.data;
    if (!data) {
      throw new Error('Failed to create portfolio: No data returned');
    }
    return data;
  },

  async updatePortfolio(input: PortfolioInput): Promise<Portfolio> {
    const response = await apiClient.instance.put<ApiResponse<Portfolio>>('/portfolio', input);
    const data = response.data.data;
    if (!data) {
      throw new Error('Failed to update portfolio: No data returned');
    }
    return data;
  },
};
