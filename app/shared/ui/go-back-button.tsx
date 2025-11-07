'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from './button';

export function GoBackButton() {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <Button variant='outline' onClick={handleGoBack}>
      <ArrowLeft className='mr-2 h-4 w-4' />
      Go Back
    </Button>
  );
}

