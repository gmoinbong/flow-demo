import { cookies, headers } from 'next/headers';
import { ACCESS_TOKEN_COOKIE } from './cookie-utils';
import type { User } from '@/app/types';

export async function getServerUser(): Promise<User | null> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

        if (!accessToken) {
            return null;
        }

        const headersList = await headers();
        const host = headersList.get('host') || 'localhost:3000';
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const baseUrl = `${protocol}://${host}`;

        // Call internal API route to get user
        const response = await fetch(`${baseUrl}/api/auth/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Cookie: cookieStore.toString(),
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            return null;
        }

        const user: User = await response.json();
        return user;
    } catch (error) {
        console.error('Failed to get server user:', error);
        return null;
    }
}

export async function getServerProfile(): Promise<{ profile: unknown } | null> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

        if (!accessToken) {
            return null;
        }

        // Get base URL from headers for internal API calls
        const headersList = await headers();
        const host = headersList.get('host') || 'localhost:3000';
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const baseUrl = `${protocol}://${host}`;

        const response = await fetch(`${baseUrl}/api/profile`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Cookie: cookieStore.toString(),
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to get server profile:', error);
        return null;
    }
}

