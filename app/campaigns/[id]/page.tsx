import { LiveCampaignDashboard } from '@/app/features/campaigns';
import { DashboardHeader } from '@/app/widgets/dashboard';

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
