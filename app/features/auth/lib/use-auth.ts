'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  login,
  register,
  logoutUser,
  getCurrentUserFromApi,
  refreshAccessToken,
  getCachedUser,
  setCachedUser,
} from './auth-api';
import type { LoginCredentials, RegisterCredentials } from './auth-api';

export function useAuth() {
  const cachedUser = typeof window !== 'undefined' ? getCachedUser() : null;

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: getCurrentUserFromApi,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    retry: 1,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    initialData: cachedUser || undefined,
    placeholderData: cachedUser || undefined,
  });

  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      setCachedUser(user);
    } else if (!user && !isLoading && typeof window !== 'undefined') {
      setCachedUser(null);
    }
  }, [user, isLoading]);

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
      queryClient.setQueryData(['auth', 'user'], data.user);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
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
