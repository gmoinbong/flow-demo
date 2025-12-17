import type { User } from '@/app/types';
import { nextApiClient } from '@/app/shared/api/api-client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  role: 'creator' | 'brand';
  firstName?: string;
  lastName?: string;
  // Brand-specific fields
  company?: string;
  companySize?: string;
  userRole?: string;
}

export interface AuthResponse {
  user: User;
}

export async function login(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const data = await nextApiClient<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  return data;
}

export async function register(
  credentials: RegisterCredentials
): Promise<AuthResponse> {
  return nextApiClient<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function logoutUser(): Promise<void> {
  try {
    await nextApiClient('/api/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
}

export async function getCurrentUserFromApi(): Promise<User | null> {
  try {
    const user = await nextApiClient<User>('/api/auth/me', {});
    return user;
  } catch (error: any) {
    if (error?.statusCode === 401) {
      return null;
    }
    if (error?.statusCode !== 401) {
      console.error('Get current user error:', error);
    }
    return null;
  }
}

export async function refreshAccessToken(): Promise<boolean> {
  try {
    await nextApiClient('/api/auth/refresh', {
      method: 'POST',
    });
    return true;
  } catch (error) {
    console.error('Refresh token error:', error);
    return false;
  }
}



export async function updateUserRole(role: 'creator' | 'brand'): Promise<User> {
  return nextApiClient<User>('/api/auth/role', {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}
