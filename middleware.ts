import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@/app/shared/lib/cookie-utils';
import type { User } from '@/app/types';

// Route configuration
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

// Helper: Check if path matches any route patterns (exact or prefix match)
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(route => {
    // Exact match for root
    if (route === '/' && pathname === '/') return true;
    // Prefix match for other routes
    if (route !== '/' && pathname.startsWith(route)) return true;
    return false;
  });
}

// Cache for fetchUser to prevent multiple calls in same request
const userCache = new Map<string, { user: User | null; timestamp: number }>();
const CACHE_DURATION = 1000; // 1 second - reduced for faster updates

// Helper: Fetch user data with caching
async function fetchUser(request: NextRequest, baseUrl: string): Promise<User | null> {
  try {
    const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    if (!accessToken) return null;

    // Check cache first
    const cached = userCache.get(accessToken);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.user;
    }

    // Fetch user from API
    const response = await fetch(`${baseUrl}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Cookie: request.cookies.toString(),
      },
      cache: 'no-store',
      credentials: 'include',
    });

    if (!response.ok) {
      userCache.delete(accessToken);
      return null;
    }

    const user = await response.json() as User;
    
    // Cache the result
    userCache.set(accessToken, { user, timestamp: Date.now() });

    return user;
  } catch (error) {
    console.error('[Middleware] Failed to fetch user:', error);
    return null;
  }
}

// Helper: Determine onboarding redirect path
function getOnboardingPath(user: User | null): string | null {
  if (!user || user.onboardingComplete) return null;

  const roleMap: Record<string, string> = {
    creator: '/onboarding/creator',
    brand: '/onboarding',
  };

  return roleMap[user.role || ''] || '/onboarding/role-selection';
}

// Helper: Create response with auth headers
function createResponse(
  request: NextRequest,
  accessToken?: string,
  redirectUrl?: string
): NextResponse {
  const headers = new Headers(request.headers);

  if (accessToken) {
    headers.set('x-access-token', accessToken);
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  if (redirectUrl) {
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.next({ request: { headers } });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const baseUrl = request.nextUrl.origin;

  // Skip middleware for static files and Next.js internal routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') // files with extensions
  ) {
    return createResponse(request, accessToken);
  }

  // 1. Pass through API routes (with auth token if available)
  if (pathname.startsWith('/api/')) {
    return createResponse(request, accessToken);
  }

  // 2. Admin routes - require admin token
  if (matchesRoute(pathname, ROUTES.admin) && !pathname.startsWith('/admin/login')) {
    const adminToken = request.cookies.get('admin_token')?.value;
    if (!adminToken) {
      return createResponse(request, undefined, '/admin/login');
    }
    return createResponse(request, accessToken);
  }

  // 3. Root path handling
  if (pathname === '/') {
    if (!accessToken) {
      return createResponse(request); // Show landing page
    }
    
    const user = await fetchUser(request, baseUrl);
    if (!user) {
      return createResponse(request, undefined, '/login');
    }
    
    const defaultDashboard = user.role === 'creator' ? '/creator/dashboard' : '/brand/dashboard';
    const redirect = getOnboardingPath(user) || defaultDashboard;
    return createResponse(request, accessToken, redirect);
  }

  // 4. Public auth pages - redirect if already authenticated
  if (matchesRoute(pathname, ROUTES.public) && accessToken) {
    const user = await fetchUser(request, baseUrl);
    if (!user) {
      return createResponse(request); // Invalid token, allow access to login
    }
    
    const defaultDashboard = user.role === 'creator' ? '/creator/dashboard' : '/brand/dashboard';
    const redirect = getOnboardingPath(user) || request.nextUrl.searchParams.get('redirect') || defaultDashboard;
    return createResponse(request, accessToken, redirect);
  }

  // 5. Protected routes - require authentication
  const allProtectedRoutes = [
    ...ROUTES.protected,
    ...ROUTES.brandRoutes,
    ...ROUTES.creatorRoutes,
    ...ROUTES.sharedProtected,
    ...ROUTES.onboarding,
  ];
  
  const isProtected = matchesRoute(pathname, allProtectedRoutes);
  if (!isProtected) {
    return createResponse(request, accessToken);
  }

  // No token - redirect to login
  if (!accessToken) {
    const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
    return createResponse(request, undefined, loginUrl);
  }

  // Fetch user for protected route access control
  const user = await fetchUser(request, baseUrl);
  if (!user) {
    const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
    return createResponse(request, undefined, loginUrl);
  }

  const isOnboarding = matchesRoute(pathname, ROUTES.onboarding);

  // Block access to onboarding if already completed
  if (isOnboarding && user.onboardingComplete) {
    const dashboardPath = user.role === 'creator' ? '/creator/dashboard' : '/brand/dashboard';
    return createResponse(request, accessToken, dashboardPath);
  }

  // If user has role but is on role-selection, redirect to appropriate onboarding
  if (pathname === '/onboarding/role-selection' && user.role) {
    const onboardingPath = getOnboardingPath(user);
    if (onboardingPath) {
      return createResponse(request, accessToken, onboardingPath);
    }
  }

  // If user is on wrong onboarding path for their role, redirect
  if (pathname === '/onboarding/creator' && user.role !== 'creator') {
    return createResponse(request, accessToken, '/onboarding');
  }
  if (pathname === '/onboarding' && user.role === 'creator') {
    return createResponse(request, accessToken, '/onboarding/creator');
  }

  // Require onboarding completion for non-onboarding protected routes
  if (!isOnboarding) {
    const onboardingPath = getOnboardingPath(user);
    if (onboardingPath) {
      return createResponse(request, accessToken, onboardingPath);
    }
  }

  // Check role-based access for brand/creator routes
  const isBrandRoute = matchesRoute(pathname, ROUTES.brandRoutes);
  const isCreatorRoute = matchesRoute(pathname, ROUTES.creatorRoutes);

  if (isBrandRoute && user.role !== 'brand') {
    return createResponse(request, accessToken, '/creator/dashboard');
  }

  if (isCreatorRoute && user.role !== 'creator') {
    return createResponse(request, accessToken, '/brand/dashboard');
  }

  return createResponse(request, accessToken);
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