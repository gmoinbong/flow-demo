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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/shared/ui/select';
import { Checkbox } from '@/app/shared/ui/checkbox';
import { Progress } from '@/app/shared/ui/progress';
import { useRouter } from 'next/navigation';
import { BarChart3, ArrowRight, ArrowLeft, CheckCircle, X } from 'lucide-react';
import Link from 'next/link';
import {
  saveCampaign,
  createAllocationsForCampaign,
} from '@/app/features/campaigns/lib/campaign-api';
import { type Campaign } from '@/app/types';
import { useAuth } from '@/app/features/auth/lib/use-auth';

const steps = [
  {
    id: 1,
    title: 'Campaign Details',
    description: 'Basic information about your campaign',
  },
  {
    id: 2,
    title: 'Target Audience',
    description: 'Define your ideal audience',
  },
  {
    id: 3,
    title: 'Content Requirements',
    description: 'Specify deliverables and guidelines',
  },
  {
    id: 4,
    title: 'Budget & Timeline',
    description: 'Set budget and campaign timeline',
  },
];

export function CampaignCreationFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    objectives: [] as string[],
    targetAge: '',
    targetGender: '',
    targetLocation: '',
    targetInterests: '',
    audienceSize: '',
    contentTypes: [] as string[],
    deliverables: '',
    guidelines: '',
    timeline: '',
    budget: '',
    paymentTerms: '',
    kpis: [] as string[],
  });
  const router = useRouter();
  const { user } = useAuth();

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      if (!user) {
        alert('Please log in to create a campaign');
        return;
      }

      // Determine platforms from content types
      const platforms: string[] = [];
      if (formData.contentTypes.some(t => t.includes('Instagram')))
        platforms.push('Instagram');
      if (formData.contentTypes.some(t => t.includes('TikTok')))
        platforms.push('TikTok');
      if (formData.contentTypes.some(t => t.includes('YouTube')))
        platforms.push('YouTube');

      // Calculate dates
      const startDate = new Date();
      const endDate = new Date();
      if (formData.timeline.includes('week')) {
        const weeks = Number.parseInt(formData.timeline) || 1;
        endDate.setDate(endDate.getDate() + weeks * 7);
      } else if (formData.timeline.includes('month')) {
        const months = Number.parseInt(formData.timeline) || 1;
        endDate.setMonth(endDate.getMonth() + months);
      } else {
        endDate.setMonth(endDate.getMonth() + 1); // default 1 month
      }

      const campaign: Campaign = {
        id: `campaign_${Date.now()}`,
        brandId: user.id,
        name: formData.name,
        description: formData.description,
        budget: Number.parseInt(
          formData.budget.split('-')[0]?.replace(/\D/g, '') || '10000'
        ),
        goals: formData.objectives,
        targetAudience: formData.targetInterests,
        platforms,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      // Save campaign
      saveCampaign(campaign);

      // Match creators and create allocations
      const allocations = createAllocationsForCampaign(campaign, 5);

      router.push(`/campaigns`);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCheckboxChange = (
    field: string,
    value: string,
    checked: boolean
  ) => {
    const currentArray =
      (formData[field as keyof typeof formData] as string[]) || [];
    if (checked) {
      updateFormData(field, [...currentArray, value]);
    } else {
      updateFormData(
        field,
        currentArray.filter(item => item !== value)
      );
    }
  };

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const currentStepData = steps[currentStep - 1] || steps[0];

  return (
    <div className='max-w-4xl mx-auto p-6'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div className='flex items-center space-x-4'>
          <Link href='/campaigns' className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center'>
              <BarChart3 className='w-5 h-5 text-white' />
            </div>
            <span className='text-xl font-bold text-foreground'>
              InfluenceHub
            </span>
          </Link>
          <div className='text-muted-foreground'>/</div>
          <h1 className='text-2xl font-bold text-foreground'>
            Create Campaign
          </h1>
        </div>
        <Button variant='outline' asChild>
          <Link href='/campaigns'>
            <X className='w-4 h-4 mr-2' />
            Cancel
          </Link>
        </Button>
      </div>

      {/* Progress */}
      <div className='mb-8'>
        <div className='flex justify-between text-sm text-muted-foreground mb-2'>
          <span>
            Step {currentStep} of {steps.length}: {currentStepData.title}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className='h-2' />
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{currentStepData.title}</CardTitle>
          <CardDescription>{currentStepData.description}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {currentStep === 1 && (
            <>
              <div className='space-y-2'>
                <Label htmlFor='name'>Campaign Name *</Label>
                <Input
                  id='name'
                  placeholder='e.g., Summer Collection Launch 2024'
                  value={formData.name}
                  onChange={e => updateFormData('name', e.target.value)}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>Campaign Description *</Label>
                <Textarea
                  id='description'
                  placeholder='Describe your campaign goals, key messages, and what makes your brand unique...'
                  value={formData.description}
                  onChange={e => updateFormData('description', e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className='space-y-4'>
                <Label>Campaign Objectives (Select all that apply)</Label>
                {[
                  'Increase brand awareness',
                  'Drive website traffic',
                  'Generate leads',
                  'Boost sales',
                  'Launch new product',
                  'Build community engagement',
                  'Improve brand sentiment',
                ].map(objective => (
                  <div key={objective} className='flex items-center space-x-2'>
                    <Checkbox
                      id={objective}
                      checked={formData.objectives.includes(objective)}
                      onCheckedChange={checked =>
                        handleCheckboxChange(
                          'objectives',
                          objective,
                          checked as boolean
                        )
                      }
                    />
                    <Label htmlFor={objective} className='cursor-pointer'>
                      {objective}
                    </Label>
                  </div>
                ))}
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className='grid md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <Label>Target Age Group *</Label>
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
                    onValueChange={value =>
                      updateFormData('targetGender', value)
                    }
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
              </div>

              <div className='space-y-2'>
                <Label>Target Location</Label>
                <Select
                  onValueChange={value =>
                    updateFormData('targetLocation', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select target location' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='global'>Global</SelectItem>
                    <SelectItem value='north-america'>North America</SelectItem>
                    <SelectItem value='europe'>Europe</SelectItem>
                    <SelectItem value='asia-pacific'>Asia Pacific</SelectItem>
                    <SelectItem value='custom'>Custom Locations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='interests'>Target Interests & Keywords</Label>
                <Textarea
                  id='interests'
                  placeholder='e.g., fashion, lifestyle, sustainability, beauty, fitness...'
                  value={formData.targetInterests}
                  onChange={e =>
                    updateFormData('targetInterests', e.target.value)
                  }
                  rows={3}
                />
              </div>

              <div className='space-y-2'>
                <Label>Preferred Audience Size</Label>
                <Select
                  onValueChange={value => updateFormData('audienceSize', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select audience size preference' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='micro'>
                      Micro (1K-10K followers)
                    </SelectItem>
                    <SelectItem value='mid-tier'>
                      Mid-tier (10K-100K followers)
                    </SelectItem>
                    <SelectItem value='macro'>
                      Macro (100K-1M followers)
                    </SelectItem>
                    <SelectItem value='mega'>Mega (1M+ followers)</SelectItem>
                    <SelectItem value='mixed'>Mixed (All sizes)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className='space-y-4'>
                <Label>Content Types (Select all that apply)</Label>
                {[
                  'Instagram Posts',
                  'Instagram Stories',
                  'Instagram Reels',
                  'TikTok Videos',
                  'YouTube Videos',
                  'YouTube Shorts',
                  'Blog Posts',
                  'Product Reviews',
                ].map(type => (
                  <div key={type} className='flex items-center space-x-2'>
                    <Checkbox
                      id={type}
                      checked={formData.contentTypes.includes(type)}
                      onCheckedChange={checked =>
                        handleCheckboxChange(
                          'contentTypes',
                          type,
                          checked as boolean
                        )
                      }
                    />
                    <Label htmlFor={type} className='cursor-pointer'>
                      {type}
                    </Label>
                  </div>
                ))}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='deliverables'>Specific Deliverables</Label>
                <Textarea
                  id='deliverables'
                  placeholder='e.g., 2 Instagram posts, 5 Instagram stories, 1 TikTok video...'
                  value={formData.deliverables}
                  onChange={e => updateFormData('deliverables', e.target.value)}
                  rows={3}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='guidelines'>
                  Content Guidelines & Brand Requirements
                </Label>
                <Textarea
                  id='guidelines'
                  placeholder="Include brand guidelines, hashtags to use, mentions required, content style, dos and don'ts..."
                  value={formData.guidelines}
                  onChange={e => updateFormData('guidelines', e.target.value)}
                  rows={5}
                />
              </div>
            </>
          )}

          {currentStep === 4 && (
            <>
              <div className='grid md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <Label>Total Campaign Budget *</Label>
                  <Select
                    onValueChange={value => updateFormData('budget', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select budget range' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='5000-10000'>
                        $5,000 - $10,000
                      </SelectItem>
                      <SelectItem value='10000-25000'>
                        $10,000 - $25,000
                      </SelectItem>
                      <SelectItem value='25000-50000'>
                        $25,000 - $50,000
                      </SelectItem>
                      <SelectItem value='50000-100000'>
                        $50,000 - $100,000
                      </SelectItem>
                      <SelectItem value='100000+'>$100,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label>Campaign Timeline</Label>
                  <Select
                    onValueChange={value => updateFormData('timeline', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select timeline' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='1-week'>1 week</SelectItem>
                      <SelectItem value='2-weeks'>2 weeks</SelectItem>
                      <SelectItem value='1-month'>1 month</SelectItem>
                      <SelectItem value='2-months'>2 months</SelectItem>
                      <SelectItem value='3-months'>3 months</SelectItem>
                      <SelectItem value='ongoing'>Ongoing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='space-y-2'>
                <Label>Payment Terms</Label>
                <Select
                  onValueChange={value => updateFormData('paymentTerms', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select payment terms' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='upfront'>100% Upfront</SelectItem>
                    <SelectItem value='50-50'>
                      50% Upfront, 50% on Completion
                    </SelectItem>
                    <SelectItem value='milestone'>
                      Milestone-based Payments
                    </SelectItem>
                    <SelectItem value='completion'>
                      100% on Completion
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-4'>
                <Label>Key Performance Indicators (KPIs)</Label>
                {[
                  'Reach & Impressions',
                  'Engagement Rate',
                  'Click-through Rate',
                  'Website Traffic',
                  'Lead Generation',
                  'Sales Conversion',
                  'Brand Mention Sentiment',
                ].map(kpi => (
                  <div key={kpi} className='flex items-center space-x-2'>
                    <Checkbox
                      id={kpi}
                      checked={formData.kpis.includes(kpi)}
                      onCheckedChange={checked =>
                        handleCheckboxChange('kpis', kpi, checked as boolean)
                      }
                    />
                    <Label htmlFor={kpi} className='cursor-pointer'>
                      {kpi}
                    </Label>
                  </div>
                ))}
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
          {currentStep === steps.length ? (
            <>
              Create Campaign
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
