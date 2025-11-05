'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/shared/ui/card';
import { Badge } from '@/app/shared/ui/badge';
import { Button } from '@/app/shared/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/shared/ui/avatar';
import { getAllocationsByCampaign } from '@/app/features/campaigns/lib/campaign-api';
import { getMockCreators } from '@/app/features/creators/lib/creator-api';
import { type CampaignAllocation, type Creator } from '@/app/types';
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  DollarSign,
  Calendar,
  ExternalLink,
  Instagram,
  Youtube,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/shared/ui/dialog';

interface ContractManagementProps {
  campaignId: string;
}

export function ContractManagement({ campaignId }: ContractManagementProps) {
  const [allocations, setAllocations] = useState<CampaignAllocation[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [selectedAllocation, setSelectedAllocation] =
    useState<CampaignAllocation | null>(null);

  useEffect(() => {
    loadData();
  }, [campaignId]);

  const loadData = () => {
    const allocationData = getAllocationsByCampaign(campaignId);
    setAllocations(allocationData);

    const allCreators = getMockCreators();
    setCreators(allCreators);
  };

  const getCreatorById = (creatorId: string) => {
    return creators.find(c => c.id === creatorId);
  };

  const getStatusBadge = (allocation: CampaignAllocation) => {
    if (allocation.contractAccepted) {
      return <Badge className='bg-green-500'>Accepted</Badge>;
    }
    if (allocation.status === 'declined') {
      return <Badge variant='destructive'>Declined</Badge>;
    }
    return <Badge variant='outline'>Pending</Badge>;
  };

  const getStatusIcon = (allocation: CampaignAllocation) => {
    if (allocation.contractAccepted) {
      return <CheckCircle2 className='w-5 h-5 text-green-500' />;
    }
    if (allocation.status === 'declined') {
      return <XCircle className='w-5 h-5 text-red-500' />;
    }
    return <Clock className='w-5 h-5 text-yellow-500' />;
  };

  const acceptedCount = allocations.filter(a => a.contractAccepted).length;
  const pendingCount = allocations.filter(
    a => !a.contractAccepted && a.status !== 'declined'
  ).length;
  const declinedCount = allocations.filter(a => a.status === 'declined').length;

  return (
    <div className='space-y-6'>
      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>Total Contracts</p>
                <p className='text-2xl font-bold'>{allocations.length}</p>
              </div>
              <FileText className='w-8 h-8 text-muted-foreground' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>Accepted</p>
                <p className='text-2xl font-bold text-green-600'>
                  {acceptedCount}
                </p>
              </div>
              <CheckCircle2 className='w-8 h-8 text-green-500' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>Pending</p>
                <p className='text-2xl font-bold text-yellow-600'>
                  {pendingCount}
                </p>
              </div>
              <Clock className='w-8 h-8 text-yellow-500' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>Declined</p>
                <p className='text-2xl font-bold text-red-600'>
                  {declinedCount}
                </p>
              </div>
              <XCircle className='w-8 h-8 text-red-500' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contracts List */}
      <Card>
        <CardHeader>
          <CardTitle>Creator Contracts</CardTitle>
          <CardDescription>
            Manage and track all creator contracts for this campaign
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {allocations.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                <FileText className='w-12 h-12 mx-auto mb-3 opacity-50' />
                <p>No contracts yet</p>
              </div>
            ) : (
              allocations.map(allocation => {
                const creator = getCreatorById(allocation.creatorId);
                if (!creator) return null;

                return (
                  <Card key={allocation.id} className='border'>
                    <CardContent className='p-4'>
                      <div className='flex items-start justify-between'>
                        <div className='flex items-start gap-4 flex-1'>
                          <Avatar className='w-12 h-12'>
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.name}`}
                            />
                            <AvatarFallback>
                              {creator.name
                                .split(' ')
                                .map(n => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>

                          <div className='flex-1'>
                            <div className='flex items-center gap-3 mb-2'>
                              <h4 className='font-semibold text-lg'>
                                {creator.name}
                              </h4>
                              {getStatusBadge(allocation)}
                            </div>

                            <div className='flex items-center gap-4 text-sm text-muted-foreground mb-3'>
                              {creator.instagramHandle && (
                                <div className='flex items-center gap-1'>
                                  <Instagram className='w-4 h-4' />
                                  <span>@{creator.instagramHandle}</span>
                                </div>
                              )}
                              {creator.youtubeHandle && (
                                <div className='flex items-center gap-1'>
                                  <Youtube className='w-4 h-4' />
                                  <span>@{creator.youtubeHandle}</span>
                                </div>
                              )}
                            </div>

                            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                              <div>
                                <p className='text-xs text-muted-foreground mb-1'>
                                  Allocated Budget
                                </p>
                                <p className='font-semibold flex items-center gap-1'>
                                  <DollarSign className='w-3 h-3' />
                                  {allocation.allocatedBudget.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className='text-xs text-muted-foreground mb-1'>
                                  Current Budget
                                </p>
                                <p className='font-semibold flex items-center gap-1'>
                                  <DollarSign className='w-3 h-3' />
                                  {allocation.currentBudget.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className='text-xs text-muted-foreground mb-1'>
                                  Status
                                </p>
                                <div className='flex items-center gap-1'>
                                  {getStatusIcon(allocation)}
                                  <span className='text-sm font-medium'>
                                    {allocation.contractAccepted
                                      ? 'Active'
                                      : allocation.status === 'declined'
                                        ? 'Declined'
                                        : 'Pending'}
                                  </span>
                                </div>
                              </div>
                              {allocation.contractAcceptedAt && (
                                <div>
                                  <p className='text-xs text-muted-foreground mb-1'>
                                    Accepted On
                                  </p>
                                  <p className='text-sm font-medium flex items-center gap-1'>
                                    <Calendar className='w-3 h-3' />
                                    {new Date(
                                      allocation.contractAcceptedAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>

                            {allocation.trackingLink &&
                              allocation.contractAccepted && (
                                <div className='mt-3 p-2 bg-muted rounded-md'>
                                  <p className='text-xs text-muted-foreground mb-1'>
                                    Tracking Link
                                  </p>
                                  <div className='flex items-center gap-2'>
                                    <code className='text-xs flex-1 truncate'>
                                      {allocation.trackingLink}
                                    </code>
                                    <Button
                                      size='sm'
                                      variant='ghost'
                                      onClick={() =>
                                        window.open(
                                          allocation.trackingLink,
                                          '_blank'
                                        )
                                      }
                                    >
                                      <ExternalLink className='w-3 h-3' />
                                    </Button>
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => setSelectedAllocation(allocation)}
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className='max-w-2xl'>
                            <DialogHeader>
                              <DialogTitle>
                                Contract Details - {creator.name}
                              </DialogTitle>
                              <DialogDescription>
                                Review the complete contract information and
                                terms
                              </DialogDescription>
                            </DialogHeader>
                            <div className='space-y-4'>
                              <div className='grid grid-cols-2 gap-4'>
                                <div>
                                  <p className='text-sm font-medium mb-1'>
                                    Creator
                                  </p>
                                  <p className='text-sm text-muted-foreground'>
                                    {creator.name}
                                  </p>
                                </div>
                                <div>
                                  <p className='text-sm font-medium mb-1'>
                                    Email
                                  </p>
                                  <p className='text-sm text-muted-foreground'>
                                    {creator.email}
                                  </p>
                                </div>
                                <div>
                                  <p className='text-sm font-medium mb-1'>
                                    Allocated Budget
                                  </p>
                                  <p className='text-sm text-muted-foreground'>
                                    $
                                    {allocation.allocatedBudget.toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className='text-sm font-medium mb-1'>
                                    Current Budget
                                  </p>
                                  <p className='text-sm text-muted-foreground'>
                                    ${allocation.currentBudget.toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className='text-sm font-medium mb-1'>
                                    Contract Status
                                  </p>
                                  <div className='mt-1'>
                                    {getStatusBadge(allocation)}
                                  </div>
                                </div>
                                {allocation.contractAcceptedAt && (
                                  <div>
                                    <p className='text-sm font-medium mb-1'>
                                      Accepted Date
                                    </p>
                                    <p className='text-sm text-muted-foreground'>
                                      {new Date(
                                        allocation.contractAcceptedAt
                                      ).toLocaleString()}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className='border-t pt-4'>
                                <p className='text-sm font-medium mb-2'>
                                  Performance Metrics
                                </p>
                                <div className='grid grid-cols-2 gap-3'>
                                  <div className='p-3 bg-muted rounded-md'>
                                    <p className='text-xs text-muted-foreground'>
                                      Reach
                                    </p>
                                    <p className='text-lg font-semibold'>
                                      {allocation.performance.reach.toLocaleString()}
                                    </p>
                                  </div>
                                  <div className='p-3 bg-muted rounded-md'>
                                    <p className='text-xs text-muted-foreground'>
                                      Engagement
                                    </p>
                                    <p className='text-lg font-semibold'>
                                      {allocation.performance.engagement.toLocaleString()}
                                    </p>
                                  </div>
                                  <div className='p-3 bg-muted rounded-md'>
                                    <p className='text-xs text-muted-foreground'>
                                      Conversions
                                    </p>
                                    <p className='text-lg font-semibold'>
                                      {allocation.performance.conversions}
                                    </p>
                                  </div>
                                  <div className='p-3 bg-muted rounded-md'>
                                    <p className='text-xs text-muted-foreground'>
                                      CTR
                                    </p>
                                    <p className='text-lg font-semibold'>
                                      {allocation.performance.ctr.toFixed(2)}%
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {allocation.trackingLink && (
                                <div className='border-t pt-4'>
                                  <p className='text-sm font-medium mb-2'>
                                    Tracking Link
                                  </p>
                                  <div className='p-3 bg-muted rounded-md'>
                                    <code className='text-sm break-all'>
                                      {allocation.trackingLink}
                                    </code>
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
