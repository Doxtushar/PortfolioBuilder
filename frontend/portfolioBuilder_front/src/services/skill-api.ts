import axios from 'axios';
import { apiClient } from '../lib/api-client.js';
import type { ApiResponse } from '../types/auth.js';
import type { CreateSkillInput, Skill, UpdateSkillInput } from '../types/skill.js';

export const skillApi = {
  async getSkills(): Promise<Skill[]> {
    const response = await apiClient.instance.get<ApiResponse<Skill[]>>('/portfolio/skills');
    return response.data.data || [];
  },

  async createSkill(input: CreateSkillInput): Promise<Skill> {
    const response = await apiClient.instance.post<ApiResponse<Skill>>('/portfolio/skills', input);
    const data = response.data.data;
    if (!data) {
      throw new Error('Failed to create skill: No data returned');
    }
    return data;
  },

  async updateSkill(id: string, input: UpdateSkillInput): Promise<Skill> {
    const response = await apiClient.instance.put<ApiResponse<Skill>>(`/portfolio/skills/${id}`, input);
    const data = response.data.data;
    if (!data) {
      throw new Error('Failed to update skill: No data returned');
    }
    return data;
  },

  async deleteSkill(id: string): Promise<void> {
    await apiClient.instance.delete<ApiResponse<null>>(`/portfolio/skills/${id}`);
  },
};
