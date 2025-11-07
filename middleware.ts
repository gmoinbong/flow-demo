import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_TOKEN_COOKIE } from '@/app/shared/lib/cookie-utils';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  // Pass token to API routes via header
  const requestHeaders = new Headers(request.headers);
  if (accessToken && pathname.startsWith('/api/')) {
    requestHeaders.set('x-access-token', accessToken);
  }

  // Protected routes
  const protectedRoutes = [
    '/dashboard',
    '/campaigns',
    '/creators',
    '/payments',
    '/reports',
    '/profile',
    '/creator/dashboard',
    '/creator/campaigns',
    '/creator/messages',
    '/creator/payments',
    '/creator/profile',
  ];

  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!accessToken) {
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect from /login if already authenticated
  if (pathname === '/login' || pathname.startsWith('/login')) {
    if (accessToken) {
      return NextResponse.redirect(new URL('/physicians', request.url));
    }
  }

  // Admin routes (if needed)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminToken = request.cookies.get('admin_token')?.value;
    
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/campaigns/:path*',
    '/creators/:path*',
    '/payments/:path*',
    '/reports/:path*',
    '/creator/:path*',
    '/admin/:path*',
    '/api/:path*',
  ],
};

