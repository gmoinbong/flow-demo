import { Button } from '@/app/shared/ui/button';
import { ArrowRight, BarChart3, Users, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
console.log(process.env.NEXT_PUBLIC_API_URL);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
      {/* Header */}
      <header className='border-b bg-white/80 backdrop-blur-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center'>
                <BarChart3 className='w-5 h-5 text-white' />
              </div>
              <span className='text-xl font-bold text-foreground'>
                InfluenceHub
              </span>
            </div>
            <nav className='hidden md:flex items-center space-x-8'>
              <Link
                href='#features'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                Features
              </Link>
              <Link
                href='#pricing'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                Pricing
              </Link>
              <Button variant='outline' asChild>
                <Link href='/login'>Sign In</Link>
              </Button>
              <Button asChild>
                <Link href='/signup'>Get Started</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className='py-20 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center max-w-4xl mx-auto'>
            <h1 className='text-5xl font-bold text-foreground mb-6 leading-tight'>
              Scale Your Brand with
              <span className='text-primary'> AI-Powered</span> Influencer
              Marketing
            </h1>
            <p className='text-xl text-muted-foreground mb-8 leading-relaxed'>
              Connect with the right creators, track campaign performance in
              real-time, and maximize your ROI with data-driven insights.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button size='lg' className='text-lg px-8' asChild>
                <Link href='/signup'>
                  Start Free Trial
                  <ArrowRight className='ml-2 w-5 h-5' />
                </Link>
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='text-lg px-8 bg-transparent'
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-foreground mb-4'>
              Everything You Need to Succeed
            </h2>
            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
              From discovery to payment, manage your entire influencer marketing
              workflow in one platform.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            <div className='text-center p-6'>
              <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4'>
                <Zap className='w-6 h-6 text-primary' />
              </div>
              <h3 className='text-xl font-semibold mb-3'>
                AI-Powered Matching
              </h3>
              <p className='text-muted-foreground'>
                Our AI analyzes millions of creators to find the perfect match
                for your brand and audience.
              </p>
            </div>

            <div className='text-center p-6'>
              <div className='w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4'>
                <BarChart3 className='w-6 h-6 text-accent' />
              </div>
              <h3 className='text-xl font-semibold mb-3'>
                Real-Time Analytics
              </h3>
              <p className='text-muted-foreground'>
                Track engagement, reach, and ROI with comprehensive analytics
                and reporting tools.
              </p>
            </div>

            <div className='text-center p-6'>
              <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
                <Users className='w-6 h-6 text-blue-600' />
              </div>
              <h3 className='text-xl font-semibold mb-3'>
                Campaign Management
              </h3>
              <p className='text-muted-foreground'>
                Streamline your workflow with automated campaign management and
                creator communications.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
