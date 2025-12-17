'use client';

import Link from 'next/link';

import { CreatorDashboardView } from '@/app/features/creator';
import { OnboardingGuard } from '@/app/shared/components/onboarding-guard';
import { Button } from '@/app/shared/ui/button';

export default function CreatorDashboardPage() {
  return (
    <OnboardingGuard>
      <Button asChild variant='outline' size='sm'>
        <Link href='/dashboard'>Back to dashboard</Link>
      </Button>
      <CreatorDashboardView />
    </OnboardingGuard>
  );
}
