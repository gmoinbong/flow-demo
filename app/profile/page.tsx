'use client';

import { ProfileView } from '@/app/features/profile/ui/profile-view';
import { useProfilePageState } from '@/app/features/profile/lib/use-profile-page-state';
import { useAuth } from '@/app/features/auth';
import { Button } from '@/app/shared/ui/button';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { capitalizeFirstLetter } from '@/app/shared/lib/utils';

export default function ProfilePage() {
  const state = useProfilePageState();
  const { user } = useAuth();
  const router = useRouter();

  const getDashboardPath = (useRoleBased = false) => {
    // Default: use common dashboard without custom path
    if (!useRoleBased) {
      return '/dashboard';
    }

    // Optional: use role-specific dashboard
    if (user?.role === 'creator') {
      return '/creator/dashboard';
    }
    if (user?.role === 'brand') {
      return '/dashboard';
    }

    // Fallback to common dashboard
    return '/dashboard';
  };

  if (state.type === 'loading') {
    return (
      <div className='min-h-screen bg-slate-50'>
        <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='mb-8'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-3xl font-bold text-foreground mb-2'>
                  Profile Settings
                </h1>
                <p className='text-muted-foreground'>
                  Manage your account information and preferences
                </p>
              </div>
              <div className='flex items-center gap-2'>
                {user?.role && (
                  <Button
                    variant='outline'
                    onClick={() => router.push(getDashboardPath(true))}
                    className='flex items-center gap-2'
                  >
                    <LayoutDashboard className='w-4 h-4' />
                    Role Dashboard
                  </Button>
                )}
                <Button
                  variant='outline'
                  onClick={() => router.push(getDashboardPath())}
                  className='flex items-center gap-2'
                >
                  <ArrowLeft className='w-4 h-4' />
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </div>
          <div className='text-center py-8 text-muted-foreground'>
            Loading profile...
          </div>
        </main>
      </div>
    );
  }

  if (state.type === 'unauthorized' || state.type === 'not-found') {
    return null;
  }

  // Ready state - show profile
  return (
    <div className='min-h-screen bg-slate-50'>
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-foreground mb-2'>
                Profile Settings
              </h1>
              <p className='text-muted-foreground'>
                Manage your account information and preferences
              </p>
            </div>
            <div className='flex items-center gap-2'>
              {user?.role && user?.role !== 'brand' && (
                <Button
                  variant='outline'
                  onClick={() => router.push(getDashboardPath(true))}
                  className='flex items-center gap-2'
                >
                  <LayoutDashboard className='w-4 h-4' />
                  {capitalizeFirstLetter(user.role)} Dashboard
                </Button>
              )}
              <Button
                variant='outline'
                onClick={() => router.push(getDashboardPath())}
                className='flex items-center gap-2'
              >
                <ArrowLeft className='w-4 h-4' />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>

        <ProfileView />
      </main>
    </div>
  );
}
