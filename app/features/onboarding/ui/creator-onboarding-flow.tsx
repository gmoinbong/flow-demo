'use client';

import { useState } from 'react';
import { Button } from '@/app/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/shared/ui/card';
import { Input } from '@/app/shared/ui/input';
import { Label } from '@/app/shared/ui/label';
import { Textarea } from '@/app/shared/ui/textarea';
import { Checkbox } from '@/app/shared/ui/checkbox';
import { Progress } from '@/app/shared/ui/progress';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Instagram,
  Youtube,
} from 'lucide-react';
import { useAuth } from '@/app/features/auth';
import { useQueryClient } from '@tanstack/react-query';

const creatorSteps = [
  {
    id: 1,
    title: 'Social Profiles',
    description: 'Connect your social media accounts',
  },
  { id: 2, title: 'Content Niche', description: 'What content do you create?' },
  {
    id: 3,
    title: 'Audience Insights',
    description: 'Tell us about your audience',
  },
  {
    id: 4,
    title: 'Collaboration Preferences',
    description: 'What brands do you want to work with?',
  },
];

export function CreatorOnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    instagramHandle: '',
    instagramFollowers: '',
    tiktokHandle: '',
    tiktokFollowers: '',
    youtubeHandle: '',
    youtubeSubscribers: '',
    niche: [] as string[],
    bio: '',
    audienceAge: '',
    audienceGender: '',
    audienceLocation: '',
    brandPreferences: '',
    minBudget: '',
  });
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const queryClient = useQueryClient();


  if (isLoading) {
    return <div>Loading...</div>;
  }

  const progress = (currentStep / creatorSteps.length) * 100;

  const handleNext = async () => {
    if (currentStep < creatorSteps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      if (user) {
        try {
          const response = await fetch('/api/creators/complete-onboarding', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              instagramHandle: formData.instagramHandle || undefined,
              instagramFollowers: formData.instagramFollowers
                ? Number.parseInt(formData.instagramFollowers)
                : undefined,
              tiktokHandle: formData.tiktokHandle || undefined,
              tiktokFollowers: formData.tiktokFollowers
                ? Number.parseInt(formData.tiktokFollowers)
                : undefined,
              youtubeHandle: formData.youtubeHandle || undefined,
              youtubeSubscribers: formData.youtubeSubscribers
                ? Number.parseInt(formData.youtubeSubscribers)
                : undefined,
              niche: formData.niche.length > 0 ? formData.niche : undefined,
              bio: formData.bio || undefined,
              audienceLocation: formData.audienceLocation || undefined,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to complete onboarding');
          }

          queryClient.setQueryData(['auth', 'user'], {
            ...user,
            instagramHandle: formData.instagramHandle,
            tiktokHandle: formData.tiktokHandle,
            youtubeHandle: formData.youtubeHandle,
            niche: formData.niche,
            followers: {
              instagram: Number.parseInt(formData.instagramFollowers) || 0,
              tiktok: Number.parseInt(formData.tiktokFollowers) || 0,
              youtube: Number.parseInt(formData.youtubeSubscribers) || 0,
            },
            onboardingComplete: true,
          });

          await queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
          await queryClient.invalidateQueries({ queryKey: ['profile'] });

          router.push('/creator/dashboard');
        } catch (error) {
          console.error('Failed to complete onboarding:', error);
          alert(
            error instanceof Error
              ? error.message
              : 'Failed to complete onboarding. Please try again.'
          );
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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

  return (
    <div className='max-w-2xl mx-auto p-6'>
      {/* Header */}
      <div className='text-center mb-8'>
        <div className='flex items-center justify-center space-x-2 mb-4'>
          <div className='w-10 h-10 bg-primary rounded-lg flex items-center justify-center'>
            <BarChart3 className='w-6 h-6 text-white' />
          </div>
          <span className='text-2xl font-bold text-foreground'>
            InfluenceHub
          </span>
        </div>
        <h1 className='text-3xl font-bold text-foreground mb-2'>
          Welcome, Creator!
        </h1>
        <p className='text-muted-foreground'>
          Let's set up your profile to match you with great brands
        </p>
      </div>

      {/* Progress */}
      <div className='mb-8'>
        <div className='flex justify-between text-sm text-muted-foreground mb-2'>
          <span>
            Step {currentStep} of {creatorSteps.length}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className='h-2' />
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{creatorSteps[currentStep - 1].title}</CardTitle>
          <CardDescription>
            {creatorSteps[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {currentStep === 1 && (
            <>
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
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className='space-y-4'>
                <Label>
                  Select your content niches (Select all that apply)
                </Label>
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

              <div className='space-y-2'>
                <Label htmlFor='bio'>Bio / About You</Label>
                <Textarea
                  id='bio'
                  placeholder='Tell brands about your content style, values, and what makes you unique...'
                  value={formData.bio}
                  onChange={e => updateFormData('bio', e.target.value)}
                  rows={4}
                />
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className='space-y-2'>
                <Label htmlFor='audienceAge'>Primary Audience Age</Label>
                <Input
                  id='audienceAge'
                  placeholder='e.g., 18-24, 25-34'
                  value={formData.audienceAge}
                  onChange={e => updateFormData('audienceAge', e.target.value)}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='audienceGender'>Audience Gender Split</Label>
                <Input
                  id='audienceGender'
                  placeholder='e.g., 60% Female, 40% Male'
                  value={formData.audienceGender}
                  onChange={e =>
                    updateFormData('audienceGender', e.target.value)
                  }
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='audienceLocation'>Top Audience Locations</Label>
                <Input
                  id='audienceLocation'
                  placeholder='e.g., USA, UK, Canada'
                  value={formData.audienceLocation}
                  onChange={e =>
                    updateFormData('audienceLocation', e.target.value)
                  }
                />
              </div>
            </>
          )}

          {currentStep === 4 && (
            <>
              <div className='space-y-2'>
                <Label htmlFor='brandPreferences'>Brand Preferences</Label>
                <Textarea
                  id='brandPreferences'
                  placeholder='What types of brands do you want to work with? Any industries you prefer or avoid?'
                  value={formData.brandPreferences}
                  onChange={e =>
                    updateFormData('brandPreferences', e.target.value)
                  }
                  rows={4}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='minBudget'>Minimum Campaign Budget</Label>
                <Input
                  id='minBudget'
                  type='number'
                  placeholder='500'
                  value={formData.minBudget}
                  onChange={e => updateFormData('minBudget', e.target.value)}
                />
                <p className='text-xs text-muted-foreground'>
                  This helps us match you with campaigns that meet your
                  requirements
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className='flex justify-between mt-8'>
        <Button
          variant='outline'
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ArrowLeft className='w-4 h-4 mr-2' />
          Back
        </Button>

        <Button onClick={handleNext}>
          {currentStep === creatorSteps.length ? (
            <>
              Complete Setup
              <CheckCircle className='w-4 h-4 ml-2' />
            </>
          ) : (
            <>
              Next
              <ArrowRight className='w-4 h-4 ml-2' />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
