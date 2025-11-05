'use client';

import { useParams } from 'next/navigation';
import { useCreatorCampaign, CreatorCampaignDetail } from '@/app/features/creator';

export default function CreatorCampaignDetailPage() {
  const params = useParams();
  const campaignId = params.id as string;

  const { campaign, allocation, daysRemaining, campaignProgress, submitContent } =
    useCreatorCampaign(campaignId);

  if (!campaign || !allocation) {
    return null;
  }

  return (
    <CreatorCampaignDetail
      campaign={campaign}
      allocation={allocation as any}
      daysRemaining={daysRemaining}
      campaignProgress={campaignProgress}
      onSubmitContent={submitContent}
    />
  );
}
