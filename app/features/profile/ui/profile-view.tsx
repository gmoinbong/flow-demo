'use client';

import { useProfile } from '../lib/use-profile';
import { useAuth } from '@/app/features/auth';
import { Avatar, AvatarImage, AvatarFallback } from '@/app/shared/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/shared/ui/card';
import { Skeleton } from '@/app/shared/ui/skeleton';
import { Badge } from '@/app/shared/ui/badge';
import { ProfileEditForm } from './profile-edit-form';
import type { Profile, Brand } from '../lib/profile-api';

function ProfileSkeleton() {
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-4 w-64 mt-2' />
        </CardHeader>
        <CardContent className='space-y-4'>
          <Skeleton className='h-24 w-24 rounded-full' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-10 w-full' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-10 w-full' />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileInfo({ 
  profile, 
  brand,
  email 
}: { 
  profile: Profile; 
  brand?: Brand;
  email?: string;
}) {
  const displayName = profile.displayName || 
    (profile.firstName && profile.lastName 
      ? `${profile.firstName} ${profile.lastName}` 
      : profile.firstName || profile.lastName || 'User');

  const initials = profile.firstName && profile.lastName
    ? `${profile.firstName[0]}${profile.lastName[0]}`
    : profile.firstName?.[0] || profile.lastName?.[0] || 'U';

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Your personal information and account details
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='flex items-center gap-6'>
            <Avatar className='size-24'>
              {profile.avatarUrl && (
                <AvatarImage src={profile.avatarUrl} alt={displayName} />
              )}
              <AvatarFallback className='text-2xl'>
                {initials.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <h2 className='text-2xl font-semibold mb-1'>{displayName}</h2>
              <div className='flex items-center gap-2'>
                <Badge variant={profile.status === 'active' ? 'default' : 'secondary'}>
                  {profile.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className='grid md:grid-cols-2 gap-6 pt-6 border-t'>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-muted-foreground'>
                First Name
              </label>
              <p className='text-sm font-medium'>
                {profile.firstName || 'Not set'}
              </p>
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-muted-foreground'>
                Last Name
              </label>
              <p className='text-sm font-medium'>
                {profile.lastName || 'Not set'}
              </p>
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-muted-foreground'>
                Email
              </label>
              <p className='text-sm font-medium'>{email || 'Not available'}</p>
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-muted-foreground'>
                Display Name
              </label>
              <p className='text-sm font-medium'>
                {profile.displayName || 'Not set'}
              </p>
            </div>
            {profile.bio && (
              <div className='space-y-2 md:col-span-2'>
                <label className='text-sm font-medium text-muted-foreground'>
                  Bio
                </label>
                <p className='text-sm'>{profile.bio}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {brand && (
        <Card>
          <CardHeader>
            <CardTitle>Brand Information</CardTitle>
            <CardDescription>
              Your company and brand details
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-muted-foreground'>
                  Company Name
                </label>
                <p className='text-sm font-medium'>{brand.name}</p>
              </div>
              {brand.companySize && (
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Company Size
                  </label>
                  <p className='text-sm font-medium'>{brand.companySize}</p>
                </div>
              )}
              {brand.userRole && (
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Your Role
                  </label>
                  <p className='text-sm font-medium'>{brand.userRole}</p>
                </div>
              )}
              {brand.brandType && (
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Brand Type
                  </label>
                  <p className='text-sm font-medium'>{brand.brandType}</p>
                </div>
              )}
              {brand.websiteUrl && (
                <div className='space-y-2 md:col-span-2'>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Website
                  </label>
                  <a
                    href={brand.websiteUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-sm font-medium text-primary hover:underline'
                  >
                    {brand.websiteUrl}
                  </a>
                </div>
              )}
              {brand.description && (
                <div className='space-y-2 md:col-span-2'>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Description
                  </label>
                  <p className='text-sm'>{brand.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function ProfileView() {
  const { data, isLoading, error } = useProfile();
  const { user } = useAuth();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <p className='text-sm text-destructive'>
            Failed to load profile. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <p className='text-sm text-muted-foreground'>
            No profile data available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      <ProfileInfo 
        profile={data.profile} 
        brand={data.brand} 
        email={user?.email}
      />
      <ProfileEditForm profile={data.profile} />
    </div>
  );
}

