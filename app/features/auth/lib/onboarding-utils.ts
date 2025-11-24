import type { User } from '@/app/types';
export function getOnboardingRedirect(user: User | null): string | null {
    if (!user) {
        return '/login';
    }

    if (user.onboardingComplete === true) {
        return null;
    }

    if (user.role === 'creator') {
        return '/onboarding/creator';
    }

    if (user.role === 'brand') {
        return '/onboarding';
    }

    if (!user.role) {
        return '/onboarding/role-selection';
    }

    return null;
}

export function needsOnboarding(user: User | null): boolean {
    if (!user) {
        return false;
    }

    if (user.onboardingComplete === true) {
        return false;
    }

    if (!user.role) {
        return true;
    }

    return !user.onboardingComplete;
}

