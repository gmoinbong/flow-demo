import { OnboardingFlow } from '@/app/features/onboarding';

// Middleware handles all redirects - this page just renders the flow
export default async function OnboardingPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
      <OnboardingFlow />
    </div>
  );
}
