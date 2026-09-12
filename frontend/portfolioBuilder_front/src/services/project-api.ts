import axios from 'axios';
import { apiClient } from '../lib/api-client.js';
import type { ApiResponse } from '../types/auth.js';
import type { CreateProjectInput, Project, UpdateProjectInput } from '../types/project.js';

export const projectApi = {
  async getProjects(): Promise<Project[]> {
    const response = await apiClient.instance.get<ApiResponse<Project[]>>('/portfolio/projects');
    return response.data.data || [];
  },

  async createProject(input: CreateProjectInput): Promise<Project> {
    const response = await apiClient.instance.post<ApiResponse<Project>>('/portfolio/projects', input);
    const data = response.data.data;
    if (!data) {
      throw new Error('Failed to create project: No data returned');
    }
    return data;
  },

  async updateProject(id: string, input: UpdateProjectInput): Promise<Project> {
    const response = await apiClient.instance.put<ApiResponse<Project>>(`/portfolio/projects/${id}`, input);
    const data = response.data.data;
    if (!data) {
      throw new Error('Failed to update project: No data returned');
    }
    return data;
  },

  async deleteProject(id: string): Promise<void> {
    await apiClient.instance.delete<ApiResponse<null>>(`/portfolio/projects/${id}`);
  },
};
