'use client';

import { CreatorDashboardView } from '@/app/features/creator';
import { OnboardingGuard } from '@/app/shared/components/onboarding-guard';

export default function CreatorDashboardPage() {
  return (
    <OnboardingGuard>
      <CreatorDashboardView />
    </OnboardingGuard>
  );
}
