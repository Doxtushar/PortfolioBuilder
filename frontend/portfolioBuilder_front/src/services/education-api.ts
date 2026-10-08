import axios from 'axios';
import { apiClient } from '../lib/api-client.js';
import type { ApiResponse } from '../types/auth.js';
import type { CreateEducationInput, Education, UpdateEducationInput } from '../types/education.js';

export const educationApi = {
  async getEducation(): Promise<Education[]> {
    const response = await apiClient.instance.get<ApiResponse<Education[]>>('/portfolio/education');
    return response.data.data || [];
  },

  async createEducation(input: CreateEducationInput): Promise<Education> {
    const response = await apiClient.instance.post<ApiResponse<Education>>('/portfolio/education', input);
    const data = response.data.data;
    if (!data) {
      throw new Error('Failed to create education: No data returned');
    }
    return data;
  },

  async updateEducation(id: string, input: UpdateEducationInput): Promise<Education> {
    const response = await apiClient.instance.put<ApiResponse<Education>>(`/portfolio/education/${id}`, input);
    const data = response.data.data;
    if (!data) {
      throw new Error('Failed to update education: No data returned');
    }
    return data;
  },

  async deleteEducation(id: string): Promise<void> {
    await apiClient.instance.delete<ApiResponse<null>>(`/portfolio/education/${id}`);
  },
};
