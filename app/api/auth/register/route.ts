import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const RegisterSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100),
    role: z.enum(['creator', 'brand']),
    // Common fields - required and must be non-empty after trim
    firstName: z
      .string()
      .min(1, 'First name is required')
      .refine(val => val.trim().length > 0, {
        message: 'First name cannot be empty',
      }),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .refine(val => val.trim().length > 0, {
        message: 'Last name cannot be empty',
      }),
    // Brand-specific fields (required when role is 'brand')
    company: z.string().min(1).optional(),
    companySize: z.string().optional(),
    userRole: z.string().optional(),
  })
  .refine(
    data => {
      // If brand role, company is required
      if (data.role === 'brand') {
        return !!data.company && data.company.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Company name is required for brand accounts',
      path: ['company'],
    }
  );

import {
  COOKIE_OPTIONS,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from '@/app/shared/lib/cookie-utils';
import { transformUserData } from '@/app/features/auth/lib/transform-user-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const result = RegisterSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${backendUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.data),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Registration failed' },
        { status: response.status }
      );
    }

    // Set cookies immediately after successful registration
    if (data.accessToken && data.refreshToken) {
      const user = transformUserData(data.user);
      const nextResponse = NextResponse.json({ user }, { status: 201 });

      nextResponse.cookies.set(ACCESS_TOKEN_COOKIE, data.accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });

      nextResponse.cookies.set(REFRESH_TOKEN_COOKIE, data.refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: REFRESH_TOKEN_MAX_AGE,
      });

      return nextResponse;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Register API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
