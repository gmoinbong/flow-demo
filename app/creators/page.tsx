import { CreatorDiscovery } from '@/app/features/creators';
import { DashboardHeader } from '@/app/widgets/dashboard';

export default function CreatorsPage() {
  return (
    <div className='min-h-screen bg-slate-50'>
      <DashboardHeader />
      <CreatorDiscovery />
    </div>
  );
}
