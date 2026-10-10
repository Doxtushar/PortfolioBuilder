import axios from 'axios';
import { apiClient } from '../lib/api-client.js';
import type { ApiResponse } from '../types/auth.js';
import type { CreateCertificationInput, Certification, UpdateCertificationInput } from '../types/certification.js';

export const certificationApi = {
  async getCertifications(): Promise<Certification[]> {
    const response = await apiClient.instance.get<ApiResponse<Certification[]>>('/portfolio/certifications');
    return response.data.data || [];
  },

  async createCertification(input: CreateCertificationInput): Promise<Certification> {
    const response = await apiClient.instance.post<ApiResponse<Certification>>('/portfolio/certifications', input);
    const data = response.data.data;
    if (!data) {
      throw new Error('Failed to create certification: No data returned');
    }
    return data;
  },

  async updateCertification(id: string, input: UpdateCertificationInput): Promise<Certification> {
    const response = await apiClient.instance.put<ApiResponse<Certification>>(`/portfolio/certifications/${id}`, input);
    const data = response.data.data;
    if (!data) {
      throw new Error('Failed to update certification: No data returned');
    }
    return data;
  },

  async deleteCertification(id: string): Promise<void> {
    await apiClient.instance.delete<ApiResponse<null>>(`/portfolio/certifications/${id}`);
  },
};
