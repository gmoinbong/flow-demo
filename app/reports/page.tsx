import { ReportsAndAnalytics } from '@/components/reports/reports-and-analytics';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default function ReportsPage() {
  return (
    <div className='min-h-screen bg-slate-50'>
      <DashboardHeader />
      <ReportsAndAnalytics />
    </div>
  );
}
