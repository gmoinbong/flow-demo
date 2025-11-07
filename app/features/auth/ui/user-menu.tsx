'use client';

import * as React from 'react';
import { Button } from '@/app/shared/ui/button';
import { User } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/shared/ui/dropdown-menu';
import { useAuth, useLogout } from '../lib/use-auth';

export function UserMenu() {
  const { user, isLoading } = useAuth();
  const logout = useLogout();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = () => {
    logout.mutate();
  };

  if (!mounted) {
    return (
      <Button variant='ghost' size='sm' disabled>
        <User className='w-5 h-5' />
      </Button>
    );
  }

  if (isLoading) {
    return (
      <Button variant='ghost' size='sm' disabled>
        <User className='w-5 h-5' />
      </Button>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' type='button'>
          <User className='w-5 h-5' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>{user.name || user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/profile'>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
