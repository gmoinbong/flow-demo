'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCurrentUser, getAllocationsByCreator } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CreditCard,
  DollarSign,
  FileText,
  Download,
  CheckCircle,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

export function CreatorPaymentSettings() {
  const [user, setUser] = useState(getCurrentUser());
  const [allocations, setAllocations] = useState(
    getAllocationsByCreator(user?.id || '')
  );
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState({
    type: 'bank_account',
    accountHolder: '',
    accountNumber: '',
    routingNumber: '',
    bankName: '',
  });

  const [taxInfo, setTaxInfo] = useState({
    taxId: '',
    businessName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  useEffect(() => {
    if (!user || user.role !== 'creator') {
      router.push('/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'creator') {
    return null;
  }

  const totalEarnings = allocations.reduce(
    (sum, a) => sum + a.currentBudget,
    0
  );
  const pendingEarnings = allocations
    .filter(
      a =>
        a.status === 'pending' ||
        a.status === 'accepted' ||
        a.status === 'active'
    )
    .reduce((sum, a) => sum + a.currentBudget, 0);
  const availableForPayout = allocations
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => sum + a.currentBudget, 0);

  const handleSavePaymentMethod = () => {
    // Save to localStorage
    localStorage.setItem(
      `payment_method_${user.id}`,
      JSON.stringify(paymentMethod)
    );
    alert('Payment method saved successfully!');
  };

  const handleSaveTaxInfo = () => {
    // Save to localStorage
    localStorage.setItem(`tax_info_${user.id}`, JSON.stringify(taxInfo));
    alert('Tax information saved successfully!');
  };

  const handleRequestPayout = () => {
    if (availableForPayout === 0) {
      alert('No funds available for payout');
      return;
    }
    // In a real app, this would trigger a payout request
    alert(
      `Payout request for $${availableForPayout.toLocaleString()} submitted successfully!`
    );
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <div className='border-b bg-card'>
        <div className='container mx-auto px-6 py-4'>
          <div className='flex items-center gap-4'>
            <Link href='/creator/dashboard'>
              <Button variant='ghost' size='sm'>
                <ArrowLeft className='w-4 h-4 mr-2' />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className='text-2xl font-bold'>Payment Settings</h1>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-6 py-8 max-w-6xl'>
        {/* Earnings Overview */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Earnings
              </CardTitle>
              <DollarSign className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                ${totalEarnings.toLocaleString()}
              </div>
              <p className='text-xs text-muted-foreground'>Lifetime earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Pending</CardTitle>
              <Clock className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                ${pendingEarnings.toLocaleString()}
              </div>
              <p className='text-xs text-muted-foreground'>
                In active campaigns
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Available</CardTitle>
              <CheckCircle className='h-4 w-4 text-green-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-green-600'>
                ${availableForPayout.toLocaleString()}
              </div>
              <p className='text-xs text-muted-foreground'>Ready for payout</p>
              {availableForPayout > 0 && (
                <Button
                  size='sm'
                  className='mt-2'
                  onClick={handleRequestPayout}
                >
                  Request Payout
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue='payment-method' className='space-y-6'>
          <TabsList>
            <TabsTrigger value='payment-method'>Payment Method</TabsTrigger>
            <TabsTrigger value='tax-info'>Tax Information</TabsTrigger>
            <TabsTrigger value='payout-history'>Payout History</TabsTrigger>
            <TabsTrigger value='invoices'>Invoices</TabsTrigger>
          </TabsList>

          {/* Payment Method */}
          <TabsContent value='payment-method' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                  Add or update your payment information for receiving payouts
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-2'>
                  <Label htmlFor='payment-type'>Payment Type</Label>
                  <Select
                    value={paymentMethod.type}
                    onValueChange={value =>
                      setPaymentMethod({ ...paymentMethod, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='bank_account'>
                        Bank Account (ACH)
                      </SelectItem>
                      <SelectItem value='paypal'>PayPal</SelectItem>
                      <SelectItem value='stripe'>Stripe Connect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod.type === 'bank_account' && (
                  <>
                    <div className='space-y-2'>
                      <Label htmlFor='accountHolder'>Account Holder Name</Label>
                      <Input
                        id='accountHolder'
                        value={paymentMethod.accountHolder}
                        onChange={e =>
                          setPaymentMethod({
                            ...paymentMethod,
                            accountHolder: e.target.value,
                          })
                        }
                        placeholder='John Doe'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='bankName'>Bank Name</Label>
                      <Input
                        id='bankName'
                        value={paymentMethod.bankName}
                        onChange={e =>
                          setPaymentMethod({
                            ...paymentMethod,
                            bankName: e.target.value,
                          })
                        }
                        placeholder='Chase Bank'
                      />
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='routingNumber'>Routing Number</Label>
                        <Input
                          id='routingNumber'
                          value={paymentMethod.routingNumber}
                          onChange={e =>
                            setPaymentMethod({
                              ...paymentMethod,
                              routingNumber: e.target.value,
                            })
                          }
                          placeholder='123456789'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='accountNumber'>Account Number</Label>
                        <Input
                          id='accountNumber'
                          type='password'
                          value={paymentMethod.accountNumber}
                          onChange={e =>
                            setPaymentMethod({
                              ...paymentMethod,
                              accountNumber: e.target.value,
                            })
                          }
                          placeholder='••••••••'
                        />
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod.type === 'paypal' && (
                  <div className='space-y-2'>
                    <Label htmlFor='paypalEmail'>PayPal Email</Label>
                    <Input
                      id='paypalEmail'
                      type='email'
                      placeholder='your@email.com'
                    />
                  </div>
                )}

                {paymentMethod.type === 'stripe' && (
                  <div className='bg-blue-50 border border-blue-200 p-4 rounded-lg'>
                    <p className='text-sm text-blue-900 mb-3'>
                      Connect your Stripe account to receive instant payouts
                      with lower fees.
                    </p>
                    <Button variant='outline'>
                      <CreditCard className='w-4 h-4 mr-2' />
                      Connect Stripe Account
                    </Button>
                  </div>
                )}

                <div className='flex justify-end'>
                  <Button onClick={handleSavePaymentMethod}>
                    Save Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payout Schedule</CardTitle>
                <CardDescription>
                  Configure when you receive payments
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='payout-schedule'>Payout Frequency</Label>
                  <Select defaultValue='campaign-completion'>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='campaign-completion'>
                        Upon Campaign Completion
                      </SelectItem>
                      <SelectItem value='weekly'>
                        Weekly (Minimum $100)
                      </SelectItem>
                      <SelectItem value='monthly'>Monthly</SelectItem>
                      <SelectItem value='manual'>Manual Request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Payouts are processed within 3-5 business days after the
                  payout date.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tax Information */}
          <TabsContent value='tax-info' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Tax Information</CardTitle>
                <CardDescription>
                  Required for tax reporting and compliance (W-9 Form)
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='taxId'>Tax ID / SSN</Label>
                  <Input
                    id='taxId'
                    value={taxInfo.taxId}
                    onChange={e =>
                      setTaxInfo({ ...taxInfo, taxId: e.target.value })
                    }
                    placeholder='XXX-XX-XXXX'
                    type='password'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='businessName'>Business Name (Optional)</Label>
                  <Input
                    id='businessName'
                    value={taxInfo.businessName}
                    onChange={e =>
                      setTaxInfo({ ...taxInfo, businessName: e.target.value })
                    }
                    placeholder='Leave blank if individual'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='address'>Address</Label>
                  <Input
                    id='address'
                    value={taxInfo.address}
                    onChange={e =>
                      setTaxInfo({ ...taxInfo, address: e.target.value })
                    }
                    placeholder='123 Main St'
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='city'>City</Label>
                    <Input
                      id='city'
                      value={taxInfo.city}
                      onChange={e =>
                        setTaxInfo({ ...taxInfo, city: e.target.value })
                      }
                      placeholder='New York'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='state'>State</Label>
                    <Input
                      id='state'
                      value={taxInfo.state}
                      onChange={e =>
                        setTaxInfo({ ...taxInfo, state: e.target.value })
                      }
                      placeholder='NY'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='zipCode'>ZIP Code</Label>
                    <Input
                      id='zipCode'
                      value={taxInfo.zipCode}
                      onChange={e =>
                        setTaxInfo({ ...taxInfo, zipCode: e.target.value })
                      }
                      placeholder='10001'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='country'>Country</Label>
                    <Select
                      value={taxInfo.country}
                      onValueChange={value =>
                        setTaxInfo({ ...taxInfo, country: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='United States'>
                          United States
                        </SelectItem>
                        <SelectItem value='Canada'>Canada</SelectItem>
                        <SelectItem value='United Kingdom'>
                          United Kingdom
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='flex justify-end'>
                  <Button onClick={handleSaveTaxInfo}>
                    Save Tax Information
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payout History */}
          <TabsContent value='payout-history' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Payout History</CardTitle>
                <CardDescription>
                  View all your past payouts and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {allocations.length === 0 ? (
                    <div className='text-center py-8 text-muted-foreground'>
                      No payout history yet
                    </div>
                  ) : (
                    allocations.map(allocation => (
                      <div
                        key={allocation.id}
                        className='flex items-center justify-between border-b pb-4'
                      >
                        <div>
                          <p className='font-medium'>Campaign Payout</p>
                          <p className='text-sm text-muted-foreground'>
                            {new Date(
                              allocation.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='font-semibold'>
                            ${allocation.currentBudget.toLocaleString()}
                          </p>
                          <Badge
                            variant={
                              allocation.status === 'completed'
                                ? 'default'
                                : allocation.status === 'active'
                                  ? 'secondary'
                                  : 'outline'
                            }
                          >
                            {allocation.status === 'completed'
                              ? 'Paid'
                              : 'Pending'}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices */}
          <TabsContent value='invoices' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>
                  Download invoices for your records and tax purposes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {allocations.length === 0 ? (
                    <div className='text-center py-8 text-muted-foreground'>
                      No invoices available
                    </div>
                  ) : (
                    allocations.map(allocation => (
                      <div
                        key={allocation.id}
                        className='flex items-center justify-between border-b pb-4'
                      >
                        <div className='flex items-center gap-3'>
                          <FileText className='h-8 w-8 text-muted-foreground' />
                          <div>
                            <p className='font-medium'>
                              Invoice #{allocation.id.slice(0, 8)}
                            </p>
                            <p className='text-sm text-muted-foreground'>
                              {new Date(
                                allocation.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center gap-4'>
                          <p className='font-semibold'>
                            ${allocation.currentBudget.toLocaleString()}
                          </p>
                          <Button variant='outline' size='sm'>
                            <Download className='w-4 h-4 mr-2' />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
