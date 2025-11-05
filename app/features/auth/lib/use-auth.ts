'use client';
import { useState, useEffect } from 'react';
import type { User } from '@/app/types';
import {
  getCurrentUser,
  setCurrentUser,
  logout as logoutUser,
  isAuthenticated,
} from './auth-api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  return { user, isLoading };
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (user: User) => {
    setIsLoading(true);
    setCurrentUser(user);
    setIsLoading(false);
    return user;
  };

  return { login, isLoading };
}

export function useLogout() {
  const logout = () => {
    logoutUser();
  };

  return { logout };
}

export function useIsAuthenticated() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  return { isAuthenticated: authenticated };
}
