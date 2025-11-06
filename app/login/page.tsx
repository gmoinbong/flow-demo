import { Suspense } from 'react';
import { LoginForm } from '@/app/features/auth';
import { BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Logo */}
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center space-x-2 mb-4'>
            <div className='w-10 h-10 bg-primary rounded-lg flex items-center justify-center'>
              <BarChart3 className='w-6 h-6 text-white' />
            </div>
            <span className='text-2xl font-bold text-foreground'>
              InfluenceHub
            </span>
          </div>
          <h1 className='text-2xl font-bold text-foreground mb-2'>
            Welcome back
          </h1>
          <p className='text-muted-foreground'>
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <div className='bg-white rounded-lg shadow-sm border p-6'>
          <Suspense fallback={<div className='text-center py-4'>Loading...</div>}>
            <LoginForm />
          </Suspense>

          <div className='mt-6 text-center'>
            <p className='text-sm text-muted-foreground'>
              Don't have an account?{' '}
              <Link
                href='/signup'
                className='text-primary hover:underline font-medium'
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
