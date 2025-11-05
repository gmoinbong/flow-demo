'use client';

import { Button } from '@/app/shared/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export function CampaignsPageHeader() {
  return (
    <div className='border-b bg-card'>
      <div className='container mx-auto px-6 py-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Campaigns</h1>
            <p className='text-muted-foreground mt-1'>
              Manage and monitor all your influencer campaigns
            </p>
          </div>
          <Link href='/campaigns/new'>
            <Button size='lg'>
              <Plus className='w-5 h-5 mr-2' />
              Create Campaign
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

