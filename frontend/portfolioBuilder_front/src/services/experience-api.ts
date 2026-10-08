import axios from 'axios';
import { apiClient } from '../lib/api-client.js';
import type { ApiResponse } from '../types/auth.js';
import type { CreateExperienceInput, Experience, UpdateExperienceInput } from '../types/experience.js';

export const experienceApi = {
  async getExperiences(): Promise<Experience[]> {
    const response = await apiClient.instance.get<ApiResponse<Experience[]>>('/portfolio/experiences');
    return response.data.data || [];
  },

  async createExperience(input: CreateExperienceInput): Promise<Experience> {
    const response = await apiClient.instance.post<ApiResponse<Experience>>('/portfolio/experiences', input);
    const data = response.data.data;
    if (!data) {
      throw new Error('Failed to create experience: No data returned');
    }
    return data;
  },

  async updateExperience(id: string, input: UpdateExperienceInput): Promise<Experience> {
    const response = await apiClient.instance.put<ApiResponse<Experience>>(`/portfolio/experiences/${id}`, input);
    const data = response.data.data;
    if (!data) {
      throw new Error('Failed to update experience: No data returned');
    }
    return data;
  },

  async deleteExperience(id: string): Promise<void> {
    await apiClient.instance.delete<ApiResponse<null>>(`/portfolio/experiences/${id}`);
  },
};
