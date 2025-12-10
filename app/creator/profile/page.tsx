import { redirect } from 'next/navigation';
import { CreatorProfileEdit } from '@/app/features/creator';
import { getServerUser } from '@/app/shared/lib/get-server-user';

export default async function CreatorProfilePage() {
  const user = await getServerUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'creator') {
    redirect('/brand/profile');
  }

  return <CreatorProfileEdit />;
}
