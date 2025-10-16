'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  XCircle,
  FileText,
  DollarSign,
  Calendar,
  Target,
} from 'lucide-react';
import { acceptContract, declineContract } from '@/lib/auth';

interface ContractAcceptanceProps {
  allocation: any;
  campaign: any;
  onAccept?: () => void;
  onDecline?: () => void;
}

export function ContractAcceptance({
  allocation,
  campaign,
  onAccept,
  onDecline,
}: ContractAcceptanceProps) {
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    if (!agreed) return;

    setIsSubmitting(true);
    try {
      acceptContract(allocation.id);
      onAccept?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async () => {
    setIsSubmitting(true);
    try {
      declineContract(allocation.id);
      onDecline?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-start justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>{campaign.name}</h2>
          <p className='text-muted-foreground mt-1'>{campaign.brand}</p>
        </div>
        <Badge variant='outline' className='text-lg px-4 py-2'>
          <DollarSign className='h-4 w-4 mr-1' />$
          {allocation.allocatedBudget.toLocaleString()}
        </Badge>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <Card className='p-4'>
          <div className='flex items-center gap-3'>
            <Calendar className='h-5 w-5 text-muted-foreground' />
            <div>
              <p className='text-sm text-muted-foreground'>Duration</p>
              <p className='font-semibold'>
                {new Date(campaign.startDate).toLocaleDateString()} -{' '}
                {new Date(campaign.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className='p-4'>
          <div className='flex items-center gap-3'>
            <Target className='h-5 w-5 text-muted-foreground' />
            <div>
              <p className='text-sm text-muted-foreground'>Target Platform</p>
              <p className='font-semibold capitalize'>
                {campaign.targetPlatform}
              </p>
            </div>
          </div>
        </Card>

        <Card className='p-4'>
          <div className='flex items-center gap-3'>
            <FileText className='h-5 w-5 text-muted-foreground' />
            <div>
              <p className='text-sm text-muted-foreground'>Content Type</p>
              <p className='font-semibold capitalize'>{campaign.contentType}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className='p-6'>
        <h3 className='font-semibold text-lg mb-4'>Campaign Objectives</h3>
        <p className='text-muted-foreground'>{campaign.objectives}</p>
      </Card>

      <Card className='p-6'>
        <h3 className='font-semibold text-lg mb-4'>Contract Terms</h3>
        <div className='space-y-4'>
          <div>
            <h4 className='font-medium mb-2'>Payment Structure</h4>
            <ul className='list-disc list-inside space-y-1 text-muted-foreground'>
              <li>
                Base allocation: ${allocation.allocatedBudget.toLocaleString()}
              </li>
              <li>
                Performance-based adjustments: Up to ±25% based on results
              </li>
              <li>Payment schedule: Net 30 days after campaign completion</li>
              <li>Minimum payout threshold: $100</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h4 className='font-medium mb-2'>Deliverables</h4>
            <ul className='list-disc list-inside space-y-1 text-muted-foreground'>
              <li>
                Create and publish {campaign.contentType} content on{' '}
                {campaign.targetPlatform}
              </li>
              <li>Use provided tracking link in all promotional content</li>
              <li>
                Maintain authentic voice while highlighting key campaign
                messages
              </li>
              <li>
                Submit content for approval before publishing (if required)
              </li>
            </ul>
          </div>

          <Separator />

          <div>
            <h4 className='font-medium mb-2'>Performance Metrics</h4>
            <ul className='list-disc list-inside space-y-1 text-muted-foreground'>
              <li>Reach: Total unique viewers/impressions</li>
              <li>Engagement: Likes, comments, shares, saves</li>
              <li>Conversions: Click-throughs and actions via tracking link</li>
              <li>Budget reallocation based on comparative performance</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h4 className='font-medium mb-2'>Terms & Conditions</h4>
            <ul className='list-disc list-inside space-y-1 text-muted-foreground'>
              <li>
                Content must comply with platform guidelines and FTC disclosure
                requirements
              </li>
              <li>Brand reserves the right to request content modifications</li>
              <li>
                Creator retains content ownership; brand receives usage rights
              </li>
              <li>Either party may terminate with 7 days notice</li>
              <li>
                Confidentiality agreement applies to campaign strategy and
                performance data
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className='p-6 bg-muted/50'>
        <div className='flex items-start gap-3'>
          <Checkbox
            id='agree'
            checked={agreed}
            onCheckedChange={checked => setAgreed(checked as boolean)}
          />
          <label
            htmlFor='agree'
            className='text-sm leading-relaxed cursor-pointer'
          >
            I have read and agree to the contract terms outlined above. I
            understand the payment structure, deliverables, and performance
            expectations. I agree to use the provided tracking link and comply
            with all platform guidelines and disclosure requirements.
          </label>
        </div>
      </Card>

      <div className='flex gap-4'>
        <Button
          onClick={handleAccept}
          disabled={!agreed || isSubmitting}
          className='flex-1'
          size='lg'
        >
          <CheckCircle2 className='h-5 w-5 mr-2' />
          Accept Contract
        </Button>
        <Button
          onClick={handleDecline}
          variant='outline'
          disabled={isSubmitting}
          className='flex-1 bg-transparent'
          size='lg'
        >
          <XCircle className='h-5 w-5 mr-2' />
          Decline
        </Button>
      </div>
    </div>
  );
}
