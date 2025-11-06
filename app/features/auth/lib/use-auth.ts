'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { User } from '@/app/types';
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
  const queryClient = useQueryClient();

  // Get cached user for instant initial render
  const cachedUser = typeof window !== 'undefined' ? getCachedUser() : null;

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: getCurrentUserFromApi,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    retry: 1,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    // Use cached user as initial data and placeholder
    initialData: cachedUser || undefined,
    placeholderData: cachedUser || undefined,
  });

  // Update cache when user data changes
  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      setCachedUser(user);
    } else if (!user && !isLoading && typeof window !== 'undefined') {
      // Clear cache if user is null and not loading
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
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      return login(credentials);
    },
    onSuccess: (data) => {
      // Update React Query cache
      queryClient.setQueryData(['auth', 'user'], data.user);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      return register(credentials);
    },
    onSuccess: () => {
      // After registration, automatically login
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
    onError: (error) => {
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
      // Clear React Query cache
      queryClient.setQueryData(['auth', 'user'], null);
      queryClient.clear();
      router.push('/login');
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Still clear cache even on error
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
    onSuccess: (success) => {
      if (success) {
        // Invalidate auth queries to refetch with new token
        queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
      }
    },
  });
}
