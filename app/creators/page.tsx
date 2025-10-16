import { CreatorDiscovery } from '@/components/creators/creator-discovery';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default function CreatorsPage() {
  return (
    <div className='min-h-screen bg-slate-50'>
      <DashboardHeader />
      <CreatorDiscovery />
    </div>
  );
}
