import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, BarChart3, CreditCard } from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Get started with common tasks</CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        <Button asChild className='w-full justify-start'>
          <Link href='/campaigns/new'>
            <Plus className='w-4 h-4 mr-2' />
            Create New Campaign
          </Link>
        </Button>
        <Button
          variant='outline'
          className='w-full justify-start bg-transparent'
          asChild
        >
          <Link href='/creators'>
            <Search className='w-4 h-4 mr-2' />
            Find Creators
          </Link>
        </Button>
        <Button
          variant='outline'
          className='w-full justify-start bg-transparent'
          asChild
        >
          <Link href='/reports'>
            <BarChart3 className='w-4 h-4 mr-2' />
            View Reports
          </Link>
        </Button>
        <Button
          variant='outline'
          className='w-full justify-start bg-transparent'
          asChild
        >
          <Link href='/payments'>
            <CreditCard className='w-4 h-4 mr-2' />
            Manage Payments
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
