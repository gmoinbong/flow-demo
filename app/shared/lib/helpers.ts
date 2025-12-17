import { NextRequest, NextResponse } from "next/server";
import { User } from "@/app/types";

// Constants defined here to avoid Edge Runtime import issues
const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';
const CACHE_DURATION = 1000; // 1 second cache for user data
const REFRESH_CACHE_DURATION = 2000; // Cache refresh result for 2 seconds to avoid parallel requests
const USER_CACHE = new Map<string, { user: User | null; timestamp: number }>();
const REFRESH_CACHE = new Map<string, { token: string | null; timestamp: number }>();

// Clear cache on module reload (dev mode)
if (USER_CACHE.size > 0) {
    console.log('[Cache] Clearing USER_CACHE on module reload');
    USER_CACHE.clear();
}
if (REFRESH_CACHE.size > 0) {
    console.log('[Cache] Clearing REFRESH_CACHE on module reload');
    REFRESH_CACHE.clear();
}

export function createResponse(
    request: NextRequest,
    accessToken?: string | RefreshResult | null,
    redirectUrl?: string
): NextResponse {
    const headers = new Headers(request.headers);

    // Extract token from string or RefreshResult
    let token: string | undefined;
    let refreshTokenValue: string | undefined;

    if (typeof accessToken === 'string') {
        token = accessToken;
    } else if (accessToken && typeof accessToken === 'object' && 'accessToken' in accessToken) {
        token = accessToken.accessToken;
        refreshTokenValue = accessToken.refreshToken;
    }

    if (token) {
        headers.set('x-access-token', token);
        headers.set('Authorization', `Bearer ${token}`);
    }

    if (redirectUrl) {
        const response = NextResponse.redirect(new URL(redirectUrl, request.url));
        // Set tokens in response cookies if provided
        if (token) {
            response.cookies.set(ACCESS_TOKEN_COOKIE, token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 15 * 60, // 15 minutes
            });
        }
        if (refreshTokenValue) {
            response.cookies.set(REFRESH_TOKEN_COOKIE, refreshTokenValue, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60, // 7 days
            });
        }
        return response;
    }

    const response = NextResponse.next({ request: { headers } });
    // Set tokens in response cookies if provided
    if (token) {
        response.cookies.set(ACCESS_TOKEN_COOKIE, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 15 * 60, // 15 minutes
        });
    }
    if (refreshTokenValue) {
        response.cookies.set(REFRESH_TOKEN_COOKIE, refreshTokenValue, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });
    }
    return response;
}



export function matchesRoute(pathname: string, routes: string[]): boolean {
    return routes.some(route => {
        if (route === '/' && pathname === '/') return true;
        if (route !== '/' && pathname.startsWith(route)) return true;
        return false;
    });
}

export async function fetchUser(
    request: NextRequest,
    baseUrl: string,
    accessToken?: string
): Promise<User | null> {
    try {
        const token = accessToken || request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
        if (!token) {
            return null;
        }

        const cached = USER_CACHE.get(token);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.user;
        }

        // Build cookie header for internal fetch
        const cookieHeader = Array.from(request.cookies.getAll())
            .map(cookie => `${cookie.name}=${cookie.value}`)
            .join('; ');

        const response = await fetch(`${baseUrl}/api/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Cookie: cookieHeader,
                'x-access-token': token,
            },
            cache: 'no-store',
            credentials: 'include',
        });

        if (!response.ok) {
            USER_CACHE.delete(token);
            return null;
        }

        const user = await response.json() as User;
        USER_CACHE.set(token, { user, timestamp: Date.now() });

        return user;
    } catch (error) {
        console.error('[fetchUser] Failed:', error);
        return null;
    }
}

export function getOnboardingPath(user: User | null): string | null {
    if (!user || user.onboardingComplete) return null;

    const roleMap: Record<string, string> = {
        creator: '/onboarding/creator',
        brand: '/onboarding',
    };

    return roleMap[user.role || ''] || '/onboarding/role-selection';
}

/**
 * Check if access token is valid by attempting to fetch user
 * Returns true if token is valid, false otherwise
 */
async function isTokenValid(
    request: NextRequest,
    baseUrl: string,
    accessToken: string
): Promise<boolean> {
    const user = await fetchUser(request, baseUrl, accessToken);
    return user !== null;
}

export interface RefreshResult {
    accessToken: string;
    refreshToken?: string;
}

/**
 * Refresh access token using refresh token
 * Returns new tokens or null if refresh failed
 */
async function refreshToken(
    request: NextRequest,
    baseUrl: string,
    refreshToken: string
): Promise<RefreshResult | null> {
    try {
        // Build cookie header for internal fetch
        const cookieHeader = Array.from(request.cookies.getAll())
            .map(cookie => `${cookie.name}=${cookie.value}`)
            .join('; ');
        
        const response = await fetch(`${baseUrl}/api/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookieHeader,
            },
            cache: 'no-store',
            credentials: 'include',
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json() as { accessToken?: string; refreshToken?: string; success?: boolean };
        
        if (!data.accessToken) {
            return null;
        }

        return {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
        };
    } catch (error) {
        console.error('[refreshToken] Failed:', error);
        return null;
    }
}

/**
 * Ensure valid access token exists, refresh if needed
 * Returns access token and refresh token (if updated) or null if refresh failed
 */
export async function ensureValidToken(
    request: NextRequest,
    baseUrl: string
): Promise<RefreshResult | string | null> {
    let accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    const refreshTokenValue = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

    // If we have access token, check if it's valid
    if (accessToken) {
        const isValid = await isTokenValid(request, baseUrl, accessToken);
        if (isValid) {
            return accessToken; // Token is valid, return as string
        }
    }

    // No access token or it's invalid, try to refresh
    if (!refreshTokenValue) {
        return null;
    }

    // Attempt to refresh
    return await refreshToken(request, baseUrl, refreshTokenValue);
}