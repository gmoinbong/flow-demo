'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  login,
  register,
  logoutUser,
  getCurrentUserFromApi,
  refreshAccessToken,
} from './auth-api';
import type { LoginCredentials, RegisterCredentials } from './auth-api';

export function useAuth() {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: getCurrentUserFromApi,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    retry: false, // Don't retry on 401 errors
    refetchOnMount: false, // Prevent infinite loops
    refetchOnWindowFocus: false,
    refetchOnReconnect: false, // Prevent refetch on reconnect
  });

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      return login(credentials);
    },
    onSuccess: data => {
      // Set user data immediately to prevent refetch loops
      queryClient.setQueryData(['auth', 'user'], data.user);
      // Don't invalidate queries immediately to prevent refetch on redirect
      // queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: error => {
      console.error('Login error:', error);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      return register(credentials);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
    onError: error => {
      console.error('Register error:', error);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await logoutUser();
    },
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'user'], null);
      queryClient.clear();
      router.push('/login');
    },
    onError: error => {
      console.error('Logout error:', error);
      queryClient.setQueryData(['auth', 'user'], null);
      queryClient.clear();
      router.push('/login');
    },
  });
}

export function useRefreshToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return refreshAccessToken();
    },
    onSuccess: success => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
      }
    },
  });
}
