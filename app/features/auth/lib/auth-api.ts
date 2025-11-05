import type { User, UserRole } from '@/app/types';

// Auth helpers
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export function setCurrentUser(user: User): void {
  localStorage.setItem('user', JSON.stringify(user));
}

export function logout(): void {
  localStorage.removeItem('user');
  localStorage.removeItem('campaigns');
  localStorage.removeItem('allocations');
  localStorage.removeItem('mockCreators');
  localStorage.removeItem('notifications');
  localStorage.removeItem('messages');
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
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

