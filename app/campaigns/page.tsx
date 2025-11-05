'use client';

import { useCampaigns } from '@/app/features/campaigns';
import {
  CampaignsPageHeader,
  CampaignsStats,
  CampaignsList,
} from '@/app/features/campaigns';

export default function CampaignsPage() {
  const { campaigns, activeCampaigns, totalBudget, totalCreators } =
    useCampaigns();

  return (
    <div className='min-h-screen bg-background'>
      <CampaignsPageHeader />

      <div className='container mx-auto px-6 py-8'>
        <CampaignsStats
          totalCampaigns={campaigns.length}
          activeCampaigns={activeCampaigns}
          totalBudget={totalBudget}
          totalCreators={totalCreators}
        />

        <CampaignsList campaigns={campaigns} />
      </div>
    </div>
  );
}
