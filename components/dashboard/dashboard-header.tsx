'use client';

import { Button } from '@/components/ui/button';
import { BarChart3, Bell, Plus, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function DashboardHeader() {
  return (
    <header className='bg-white border-b'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex items-center space-x-4'>
            <Link href='/dashboard' className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center'>
                <BarChart3 className='w-5 h-5 text-white' />
              </div>
              <span className='text-xl font-bold text-foreground'>
                InfluenceHub
              </span>
            </Link>
          </div>

          {/* Search */}
          <div className='flex-1 max-w-md mx-8'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
              <Input
                placeholder='Search campaigns, creators...'
                className='pl-10'
              />
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center space-x-4'>
            <Button asChild>
              <Link href='/campaigns/new'>
                <Plus className='w-4 h-4 mr-2' />
                New Campaign
              </Link>
            </Button>

            <Button variant='ghost' size='sm'>
              <Bell className='w-5 h-5' />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='sm'>
                  <User className='w-5 h-5' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
