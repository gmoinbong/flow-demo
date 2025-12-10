import { RoleSelection } from '@/app/features/onboarding';

// Middleware handles redirects - this page just renders role selection
export default async function RoleSelectionPage() {
  return <RoleSelection />;
}


