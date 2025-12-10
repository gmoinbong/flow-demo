import { redirect } from 'next/navigation';
import { getServerUser } from '@/app/shared/lib/get-server-user';
import { ProfileView } from '@/app/features/profile/ui/profile-view';

export default async function BrandProfilePage() {
  const user = await getServerUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'brand') {
    redirect('/creator/profile');
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      <ProfileView />
    </div>
  );
}
