import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_TOKEN_COOKIE } from '@/app/shared/lib/cookie-utils';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  //Pass token to API routes
  const requestHeaders = new Headers(request.headers);
  if (pathname.startsWith('/api/') && accessToken) {
    requestHeaders.set('x-access-token', accessToken);
    requestHeaders.set('Authorization', `Bearer ${accessToken}`);
  }

  const isAuthPage = ['/login', '/signup'].some(p => pathname.startsWith(p));
  if (isAuthPage && accessToken && !pathname.startsWith('/auth/callback')) {
    const redirect = request.nextUrl.searchParams.get('redirect') || '/dashboard';
    return NextResponse.redirect(new URL(redirect, request.url));
  }

  const isProtected = [
    '/dashboard',
    '/campaigns',
    '/creators',
    '/payments',
    '/reports',
    '/profile',
    '/creator',
    '/onboarding',
  ].some(route => pathname.startsWith(route));

  if (isProtected && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith('/admin') ?? !pathname.startsWith('/admin/login')) {
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
    '/profile/:path*',
    '/creator/:path*',
    '/onboarding/:path*',
    '/admin/:path*',
    '/api/:path*',
    '/login/:path*',
    '/signup/:path*',
    '/auth/:path*',
  ],
};
