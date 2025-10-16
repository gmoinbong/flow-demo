'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  CreditCard,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Send,
} from 'lucide-react';

const pendingPayments = [
  {
    id: 1,
    creator: 'Sarah Johnson',
    handle: '@sarahjstyle',
    avatar: '/fashion-influencer-woman.png',
    campaign: 'Summer Collection Launch',
    amount: 2500,
    dueDate: '2024-02-01',
    deliverables: '4 Instagram posts',
    status: 'approved',
    paymentMethod: 'PayPal',
  },
  {
    id: 2,
    creator: 'Emma Rodriguez',
    handle: '@emmabeauty',
    avatar: '/beauty-influencer-latina.png',
    campaign: 'Brand Awareness Q4',
    amount: 4200,
    dueDate: '2024-02-01',
    deliverables: '3 YouTube videos',
    status: 'approved',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 3,
    creator: 'Marcus Chen',
    handle: '@marcusfitness',
    avatar: '/fitness-influencer-man.png',
    campaign: 'Product Launch',
    amount: 1800,
    dueDate: '2024-02-03',
    deliverables: '3 TikTok videos',
    status: 'pending_approval',
    paymentMethod: 'PayPal',
  },
];

const paymentHistory = [
  {
    id: 1,
    creator: 'Zoe Williams',
    handle: '@zoetravel',
    avatar: '/travel-influencer-woman.png',
    campaign: 'Summer Collection Launch',
    amount: 2800,
    paidDate: '2024-01-28',
    status: 'completed',
    paymentMethod: 'Bank Transfer',
    transactionId: 'TXN-001234',
  },
  {
    id: 2,
    creator: 'Alex Thompson',
    handle: '@alextech',
    avatar: '/tech-influencer-man.png',
    campaign: 'Brand Awareness Q4',
    amount: 1500,
    paidDate: '2024-01-25',
    status: 'completed',
    paymentMethod: 'PayPal',
    transactionId: 'TXN-001235',
  },
];

