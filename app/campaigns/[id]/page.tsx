import { LiveCampaignDashboard } from '@/components/campaigns/live-campaign-dashboard';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default async function CampaignDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  return (
    <div className='min-h-screen bg-slate-50'>
      <DashboardHeader />
      <LiveCampaignDashboard campaignId={id} />
    </div>
  );
}
