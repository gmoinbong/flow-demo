'use client';
// Shared API client with automatic token management (client-side only)
// Tokens are stored in httpOnly cookies, so we use credentials: 'include'
// For direct backend calls, tokens are sent automatically via cookies

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export interface ApiError {
  message: string;
  code?: number;
  statusCode: number;
  context?: Record<string, unknown>;
}

export class ApiClientError extends Error {
  constructor(
    public statusCode: number,
    public code?: number,
    public context?: Record<string, unknown>
  ) {
    super();
    this.name = 'ApiClientError';
  }
}

async function refreshTokenIfNeeded(): Promise<boolean> {
  // Client-side: refresh via API route (tokens are in cookies)
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    return response.ok;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
}

// Client-side API client
// Note: For direct backend calls, tokens are sent via cookies automatically
// If you need Authorization header, use Next.js API routes as proxy
export async function apiClient(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  let response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Send cookies automatically
  });

  // Auto-refresh token on 401
  if (response.status === 401) {
    const refreshed = await refreshTokenIfNeeded();
    if (refreshed) {
      // Retry request with refreshed tokens (in cookies)
      response = await fetch(`${BACKEND_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      });
    }
  }

  return response;
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    const error: ApiError = data;
    throw new ApiClientError(
      error.statusCode || response.status,
      error.code,
      error.context
    );
  }

  return data;
}
