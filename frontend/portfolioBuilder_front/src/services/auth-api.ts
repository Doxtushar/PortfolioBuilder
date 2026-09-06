import { apiClient } from '../lib/api-client';
import type {
  ApiResponse,
  CurrentUser,
  LoginInput,
  LoginResult,
  RegisterInput,
  RegistrationResult,
} from '../types/auth';

export const authApi = {
  async register(input: RegisterInput): Promise<RegistrationResult> {
    const response = await apiClient.instance.post<ApiResponse<RegistrationResult>>(
      '/auth/register',
      input
    );
    return response.data.data;
  },

  async login(input: LoginInput): Promise<LoginResult> {
    const response = await apiClient.instance.post<ApiResponse<LoginResult>>(
      '/auth/login',
      input
    );
    return response.data.data;
  },

  async getCurrentUser(): Promise<CurrentUser> {
    const response = await apiClient.instance.get<ApiResponse<CurrentUser>>(
      '/auth/me'
    );
    return response.data.data;
  },
};
