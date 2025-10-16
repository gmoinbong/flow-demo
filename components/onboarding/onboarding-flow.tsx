'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { BarChart3, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { getCurrentUser, setCurrentUser } from '@/lib/auth';

const brandSteps = [
  {
    id: 1,
    title: 'Company Details',
    description: 'Tell us about your business',
  },
  {
    id: 2,
    title: 'Campaign Goals',
    description: 'What do you want to achieve?',
  },
  {
    id: 3,
    title: 'Target Audience',
    description: 'Who is your ideal customer?',
  },
  {
    id: 4,
    title: 'Budget & Timeline',
    description: 'Set your campaign parameters',
  },
];

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    industry: '',
    website: '',
    description: '',
    goals: [] as string[],
    targetAge: '',
    targetGender: '',
    targetInterests: '',
    budget: '',
    timeline: '',
  });
  const router = useRouter();
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    if (user?.role === 'creator') {
      router.push('/onboarding/creator');
    }
  }, [user, router]);

  const progress = (currentStep / brandSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < brandSteps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      if (user) {
        setCurrentUser({ ...user, onboardingComplete: true });
      }
      router.push('/dashboard');
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

  const toggleGoal = (goal: string) => {
    const currentGoals = formData.goals;
    if (currentGoals.includes(goal)) {
      updateFormData(
        'goals',
        currentGoals.filter(g => g !== goal)
      );
    } else {
      updateFormData('goals', [...currentGoals, goal]);
    }
  };

  if (user?.role === 'creator') {
    return null;
  }

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
          Welcome to InfluenceHub
        </h1>
        <p className='text-muted-foreground'>
          Let's set up your account to get the best recommendations
        </p>
      </div>

      {/* Progress */}
      <div className='mb-8'>
        <div className='flex justify-between text-sm text-muted-foreground mb-2'>
          <span>
            Step {currentStep} of {brandSteps.length}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className='h-2' />
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{brandSteps[currentStep - 1].title}</CardTitle>
          <CardDescription>
            {brandSteps[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {currentStep === 1 && (
            <>
              <div className='space-y-2'>
                <Label>Industry</Label>
                <Select
                  onValueChange={value => updateFormData('industry', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select your industry' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='fashion'>Fashion & Beauty</SelectItem>
                    <SelectItem value='tech'>Technology</SelectItem>
                    <SelectItem value='food'>Food & Beverage</SelectItem>
                    <SelectItem value='fitness'>Health & Fitness</SelectItem>
                    <SelectItem value='travel'>Travel & Lifestyle</SelectItem>
                    <SelectItem value='finance'>Finance</SelectItem>
                    <SelectItem value='other'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='website'>Website URL</Label>
                <Input
                  id='website'
                  placeholder='https://yourcompany.com'
                  value={formData.website}
                  onChange={e => updateFormData('website', e.target.value)}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>Company Description</Label>
                <Textarea
                  id='description'
                  placeholder='Tell us about your company and what makes it unique...'
                  value={formData.description}
                  onChange={e => updateFormData('description', e.target.value)}
                  rows={4}
                />
              </div>
            </>
          )}

          {currentStep === 2 && (
            <div className='space-y-4'>
              <Label>
                What are your main campaign goals? (Select all that apply)
              </Label>
              {[
                'Increase brand awareness',
                'Drive website traffic',
                'Generate leads',
                'Boost sales',
                'Launch new product',
                'Build community',
              ].map(goal => (
                <div key={goal} className='flex items-center space-x-2'>
                  <Checkbox
                    id={goal}
                    checked={formData.goals.includes(goal)}
                    onCheckedChange={() => toggleGoal(goal)}
                  />
                  <Label htmlFor={goal} className='cursor-pointer'>
                    {goal}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {currentStep === 3 && (
            <>
              <div className='space-y-2'>
                <Label>Target Age Group</Label>
                <Select
                  onValueChange={value => updateFormData('targetAge', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select age group' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='18-24'>18-24</SelectItem>
                    <SelectItem value='25-34'>25-34</SelectItem>
                    <SelectItem value='35-44'>35-44</SelectItem>
                    <SelectItem value='45-54'>45-54</SelectItem>
                    <SelectItem value='55+'>55+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label>Target Gender</Label>
                <Select
                  onValueChange={value => updateFormData('targetGender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select target gender' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All genders</SelectItem>
                    <SelectItem value='female'>Female</SelectItem>
                    <SelectItem value='male'>Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='interests'>Target Interests & Keywords</Label>
                <Textarea
                  id='interests'
                  placeholder='e.g., fitness, healthy lifestyle, workout gear, nutrition...'
                  value={formData.targetInterests}
                  onChange={e =>
                    updateFormData('targetInterests', e.target.value)
                  }
                  rows={3}
                />
              </div>
            </>
          )}

          {currentStep === 4 && (
            <>
              <div className='space-y-2'>
                <Label>Monthly Budget Range</Label>
                <Select
                  onValueChange={value => updateFormData('budget', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select budget range' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='1000-5000'>$1,000 - $5,000</SelectItem>
                    <SelectItem value='5000-10000'>$5,000 - $10,000</SelectItem>
                    <SelectItem value='10000-25000'>
                      $10,000 - $25,000
                    </SelectItem>
                    <SelectItem value='25000-50000'>
                      $25,000 - $50,000
                    </SelectItem>
                    <SelectItem value='50000+'>$50,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label>Campaign Timeline</Label>
                <Select
                  onValueChange={value => updateFormData('timeline', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='When do you want to start?' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='immediately'>Immediately</SelectItem>
                    <SelectItem value='1-2weeks'>In 1-2 weeks</SelectItem>
                    <SelectItem value='1month'>In 1 month</SelectItem>
                    <SelectItem value='2-3months'>In 2-3 months</SelectItem>
                  </SelectContent>
                </Select>
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
          {currentStep === brandSteps.length ? (
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
