import type { User, UserRole } from '@/app/types';
import { handleApiResponse } from '@/app/shared/api/api-client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
}

const AUTH_USER_CACHE_KEY = 'auth_user_cache';

// Client-side user cache helpers (for fast initial render)
export function getCachedUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(AUTH_USER_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

export function setCachedUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(AUTH_USER_CACHE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_CACHE_KEY);
    }
  } catch {
    // Ignore localStorage errors
  }
}

export function clearAuthCache(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_USER_CACHE_KEY);
  // Clear other app-specific cache if needed
  localStorage.removeItem('campaigns');
  localStorage.removeItem('allocations');
  localStorage.removeItem('mockCreators');
  localStorage.removeItem('notifications');
  localStorage.removeItem('messages');
}

// Legacy helpers for backward compatibility
export function getCurrentUser(): User | null {
  return getCachedUser();
}

export function setCurrentUser(user: User): void {
  setCachedUser(user);
}

export function logout(): void {
  clearAuthCache();
}

export function isAuthenticated(): boolean {
  // Check if we have cached user (tokens are in httpOnly cookies)
  return getCachedUser() !== null;
}

export function requireAuth(role?: UserRole): User {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }
  if (role && user.role !== role) {
    throw new Error(`Requires ${role} role`);
  }
  return user;
}

// API functions - all use cookies, no client-side token storage
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });

  const data = await handleApiResponse<AuthResponse>(response);

  // Cache user data for fast initial render
  if (typeof window !== 'undefined' && data.user) {
    setCachedUser(data.user);
  }

  return data;
}

export async function register(
  credentials: RegisterCredentials
): Promise<{ user: { id: string; email: string } }> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });

  return handleApiResponse(response);
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearAuthCache();
  }
}

export async function getCurrentUserFromApi(): Promise<User | null> {
  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      // If 401, refresh is handled automatically by API route
      if (response.status === 401) {
        clearAuthCache();
        return null;
      }
      return null;
    }

    const user = await response.json() as User;

    // Cache user data
    if (typeof window !== 'undefined') {
      setCachedUser(user);
    }

    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    clearAuthCache();
    return null;
  }
}

export async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      clearAuthCache();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Refresh token error:', error);
    clearAuthCache();
    return false;
  }
}
