import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { authApi } from '../services/auth-api';
import type { CurrentUser, LoginInput, RegisterInput } from '../types/auth';

interface AuthContextType {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { isLoading: isUserLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        return null;
      }
      try {
        const userData = await authApi.getCurrentUser();
        setUser(userData);
        return userData;
      } catch {
        apiClient.removeToken();
        setUser(null);
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      apiClient.setToken(data.token);
      setUser(data.user);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Login failed');
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setUser(data.user);
      setError(null);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Registration failed');
    },
  });

  const login = async (input: LoginInput) => {
    await loginMutation.mutateAsync(input);
  };

  const register = async (input: RegisterInput) => {
    await registerMutation.mutateAsync(input);
  };

  const logout = () => {
    apiClient.removeToken();
    setUser(null);
    setError(null);
    queryClient.clear();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading: isUserLoading || loginMutation.isPending || registerMutation.isPending,
    login,
    register,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
