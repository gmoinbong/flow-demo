import { ReportsAndAnalytics } from '@/app/features/reports';
import { DashboardHeader } from '@/app/widgets/dashboard';

export default function ReportsPage() {
  return (
    <div className='min-h-screen bg-slate-50'>
      <DashboardHeader />
      <ReportsAndAnalytics />
    </div>
  );
}
