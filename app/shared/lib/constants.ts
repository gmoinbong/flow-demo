import type { User } from '@/app/types';
export const USER_CACHE = new Map<string, { user: User | null; timestamp: number }>();
export const CACHE_DURATION = 1000;