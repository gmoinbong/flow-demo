// Client-side auth storage for tokens
// Server-side uses cookies (httpOnly for refresh token)

export const AuthStorage = {
  // Access token in sessionStorage (client-side only)
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('accessToken');
  },

  setAccessToken(token: string): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem('accessToken', token);
  },

  // Refresh token in localStorage (client-side)
  // Server-side uses httpOnly cookie
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  },

  setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('refreshToken', token);
  },

  clearTokens(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

