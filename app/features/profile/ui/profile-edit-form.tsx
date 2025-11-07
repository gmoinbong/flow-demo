'use client';

import { useState } from 'react';
import { useUpdateProfile } from '../lib/use-profile';
import { Button } from '@/app/shared/ui/button';
import { Input } from '@/app/shared/ui/input';
import { Label } from '@/app/shared/ui/label';
import { Textarea } from '@/app/shared/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/shared/ui/card';
import type { Profile } from '../lib/profile-api';
import { useToast } from '@/app/shared/hooks/use-toast';

interface ProfileEditFormProps {
  profile: Profile;
}

export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const { toast } = useToast();
  const updateProfile = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    displayName: profile.displayName || '',
    bio: profile.bio || '',
    avatarUrl: profile.avatarUrl || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfile.mutateAsync({
        firstName: formData.firstName.trim() || undefined,
        lastName: formData.lastName.trim() || undefined,
        displayName: formData.displayName.trim() || undefined,
        bio: formData.bio.trim() || undefined,
        avatarUrl: formData.avatarUrl.trim() || undefined,
      });

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });

      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      displayName: profile.displayName || '',
      bio: profile.bio || '',
      avatarUrl: profile.avatarUrl || '',
    });
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>
            Update your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Update your personal information and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <Label htmlFor='firstName'>First Name</Label>
              <Input
                id='firstName'
                value={formData.firstName}
                onChange={e =>
                  setFormData(prev => ({ ...prev, firstName: e.target.value }))
                }
                placeholder='John'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='lastName'>Last Name</Label>
              <Input
                id='lastName'
                value={formData.lastName}
                onChange={e =>
                  setFormData(prev => ({ ...prev, lastName: e.target.value }))
                }
                placeholder='Doe'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='displayName'>Display Name</Label>
            <Input
              id='displayName'
              value={formData.displayName}
              onChange={e =>
                setFormData(prev => ({ ...prev, displayName: e.target.value }))
              }
              placeholder='John Doe'
            />
            <p className='text-xs text-muted-foreground'>
              This is how your name will appear to others
            </p>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='bio'>Bio</Label>
            <Textarea
              id='bio'
              value={formData.bio}
              onChange={e =>
                setFormData(prev => ({ ...prev, bio: e.target.value }))
              }
              placeholder='Tell us about yourself...'
              rows={4}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='avatarUrl'>Avatar URL</Label>
            <Input
              id='avatarUrl'
              type='url'
              value={formData.avatarUrl}
              onChange={e =>
                setFormData(prev => ({ ...prev, avatarUrl: e.target.value }))
              }
              placeholder='https://example.com/avatar.jpg'
            />
          </div>

          <div className='flex gap-4'>
            <Button type='submit' disabled={updateProfile.isPending}>
              {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={handleCancel}
              disabled={updateProfile.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
