import { NextRequest, NextResponse } from 'next/server';
import {
  createResponse,
  fetchUser,
  getOnboardingPath,
  matchesRoute,
  ensureValidToken,
} from '@/app/shared/lib/helpers';
import { ACCESS_TOKEN_COOKIE } from '@/app/shared/lib/cookie-utils';

const PUBLIC_PREFIXES = ['/_next/', '/static/'];
const ROUTES = {
  public: ['/login', '/signup', '/auth/callback'],
  protected: ['/dashboard'], // Common dashboard route
  brandRoutes: ['/brand'], // Brand-specific routes
  creatorRoutes: ['/creator'], // Creator-specific routes
  sharedProtected: ['/campaigns', '/creators', '/payments', '/reports'], // Shared protected routes
  onboarding: ['/onboarding'],
  admin: ['/admin'],
  allowedApis: [
    '/api/auth/logout',
    '/api/auth/me',
    '/api/auth/complete-onboarding',
    '/api/creators/complete-onboarding',
    '/api/profile',
  ],
};

// Helper to extract token string from ensureValidToken result
function extractToken(tokenResult: string | { accessToken: string; refreshToken?: string } | null): string | undefined {
  if (!tokenResult) return undefined;
  if (typeof tokenResult === 'string') return tokenResult;
  return tokenResult.accessToken;
}

export async function middleware(request: NextRequest) {
  const { pathname, origin, searchParams } = request.nextUrl;

  const passThrough = (tokenResult?: string | { accessToken: string; refreshToken?: string } | null) => {
    return createResponse(request, tokenResult);
  };
  
  const redirect = (to: string, tokenResult?: string | { accessToken: string; refreshToken?: string } | null) => {
    return createResponse(request, tokenResult, to);
  };

  const redirectToLogin = () =>
    redirect(`/login?redirect=${encodeURIComponent(pathname)}`, undefined);

  const fetchUserSafe = async (tokenResult?: string | { accessToken: string; refreshToken?: string } | null) => {
    const token = extractToken(tokenResult);
    return fetchUser(request, origin, token);
  };

  if (
    (PUBLIC_PREFIXES && PUBLIC_PREFIXES.some(p => pathname.startsWith(p))) ||
    pathname.includes('.') ||
    pathname.startsWith('/api/')
  ) {
    return passThrough();
  }

  if (matchesRoute(pathname, ROUTES.admin) && !pathname.startsWith('/admin/login')) {
    const adminToken = request.cookies.get('admin_token')?.value;
    return adminToken ? passThrough() : redirect('/admin/login', undefined);
  }

  if (pathname === '/') {
    // Ensure valid token before checking user
    const validToken = await ensureValidToken(request, origin);
    if (!validToken) {
      return passThrough();
    }

    const user = await fetchUserSafe(validToken);
    if (!user) return redirect('/login', undefined);

    return redirect(getOnboardingPath(user) || '/dashboard', validToken);
  }

  if (matchesRoute(pathname, ROUTES.public)) {
    // Ensure valid token if refresh token exists
    const validToken = await ensureValidToken(request, origin);
    if (validToken) {
      const user = await fetchUserSafe(validToken);
      if (user) {
        return redirect(
          getOnboardingPath(user) ||
          searchParams.get('redirect') ||
          '/dashboard',
          validToken
        );
      }
    }
    return passThrough();
  }

  const protectedRoutes = [
    ...ROUTES.protected,
    ...ROUTES.brandRoutes,
    ...ROUTES.creatorRoutes,
    ...ROUTES.sharedProtected,
    ...ROUTES.onboarding,
  ];

  if (!matchesRoute(pathname, protectedRoutes)) {
    return passThrough();
  }

  // Ensure valid token for protected routes
  const validToken = await ensureValidToken(request, origin);
  if (!validToken) {
    return redirectToLogin();
  }

  const user = await fetchUserSafe(validToken);
  if (!user) return redirectToLogin();

  const isOnboarding = matchesRoute(pathname, ROUTES.onboarding);

  if (isOnboarding && user.onboardingComplete) {
    return redirect(
      user.role === 'creator'
        ? '/creator/dashboard'
        : '/brand/dashboard',
      validToken
    );
  }

  if (!isOnboarding) {
    const onboardingPath = getOnboardingPath(user);
    if (onboardingPath) return redirect(onboardingPath, validToken);
  }

  if (pathname === '/onboarding/role-selection' && user.role) {
    const path = getOnboardingPath(user);
    if (path) return redirect(path, validToken);
  }

  if (pathname === '/onboarding/creator' && user.role !== 'creator') {
    return redirect('/onboarding', validToken);
  }

  if (pathname === '/onboarding' && user.role === 'creator') {
    return redirect('/onboarding/creator', validToken);
  }

  if (matchesRoute(pathname, ROUTES.brandRoutes) && user.role !== 'brand') {
    return redirect('/creator/dashboard', validToken);
  }

  if (matchesRoute(pathname, ROUTES.creatorRoutes) && user.role !== 'creator') {
    return redirect('/brand/dashboard', validToken);
  }

  return passThrough(validToken);
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/brand/:path*',
    '/creator/:path*',
    '/campaigns/:path*',
    '/creators/:path*',
    '/payments/:path*',
    '/reports/:path*',
    '/onboarding/:path*',
    '/admin/:path*',
    '/api/:path*',
    '/login',
    '/signup',
    '/auth/:path*',
  ],
};
