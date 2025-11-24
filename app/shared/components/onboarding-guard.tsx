'use client';

import { useRequireOnboarding } from '@/app/features/auth';
import { useAuth } from '@/app/features/auth';
import { Spinner } from '@/app/shared/ui/spinner';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { isLoading } = useAuth();
  useRequireOnboarding();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="mx-auto" />
      </div>
    );
  }

  return <>{children}</>;
}


