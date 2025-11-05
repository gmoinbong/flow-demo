'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getAllocations, saveAllocation } from '@/app/features/campaigns';
import { Card, CardContent } from '@/app/shared/ui/card';
import { Loader2 } from 'lucide-react';

export default function TrackingPage() {
  const router = useRouter();
  const params = useParams();
  const [isTracking, setIsTracking] = useState(true);

  useEffect(() => {
    const trackClick = () => {
      const code = params.code as string;
      const [campaignId, creatorId] = code.split('-');

      // Find the allocation
      const allocations = getAllocations();
      const allocation = allocations.find(
        a =>
          a.campaignId.startsWith(campaignId) &&
          a.creatorId.startsWith(creatorId)
      );

      if (allocation) {
        // Update performance metrics
        allocation.performance.reach += 1;
        allocation.performance.ctr =
          (allocation.performance.conversions / allocation.performance.reach) *
            100 || 0;

        // Simulate engagement (30% chance)
        if (Math.random() < 0.3) {
          allocation.performance.engagement += 1;
        }

        // Simulate conversion (5% chance)
        if (Math.random() < 0.05) {
          allocation.performance.conversions += 1;
        }

        saveAllocation(allocation);

        console.log('[v0] Tracked click for allocation:', allocation.id);
        console.log('[v0] Updated performance:', allocation.performance);
      }

      // Redirect to a demo landing page after tracking
      setTimeout(() => {
        setIsTracking(false);
        // In a real app, this would redirect to the brand's actual landing page
        router.push('/');
      }, 1000);
    };

    trackClick();
  }, [params.code, router]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center'>
      <Card className='w-full max-w-md'>
        <CardContent className='flex flex-col items-center justify-center py-12'>
          {isTracking ? (
            <>
              <Loader2 className='h-12 w-12 animate-spin text-primary mb-4' />
              <h2 className='text-xl font-semibold mb-2'>
                Tracking your visit...
              </h2>
              <p className='text-muted-foreground text-center'>
                You'll be redirected shortly
              </p>
            </>
          ) : (
            <>
              <h2 className='text-xl font-semibold mb-2'>Redirecting...</h2>
              <p className='text-muted-foreground text-center'>
                Taking you to the destination
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
