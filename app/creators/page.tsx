import { DashboardHeader } from '@/app/widgets/dashboard';
import { CreatorDiscovery } from '../features/creators/ui/creator-discovery';

export default function CreatorsPage() {
  return (
    <div className='min-h-screen bg-slate-50'>
      <DashboardHeader />
      <CreatorDiscovery />
    </div>
  );
}
