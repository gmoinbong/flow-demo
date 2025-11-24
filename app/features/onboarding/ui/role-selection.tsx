'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/shared/ui/button';
import { Label } from '@/app/shared/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/shared/ui/radio-group';
import { useAuth, updateUserRole } from '@/app/features/auth';
import { useQueryClient } from '@tanstack/react-query';
import type { UserRole } from '@/app/types';

export function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleContinue = async () => {
    if (!selectedRole) {
      alert('Please select an account type');
      return;
    }

    if (!user) {
      router.push('/login');
      return;
    }

    setIsUpdating(true);

    try {
      const updatedUser = await updateUserRole(selectedRole);

      queryClient.setQueryData(['auth', 'user'], updatedUser);

      if (selectedRole === 'creator') {
        router.replace('/onboarding/creator');
      } else {
        router.replace('/onboarding');
      }
    } catch (error) {
      console.error('Failed to update role:', error);
      alert('Failed to update role. Please try again.');
      setIsUpdating(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4'>
      <div className='w-full max-w-2xl'>
        <div className='bg-white rounded-lg shadow-lg p-8 space-y-6'>
          <div className='text-center space-y-2'>
            <h1 className='text-3xl font-bold text-foreground'>
              Choose Your Account Type
            </h1>
            <p className='text-muted-foreground'>
              Select the type of account that best describes you
            </p>
          </div>

          <div className='space-y-4'>
            <Label className='text-base font-medium'>I am a...</Label>
            <RadioGroup
              value={selectedRole}
              onValueChange={value => setSelectedRole(value as UserRole)}
              className='grid grid-cols-2 gap-4'
            >
              <div>
                <RadioGroupItem
                  value='brand'
                  id='brand'
                  className='peer sr-only'
                />
                <Label
                  htmlFor='brand'
                  className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='mb-3 h-8 w-8'
                  >
                    <rect width='20' height='14' x='2' y='7' rx='2' ry='2' />
                    <path d='M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' />
                  </svg>
                  <span className='text-base font-medium'>Brand</span>
                  <span className='text-xs text-muted-foreground mt-2 text-center'>
                    I want to find and work with creators
                  </span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value='creator'
                  id='creator'
                  className='peer sr-only'
                />
                <Label
                  htmlFor='creator'
                  className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='mb-3 h-8 w-8'
                  >
                    <path d='m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z' />
                    <path d='M5 3v4' />
                    <path d='M19 17v4' />
                    <path d='M3 5h4' />
                    <path d='M17 19h4' />
                  </svg>
                  <span className='text-base font-medium'>Creator</span>
                  <span className='text-xs text-muted-foreground mt-2 text-center'>
                    I create content and want to work with brands
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            onClick={handleContinue}
            className='w-full'
            disabled={!selectedRole || isUpdating}
            size='lg'
          >
            {isUpdating ? 'Updating...' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}

