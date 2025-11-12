'use client';

import { CampaignDetail } from '@/app/features/campaigns';
import { DashboardHeader } from '@/app/widgets/dashboard';
import { use } from 'react';

export default function CampaignDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  
  return (
    <div className='min-h-screen bg-slate-50'>
      <DashboardHeader />
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <CampaignDetail campaignId={id} />
      </main>
    </div>
  );
}
