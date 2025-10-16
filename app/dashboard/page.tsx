import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { CampaignOverview } from '@/components/dashboard/campaign-overview';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentActivity } from '@/components/dashboard/recent-activity';

export default function DashboardPage() {
  return (
    <div className='min-h-screen bg-slate-50'>
      <DashboardHeader />

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-foreground mb-2'>
            Welcome back!
          </h1>
          <p className='text-muted-foreground'>
            Here's what's happening with your campaigns today.
          </p>
        </div>

        <div className='grid lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-8'>
            <CampaignOverview />
            <RecentActivity />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
}
