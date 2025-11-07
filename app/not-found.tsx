import Link from 'next/link';
import { BarChart3, Home } from 'lucide-react';
import { Button } from '@/app/shared/ui/button';
import { GoBackButton } from '@/app/shared/ui/go-back-button';

export default function NotFound() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-2xl text-center'>
        {/* Logo */}
        <div className='mb-8'>
          <div className='flex items-center justify-center space-x-2 mb-4'>
            <div className='w-10 h-10 bg-primary rounded-lg flex items-center justify-center'>
              <BarChart3 className='w-6 h-6 text-white' />
            </div>
            <span className='text-2xl font-bold text-foreground'>
              CreatorFlow
            </span>
          </div>
        </div>

        {/* 404 Content */}
        <div className='bg-white rounded-lg shadow-sm border p-8 md:p-12'>
          <div className='mb-6'>
            <h1 className='text-9xl font-bold text-primary mb-4'>404</h1>
            <h2 className='text-3xl font-bold text-foreground mb-4'>
              Page Not Found
            </h2>
            <p className='text-muted-foreground text-lg mb-8'>
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button asChild>
              <Link href='/dashboard'>
                <Home className='mr-2 h-4 w-4' />
                Go to Dashboard
              </Link>
            </Button>
            <GoBackButton />
          </div>
        </div>

        <p className='mt-6 text-sm text-muted-foreground'>
          CreatorFlow - Influencer Marketing Platform
        </p>
      </div>
    </div>
  );
}