export function PaymentManagement() {
  const [selectedPayments, setSelectedPayments] = useState<number[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');

  const handlePaymentSelect = (paymentId: number) => {
    setSelectedPayments(prev =>
      prev.includes(paymentId)
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const handleBulkPayment = () => {
    console.log(
      `[v0] Processing bulk payment for ${selectedPayments.length} creators`
    );
    // Handle bulk payment logic
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant='default'>Ready to Pay</Badge>;
      case 'pending_approval':
        return <Badge variant='secondary'>Pending Approval</Badge>;
      case 'completed':
        return <Badge variant='outline'>Completed</Badge>;
      case 'processing':
        return <Badge variant='secondary'>Processing</Badge>;
      default:
        return <Badge variant='secondary'>{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className='w-4 h-4 text-green-500' />;
      case 'pending_approval':
        return <Clock className='w-4 h-4 text-yellow-500' />;
      case 'completed':
        return <CheckCircle className='w-4 h-4 text-green-500' />;
      case 'processing':
        return <AlertTriangle className='w-4 h-4 text-blue-500' />;
      default:
        return <Clock className='w-4 h-4 text-gray-500' />;
    }
  };

  const totalPending = pendingPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const approvedPayments = pendingPayments.filter(p => p.status === 'approved');
  const totalApproved = approvedPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>
            Payment Management
          </h1>
          <p className='text-muted-foreground'>
            Manage creator payments and track financial transactions
          </p>
        </div>

        <div className='flex items-center space-x-3'>
          {selectedPayments.length > 0 && (
            <Button onClick={handleBulkPayment}>
              <Send className='w-4 h-4 mr-2' />
              Pay Selected ({selectedPayments.length})
            </Button>
          )}
          <Button variant='outline'>
            <Download className='w-4 h-4 mr-2' />
            Export Report
          </Button>
        </div>
      </div>

      {/* Payment Summary */}
      <div className='grid md:grid-cols-4 gap-4 mb-8'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center space-x-2 mb-2'>
              <Clock className='w-5 h-5 text-yellow-500' />
              <span className='text-sm font-medium'>Pending Payments</span>
            </div>
            <div className='text-2xl font-bold'>
              ${totalPending.toLocaleString()}
            </div>
            <div className='text-sm text-muted-foreground'>
              {pendingPayments.length} creators
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center space-x-2 mb-2'>
              <CheckCircle className='w-5 h-5 text-green-500' />
              <span className='text-sm font-medium'>Ready to Pay</span>
            </div>
            <div className='text-2xl font-bold'>
              ${totalApproved.toLocaleString()}
            </div>
            <div className='text-sm text-muted-foreground'>
              {approvedPayments.length} creators
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center space-x-2 mb-2'>
              <CreditCard className='w-5 h-5 text-blue-500' />
              <span className='text-sm font-medium'>This Month</span>
            </div>
            <div className='text-2xl font-bold'>$18.5K</div>
            <div className='text-sm text-green-600'>+15% vs last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center space-x-2 mb-2'>
              <AlertTriangle className='w-5 h-5 text-orange-500' />
              <span className='text-sm font-medium'>Overdue</span>
            </div>
            <div className='text-2xl font-bold'>$0</div>
            <div className='text-sm text-green-600'>No overdue payments</div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Tabs */}
      <Tabs defaultValue='pending' className='space-y-6'>
        <div className='flex items-center justify-between'>
          <TabsList>
            <TabsTrigger value='pending'>Pending Payments</TabsTrigger>
            <TabsTrigger value='history'>Payment History</TabsTrigger>
          </TabsList>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className='w-48'>
              <SelectValue placeholder='Filter by status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All statuses</SelectItem>
              <SelectItem value='approved'>Ready to pay</SelectItem>
              <SelectItem value='pending_approval'>Pending approval</SelectItem>
              <SelectItem value='processing'>Processing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value='pending'>
          <Card>
            <CardHeader>
              <CardTitle>Pending Payments</CardTitle>
              <CardDescription>
                Creator payments awaiting processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {pendingPayments.map(payment => (
                  <div key={payment.id} className='border rounded-lg p-4'>
                    <div className='flex items-start justify-between'>
                      <div className='flex items-start space-x-4'>
                        <Checkbox
                          checked={selectedPayments.includes(payment.id)}
                          onCheckedChange={() =>
                            handlePaymentSelect(payment.id)
                          }
                          disabled={payment.status !== 'approved'}
                        />
                        <Avatar className='w-12 h-12'>
                          <AvatarImage
                            src={payment.avatar || '/placeholder.svg'}
                            alt={payment.creator}
                          />
                          <AvatarFallback>
                            {payment.creator
                              .split(' ')
                              .map(n => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                          <div className='flex items-center space-x-2 mb-1'>
                            <h3 className='font-semibold'>{payment.creator}</h3>
                            {getStatusIcon(payment.status)}
                          </div>
                          <p className='text-sm text-muted-foreground mb-1'>
                            {payment.handle}
                          </p>
                          <p className='text-sm text-muted-foreground mb-2'>
                            {payment.campaign}
                          </p>
                          <div className='flex items-center space-x-4 text-xs text-muted-foreground'>
                            <span>Due: {payment.dueDate}</span>
                            <span>Method: {payment.paymentMethod}</span>
                            <span>{payment.deliverables}</span>
                          </div>
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='text-xl font-bold mb-2'>
                          ${payment.amount.toLocaleString()}
                        </div>
                        {getStatusBadge(payment.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='history'>
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Completed payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {paymentHistory.map(payment => (
                  <div key={payment.id} className='border rounded-lg p-4'>
                    <div className='flex items-start justify-between'>
                      <div className='flex items-start space-x-4'>
                        <Avatar className='w-12 h-12'>
                          <AvatarImage
                            src={payment.avatar || '/placeholder.svg'}
                            alt={payment.creator}
                          />
                          <AvatarFallback>
                            {payment.creator
                              .split(' ')
                              .map(n => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                          <div className='flex items-center space-x-2 mb-1'>
                            <h3 className='font-semibold'>{payment.creator}</h3>
                            <CheckCircle className='w-4 h-4 text-green-500' />
                          </div>
                          <p className='text-sm text-muted-foreground mb-1'>
                            {payment.handle}
                          </p>
                          <p className='text-sm text-muted-foreground mb-2'>
                            {payment.campaign}
                          </p>
                          <div className='flex items-center space-x-4 text-xs text-muted-foreground'>
                            <span>Paid: {payment.paidDate}</span>
                            <span>Method: {payment.paymentMethod}</span>
                            <span>ID: {payment.transactionId}</span>
                          </div>
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='text-xl font-bold mb-2'>
                          ${payment.amount.toLocaleString()}
                        </div>
                        <Badge variant='outline'>Completed</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
