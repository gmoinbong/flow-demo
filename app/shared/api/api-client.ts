'use client';

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
    public context?: Record<string, unknown>,
    message?: string
  ) {
    super(message || `API Error: ${statusCode}`);
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
  // Check if response has content
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  let data: unknown;

  try {
    if (isJson) {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } else {
      const text = await response.text();
      data = text || {};
    }
  } catch (error) {
    // If JSON parsing fails, create error object from response
    data = {
      message: `Failed to parse response: ${error instanceof Error ? error.message : 'Unknown error'}`,
      statusCode: response.status,
    };
  }

  if (!response.ok) {
    const error: ApiError =
      typeof data === 'object' && data !== null
        ? {
            message:
              'message' in data && typeof data.message === 'string'
                ? data.message
                : 'error' in data && typeof data.error === 'string'
                  ? data.error
                  : 'An error occurred',
            statusCode:
              'statusCode' in data && typeof data.statusCode === 'number'
                ? data.statusCode
                : response.status,
            code:
              'code' in data && typeof data.code === 'number'
                ? data.code
                : undefined,
            context:
              'context' in data &&
              typeof data.context === 'object' &&
              data.context !== null
                ? (data.context as Record<string, unknown>)
                : undefined,
          }
        : {
            message: 'An error occurred',
            statusCode: response.status,
          };

    throw new ApiClientError(
      error.statusCode,
      error.code,
      error.context,
      error.message
    );
  }

  return data as T;
}

export async function nextApiClient<T>(
  endpoint: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers);

  if (!headers.has('Content-Type') && fetchOptions.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...fetchOptions,
    headers,
    credentials: 'include',
  });

  return handleApiResponse<T>(response);
}
