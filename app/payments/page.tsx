import { PaymentManagement } from '@/app/features/payments';
import { DashboardHeader } from '@/app/widgets/dashboard';

export default function PaymentsPage() {
  return (
    <div className='min-h-screen bg-slate-50'>
      <DashboardHeader />
      <PaymentManagement />
    </div>
  );
}
