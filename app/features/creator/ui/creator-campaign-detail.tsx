'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/shared/ui/card';
import { Button } from '@/app/shared/ui/button';
import { Badge } from '@/app/shared/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/shared/ui/tabs';
import { Progress } from '@/app/shared/ui/progress';
import { Textarea } from '@/app/shared/ui/textarea';
import { Label } from '@/app/shared/ui/label';
import { Input } from '@/app/shared/ui/input';
import {
  ArrowLeft,
  DollarSign,
  Eye,
  Heart,
  TrendingUp,
  LinkIcon,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Target,
} from 'lucide-react';
import Link from 'next/link';
import type { Campaign, CampaignAllocation } from '@/app/types';

interface CreatorCampaignDetailProps {
  campaign: Campaign;
  allocation: CampaignAllocation & {
    contentSubmitted?: boolean;
    contentUrl?: string;
    contentNotes?: string;
    contentSubmittedAt?: string;
  };
  daysRemaining: number;
  campaignProgress: number;
  onSubmitContent: (contentUrl: string, contentNotes: string) => Promise<void>;
}

export function CreatorCampaignDetail({
  campaign,
  allocation,
  daysRemaining,
  campaignProgress,
  onSubmitContent,
}: CreatorCampaignDetailProps) {
  const [contentUrl, setContentUrl] = useState('');
  const [contentNotes, setContentNotes] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleContentSubmit = async () => {
    if (!contentUrl || !allocation) return;

    setUploading(true);
    try {
      await onSubmitContent(contentUrl, contentNotes);
      setContentUrl('');
      setContentNotes('');
      alert('Content submitted successfully!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <div className='border-b bg-card'>
        <div className='container mx-auto px-6 py-4'>
          <div className='flex items-center gap-4 mb-4'>
            <Link href='/creator/dashboard'>
              <Button variant='ghost' size='sm'>
                <ArrowLeft className='w-4 h-4 mr-2' />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className='flex items-start justify-between'>
            <div>
              <h1 className='text-3xl font-bold'>{campaign.name}</h1>
              <p className='text-muted-foreground mt-2'>{campaign.description}</p>
            </div>
            <Badge
              variant={allocation.status === 'active' ? 'default' : 'secondary'}
              className='text-sm'
            >
              {allocation.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-6 py-8'>
        {/* Stats Overview */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Your Earnings</CardTitle>
              <DollarSign className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                ${allocation.currentBudget.toLocaleString()}
              </div>
              <p className='text-xs text-muted-foreground'>
                {allocation.currentBudget > allocation.allocatedBudget ? '+' : ''}
                {(
                  ((allocation.currentBudget - allocation.allocatedBudget) /
                    allocation.allocatedBudget) *
                  100
                ).toFixed(1)}
                % from initial
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Reach</CardTitle>
              <Eye className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {allocation.performance.reach.toLocaleString()}
              </div>
              <p className='text-xs text-muted-foreground'>Total impressions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Engagement</CardTitle>
              <Heart className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {allocation.performance.engagement}%
              </div>
              <p className='text-xs text-muted-foreground'>Engagement rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Conversions</CardTitle>
              <TrendingUp className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {allocation.performance.conversions}
              </div>
              <p className='text-xs text-muted-foreground'>
                {allocation.performance.ctr.toFixed(2)}% CTR
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Progress */}
        <Card className='mb-8'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle>Campaign Progress</CardTitle>
                <CardDescription>
                  {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Campaign ended'}
                </CardDescription>
              </div>
              <div className='text-right'>
                <p className='text-sm text-muted-foreground'>
                  {new Date(campaign.startDate).toLocaleDateString()} -{' '}
                  {new Date(campaign.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={campaignProgress} className='h-2' />
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue='overview' className='space-y-6'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='content'>Content</TabsTrigger>
            <TabsTrigger value='tracking'>Tracking</TabsTrigger>
            <TabsTrigger value='contract'>Contract</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value='overview' className='space-y-6'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    {campaign.goals.map((goal, index) => (
                      <div key={index} className='flex items-center gap-2'>
                        <Target className='w-4 h-4 text-primary' />
                        <span>{goal}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Target Audience</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-sm'>{campaign.targetAudience}</p>
                  <div className='mt-4'>
                    <p className='text-sm font-medium mb-2'>Platforms</p>
                    <div className='flex gap-2'>
                      {campaign.platforms.map(platform => (
                        <Badge key={platform} variant='outline'>
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>
                  How you're performing compared to campaign goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-sm font-medium'>Reach Goal</span>
                      <span className='text-sm text-muted-foreground'>
                        {allocation.performance.reach.toLocaleString()} / 15,000
                      </span>
                    </div>
                    <Progress value={(allocation.performance.reach / 15000) * 100} />
                  </div>
                  <div>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-sm font-medium'>Engagement Goal</span>
                      <span className='text-sm text-muted-foreground'>
                        {allocation.performance.engagement}% / 3.5%
                      </span>
                    </div>
                    <Progress value={(allocation.performance.engagement / 3.5) * 100} />
                  </div>
                  <div>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-sm font-medium'>Conversion Goal</span>
                      <span className='text-sm text-muted-foreground'>
                        {allocation.performance.conversions} / 100
                      </span>
                    </div>
                    <Progress value={(allocation.performance.conversions / 100) * 100} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value='content' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Submit Content</CardTitle>
                <CardDescription>Upload your content for brand approval</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='contentUrl'>Content URL</Label>
                  <Input
                    id='contentUrl'
                    placeholder='https://instagram.com/p/...'
                    value={contentUrl}
                    onChange={e => setContentUrl(e.target.value)}
                  />
                  <p className='text-xs text-muted-foreground'>
                    Paste the link to your Instagram post, TikTok video, or YouTube video
                  </p>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='contentNotes'>Notes (Optional)</Label>
                  <Textarea
                    id='contentNotes'
                    placeholder='Add any notes about your content...'
                    value={contentNotes}
                    onChange={e => setContentNotes(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button onClick={handleContentSubmit} disabled={!contentUrl || uploading}>
                  <Upload className='w-4 h-4 mr-2' />
                  {uploading ? 'Submitting...' : 'Submit Content'}
                </Button>
              </CardContent>
            </Card>

            {allocation.contentSubmitted && (
              <Card>
                <CardHeader>
                  <CardTitle>Submitted Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='flex items-start gap-4 p-4 border rounded-lg'>
                      <CheckCircle className='w-5 h-5 text-green-600 flex-shrink-0 mt-0.5' />
                      <div className='flex-1'>
                        <p className='font-medium'>Content Submitted</p>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Submitted on{' '}
                          {allocation.contentSubmittedAt &&
                            new Date(allocation.contentSubmittedAt).toLocaleDateString()}
                        </p>
                        {allocation.contentUrl && (
                          <a
                            href={allocation.contentUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-sm text-primary hover:underline mt-2 inline-block'
                          >
                            View Content →
                          </a>
                        )}
                        {allocation.contentNotes && (
                          <p className='text-sm mt-2 text-muted-foreground'>
                            {allocation.contentNotes}
                          </p>
                        )}
                      </div>
                      <Badge variant='secondary'>Pending Review</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tracking Tab */}
          <TabsContent value='tracking' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Your Tracking Link</CardTitle>
                <CardDescription>
                  Share this link to track clicks and conversions
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='bg-muted p-4 rounded-lg'>
                  <div className='flex items-center gap-2'>
                    <LinkIcon className='w-4 h-4 text-muted-foreground flex-shrink-0' />
                    <code className='text-sm flex-1 break-all'>
                      {allocation.trackingLink}
                    </code>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => {
                        navigator.clipboard.writeText(allocation.trackingLink || '');
                        alert('Link copied to clipboard!');
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                <div className='bg-blue-50 border border-blue-200 p-4 rounded-lg'>
                  <div className='flex items-start gap-2'>
                    <AlertCircle className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' />
                    <div>
                      <p className='text-sm font-medium text-blue-900'>
                        How to use your tracking link
                      </p>
                      <ul className='text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside'>
                        <li>Add this link to your bio or content description</li>
                        <li>All clicks and conversions will be tracked automatically</li>
                        <li>Your earnings may increase based on performance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tracking Analytics</CardTitle>
                <CardDescription>Real-time performance data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='grid grid-cols-3 gap-4'>
                    <div className='text-center p-4 border rounded-lg'>
                      <p className='text-2xl font-bold'>
                        {allocation.performance.reach.toLocaleString()}
                      </p>
                      <p className='text-xs text-muted-foreground mt-1'>Total Clicks</p>
                    </div>
                    <div className='text-center p-4 border rounded-lg'>
                      <p className='text-2xl font-bold'>
                        {allocation.performance.conversions}
                      </p>
                      <p className='text-xs text-muted-foreground mt-1'>Conversions</p>
                    </div>
                    <div className='text-center p-4 border rounded-lg'>
                      <p className='text-2xl font-bold'>
                        {allocation.performance.ctr.toFixed(2)}%
                      </p>
                      <p className='text-xs text-muted-foreground mt-1'>Conversion Rate</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contract Tab */}
          <TabsContent value='contract' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Contract Details</CardTitle>
                <CardDescription>Review your agreement with the brand</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {allocation.contractAccepted ? (
                  <div className='bg-green-50 border border-green-200 p-4 rounded-lg flex items-start gap-2'>
                    <CheckCircle className='w-5 h-5 text-green-600 flex-shrink-0 mt-0.5' />
                    <div>
                      <p className='text-sm font-medium text-green-900'>
                        Contract Accepted
                      </p>
                      <p className='text-xs text-green-700 mt-1'>
                        Accepted on{' '}
                        {allocation.contractAcceptedAt &&
                          new Date(allocation.contractAcceptedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className='bg-orange-50 border border-orange-200 p-4 rounded-lg flex items-start gap-2'>
                    <Clock className='w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5' />
                    <div>
                      <p className='text-sm font-medium text-orange-900'>
                        Contract Pending
                      </p>
                      <p className='text-xs text-orange-700 mt-1'>
                        Please review and accept the contract to proceed
                      </p>
                    </div>
                  </div>
                )}

                <div className='space-y-3 pt-4'>
                  <div className='flex justify-between py-2 border-b'>
                    <span className='text-sm font-medium'>Campaign Budget</span>
                    <span className='text-sm'>
                      ${allocation.allocatedBudget.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex justify-between py-2 border-b'>
                    <span className='text-sm font-medium'>Payment Terms</span>
                    <span className='text-sm'>Net 30 after campaign completion</span>
                  </div>
                  <div className='flex justify-between py-2 border-b'>
                    <span className='text-sm font-medium'>Content Rights</span>
                    <span className='text-sm'>Brand may repost with credit</span>
                  </div>
                  <div className='flex justify-between py-2 border-b'>
                    <span className='text-sm font-medium'>Exclusivity Period</span>
                    <span className='text-sm'>30 days from campaign start</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

