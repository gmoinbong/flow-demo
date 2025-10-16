import { PaymentManagement } from '@/components/payments/payment-management';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default function PaymentsPage() {
  return (
    <div className='min-h-screen bg-slate-50'>
      <DashboardHeader />
      <PaymentManagement />
    </div>
  );
}
