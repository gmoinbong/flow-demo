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
import { Progress } from '@/app/shared/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/shared/ui/avatar';
import { getAllocationsByCampaign } from '@/app/features/campaigns/lib/campaign-api';
import { reallocateBudget } from '@/app/features/campaigns/lib/campaign-api';
import { TrendingUp, TrendingDown, Zap, AlertCircle } from 'lucide-react';
import { useCreators } from '../../creators';
import { Creator } from '../../creators/lib/creator-api';

interface BudgetReallocationProps {
  campaignId: string;
}

export function BudgetReallocation({ campaignId }: BudgetReallocationProps) {
  const [allocations, setAllocations] = useState(
    getAllocationsByCampaign(campaignId)
  );
  const [isReallocating, setIsReallocating] = useState(false);
  const { creators } = useCreators();

  const handleReallocate = () => {
    setIsReallocating(true);
    
    setTimeout(() => {
      reallocateBudget(campaignId);
      setAllocations(getAllocationsByCampaign(campaignId));
      setIsReallocating(false);
      alert(
        'Budget reallocation complete! Top performers received +25%, underperformers -25%'
      );
    }, 1500);
  };

  const allocationsWithScores = allocations.map(allocation => {
    const creator = creators.find(c => c.id === allocation.creatorId);
    const { reach, engagement, conversions } = allocation.performance;
    const score = reach * 0.4 + engagement * 0.3 + conversions * 0.3;
    const budgetChange = allocation.currentBudget - allocation.allocatedBudget;
    const changePercent = (budgetChange / allocation.allocatedBudget) * 100;

    return {
      ...allocation,
      creator: creator as Creator,
      score,
      budgetChange,
      changePercent,
    };
  });

  const sortedAllocations = [...allocationsWithScores].sort(
    (a, b) => b.score - a.score
  );

  const topPerformers = sortedAllocations.slice(
    0,
    Math.ceil(sortedAllocations.length * 0.3)
  );
  const bottomPerformers = sortedAllocations.slice(
    -Math.ceil(sortedAllocations.length * 0.3)
  );

  const totalBudget = allocations.reduce(
    (sum, a) => sum + a.allocatedBudget,
    0
  );
  const currentTotalBudget = allocations.reduce(
    (sum, a) => sum + a.currentBudget,
    0
  );

  return (
    <div className='space-y-6'>
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className='flex items-start justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <Zap className='w-5 h-5 text-yellow-500' />
                AI Budget Reallocation
              </CardTitle>
              <CardDescription className='mt-2'>
                Automatically optimize budget allocation based on creator
                performance. Top performers get +25%, underperformers -25%.
              </CardDescription>
            </div>
            <Button
              onClick={handleReallocate}
              disabled={isReallocating || allocations.length === 0}
            >
              {isReallocating ? 'Reallocating...' : 'Run Reallocation'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Original Budget</p>
              <p className='text-2xl font-bold'>
                ${totalBudget.toLocaleString()}
              </p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Current Budget</p>
              <p className='text-2xl font-bold'>
                ${currentTotalBudget.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      {allocations.length > 0 && (
        <div className='grid md:grid-cols-2 gap-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <TrendingUp className='w-5 h-5 text-green-500' />
                Top Performers
              </CardTitle>
              <CardDescription>
                Creators eligible for +25% budget increase
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {topPerformers.map(allocation => (
                <div
                  key={allocation.id}
                  className='flex items-center justify-between border-b pb-3'
                >
                  <div className='flex items-center gap-3'>
                    <Avatar className='h-10 w-10'>
                      <AvatarImage
                        src='/placeholder.svg'
                        alt={allocation.creator?.displayName || ''}
                      />
                      <AvatarFallback>
                        {allocation.creator?.displayName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='font-medium'>{allocation.creator?.displayName}</p>
                      <p className='text-xs text-muted-foreground'>
                        Score: {allocation.score.toFixed(0)}
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-semibold text-green-600'>
                      {allocation.changePercent > 0 ? '+' : ''}
                      {allocation.changePercent.toFixed(0)}%
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      ${allocation.currentBudget.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <TrendingDown className='w-5 h-5 text-orange-500' />
                Underperformers
              </CardTitle>
              <CardDescription>
                Creators with -25% budget reduction
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {bottomPerformers.map(allocation => (
                <div
                  key={allocation.id}
                  className='flex items-center justify-between border-b pb-3'
                >
                  <div className='flex items-center gap-3'>
                    <Avatar className='h-10 w-10'>
                      <AvatarImage
                        src='/placeholder.svg'
                        alt={allocation.creator?.displayName || ''}
                      />
                      <AvatarFallback>
                        {allocation.creator?.displayName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='font-medium'>{allocation.creator?.displayName}</p>
                      <p className='text-xs text-muted-foreground'>
                        Score: {allocation.score.toFixed(0)}
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-semibold text-orange-600'>
                      {allocation.changePercent.toFixed(0)}%
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      ${allocation.currentBudget.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* All Allocations */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Allocation Details</CardTitle>
          <CardDescription>
            Current budget distribution across all creators
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allocations.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <AlertCircle className='h-12 w-12 text-muted-foreground mb-4' />
              <p className='text-muted-foreground'>
                No allocations found for this campaign
              </p>
            </div>
          ) : (
            <div className='space-y-6'>
              {sortedAllocations.map((allocation, index) => {
                const isTopPerformer = topPerformers.some(
                  tp => tp.id === allocation.id
                );
                const isBottomPerformer = bottomPerformers.some(
                  bp => bp.id === allocation.id
                );

                return (
                  <div key={allocation.id} className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <span className='text-sm font-medium text-muted-foreground'>
                          #{index + 1}
                        </span>
                        <Avatar className='h-10 w-10'>
                          <AvatarImage
                            src='/placeholder.svg'
                            alt={allocation.creator?.displayName || ''}
                          />
                          <AvatarFallback>
                            {allocation.creator?.displayName?.charAt(0) || ''}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className='flex items-center gap-2'>
                            <p className='font-medium'>
                              {allocation.creator?.displayName || ''}
                            </p>
                            {isTopPerformer && (
                              <Badge variant='default' className='text-xs'>
                                Top
                              </Badge>
                            )}
                            {isBottomPerformer && (
                              <Badge variant='secondary' className='text-xs'>
                                Low
                              </Badge>
                            )}
                          </div>
                          <p className='text-xs text-muted-foreground'>
                            Performance Score: {allocation.score.toFixed(0)}
                          </p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <p className='font-semibold'>
                          ${allocation.currentBudget.toLocaleString()}
                        </p>
                        {allocation.budgetChange !== 0 && (
                          <p
                            className={`text-xs ${allocation.budgetChange > 0 ? 'text-green-600' : 'text-orange-600'}`}
                          >
                            {allocation.budgetChange > 0 ? '+' : ''}$
                            {Math.abs(allocation.budgetChange).toLocaleString()}{' '}
                            ({allocation.changePercent > 0 ? '+' : ''}
                            {allocation.changePercent.toFixed(0)}%)
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='space-y-1'>
                      <div className='flex justify-between text-xs text-muted-foreground'>
                        <span>Budget Utilization</span>
                        <span>
                          {(
                            (allocation.currentBudget / totalBudget) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <Progress
                        value={(allocation.currentBudget / totalBudget) * 100}
                        className='h-2'
                      />
                    </div>
                    <div className='grid grid-cols-3 gap-4 text-sm'>
                      <div>
                        <p className='text-muted-foreground'>Reach</p>
                        <p className='font-medium'>
                          {allocation.performance.reach.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className='text-muted-foreground'>Engagement</p>
                        <p className='font-medium'>
                          {allocation.performance.engagement}%
                        </p>
                      </div>
                      <div>
                        <p className='text-muted-foreground'>Conversions</p>
                        <p className='font-medium'>
                          {allocation.performance.conversions}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
