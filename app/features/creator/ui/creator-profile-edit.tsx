'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/shared/ui/card';
import { Button } from '@/app/shared/ui/button';
import { Input } from '@/app/shared/ui/input';
import { Label } from '@/app/shared/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/shared/ui/avatar';
import { Checkbox } from '@/app/shared/ui/checkbox';
import { getCurrentUser, setCurrentUser } from '@/app/features/auth';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Instagram, Youtube, Save } from 'lucide-react';
import Link from 'next/link';

export function CreatorProfileEdit() {
  const [user, setUser] = useState(getCurrentUser());
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    instagramHandle: user?.instagramHandle || '',
    instagramFollowers: user?.followers?.instagram?.toString() || '',
    tiktokHandle: user?.tiktokHandle || '',
    tiktokFollowers: user?.followers?.tiktok?.toString() || '',
    youtubeHandle: user?.youtubeHandle || '',
    youtubeSubscribers: user?.followers?.youtube?.toString() || '',
    niche: user?.niche || [],
    bio: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'creator') {
      router.push('/login');
    }
  }, [user, router]);

  const handleSave = () => {
    if (user) {
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        instagramHandle: formData.instagramHandle,
        tiktokHandle: formData.tiktokHandle,
        youtubeHandle: formData.youtubeHandle,
        niche: formData.niche,
        followers: {
          instagram: Number.parseInt(formData.instagramFollowers) || 0,
          tiktok: Number.parseInt(formData.tiktokFollowers) || 0,
          youtube: Number.parseInt(formData.youtubeSubscribers) || 0,
        },
      };
      setCurrentUser(updatedUser);
      setUser(updatedUser);
      alert('Profile updated successfully!');
    }
  };

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleNiche = (niche: string) => {
    const currentNiches = formData.niche;
    if (currentNiches.includes(niche)) {
      updateFormData(
        'niche',
        currentNiches.filter(n => n !== niche)
      );
    } else {
      updateFormData('niche', [...currentNiches, niche]);
    }
  };

  if (!user || user.role !== 'creator') {
    return null;
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <div className='border-b bg-card'>
        <div className='container mx-auto px-6 py-4'>
          <div className='flex items-center gap-4'>
            <Link href='/creator/dashboard'>
              <Button variant='ghost' size='sm'>
                <ArrowLeft className='w-4 h-4 mr-2' />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className='text-2xl font-bold'>Edit Profile</h1>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-6 py-8 max-w-4xl'>
        <div className='space-y-6'>
          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Update your profile photo</CardDescription>
            </CardHeader>
            <CardContent className='flex items-center gap-6'>
              <Avatar className='h-24 w-24'>
                <AvatarImage src='/placeholder.svg' alt={user.name} />
                <AvatarFallback className='text-2xl'>
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant='outline'>Upload New Photo</Button>
                <p className='text-xs text-muted-foreground mt-2'>
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Full Name</Label>
                <Input
                  id='name'
                  value={formData.name}
                  onChange={e => updateFormData('name', e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  value={formData.email}
                  onChange={e => updateFormData('email', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media Accounts</CardTitle>
              <CardDescription>
                Connect and update your social profiles
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='instagram'
                    className='flex items-center gap-2'
                  >
                    <Instagram className='w-4 h-4' />
                    Instagram Handle
                  </Label>
                  <Input
                    id='instagram'
                    placeholder='@yourusername'
                    value={formData.instagramHandle}
                    onChange={e =>
                      updateFormData('instagramHandle', e.target.value)
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='instagramFollowers'>
                    Instagram Followers
                  </Label>
                  <Input
                    id='instagramFollowers'
                    type='number'
                    placeholder='10000'
                    value={formData.instagramFollowers}
                    onChange={e =>
                      updateFormData('instagramFollowers', e.target.value)
                    }
                  />
                </div>
              </div>

              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='tiktok' className='flex items-center gap-2'>
                    <svg
                      className='w-4 h-4'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                    >
                      <path d='M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z' />
                    </svg>
                    TikTok Handle
                  </Label>
                  <Input
                    id='tiktok'
                    placeholder='@yourusername'
                    value={formData.tiktokHandle}
                    onChange={e =>
                      updateFormData('tiktokHandle', e.target.value)
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='tiktokFollowers'>TikTok Followers</Label>
                  <Input
                    id='tiktokFollowers'
                    type='number'
                    placeholder='50000'
                    value={formData.tiktokFollowers}
                    onChange={e =>
                      updateFormData('tiktokFollowers', e.target.value)
                    }
                  />
                </div>
              </div>

              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='youtube' className='flex items-center gap-2'>
                    <Youtube className='w-4 h-4' />
                    YouTube Channel
                  </Label>
                  <Input
                    id='youtube'
                    placeholder='@yourchannel'
                    value={formData.youtubeHandle}
                    onChange={e =>
                      updateFormData('youtubeHandle', e.target.value)
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='youtubeSubscribers'>
                    YouTube Subscribers
                  </Label>
                  <Input
                    id='youtubeSubscribers'
                    type='number'
                    placeholder='25000'
                    value={formData.youtubeSubscribers}
                    onChange={e =>
                      updateFormData('youtubeSubscribers', e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Niches */}
          <Card>
            <CardHeader>
              <CardTitle>Content Niches</CardTitle>
              <CardDescription>
                Select the categories that best describe your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {[
                  'Fashion & Beauty',
                  'Health & Fitness',
                  'Food & Cooking',
                  'Travel & Lifestyle',
                  'Technology',
                  'Gaming',
                  'Business & Finance',
                  'Education',
                  'Entertainment',
                  'Sports',
                ].map(niche => (
                  <div key={niche} className='flex items-center space-x-2'>
                    <Checkbox
                      id={niche}
                      checked={formData.niche.includes(niche)}
                      onCheckedChange={() => toggleNiche(niche)}
                    />
                    <Label htmlFor={niche} className='cursor-pointer'>
                      {niche}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className='flex justify-end gap-4'>
            <Link href='/creator/dashboard'>
              <Button variant='outline'>Cancel</Button>
            </Link>
            <Button onClick={handleSave}>
              <Save className='w-4 h-4 mr-2' />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
