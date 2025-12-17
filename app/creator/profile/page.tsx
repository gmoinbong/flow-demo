import Link from 'next/link';
import { redirect } from 'next/navigation';

import { CreatorProfileEdit } from '@/app/features/creator';
import { getServerUser } from '@/app/shared/lib/get-server-user';
import { Button } from '@/app/shared/ui/button';

export default async function CreatorProfilePage() {
  const user = await getServerUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'creator') {
    redirect('/brand/profile');
  }

  return (
    <div className='flex flex-col gap-4'>
      <Button asChild variant='outline' size='sm'>
        <Link href='/dashboard'>Back to dashboard</Link>
      </Button>
      <CreatorProfileEdit />
    </div>
  );
}
