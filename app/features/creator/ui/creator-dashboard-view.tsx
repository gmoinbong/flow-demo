'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/shared/ui/card';
import { Button } from '@/app/shared/ui/button';
import { Badge } from '@/app/shared/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/shared/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/shared/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/shared/ui/dialog';
import {
  getAllocationsByCreator,
  getCampaignById,
} from '@/app/features/campaigns/lib/campaign-api';
import { useRouter } from 'next/navigation';
import {
  DollarSign,
  TrendingUp,
  Users,
  Eye,
  Heart,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { ContractAcceptance } from './contract-acceptance';
import { NotificationsDropdown } from './notifications-dropdown';
import { useAuth } from '@/app/features/auth/lib/use-auth';

export function CreatorDashboardView() {
  const { user } = useAuth();
  const [allocations, setAllocations] = useState(
    getAllocationsByCreator(user?.id || '')
  );
  const [selectedAllocation, setSelectedAllocation] = useState<any>(null);
  const [showContractModal, setShowContractModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'creator') {
      router.push('/login');
      return;
    }

    setAllocations(getAllocationsByCreator(user.id));
  }, [user, router]);

  const refreshAllocations = () => {
    setAllocations(getAllocationsByCreator(user?.id || ''));
  };

  if (!user || user.role !== 'creator') {
    return null;
  }

  // Calculate stats
  const totalEarnings = allocations.reduce(
    (sum, a) => sum + a.currentBudget,
    0
  );
  const pendingEarnings = allocations
    .filter(a => a.status === 'pending' || a.status === 'accepted')
    .reduce((sum, a) => sum + a.currentBudget, 0);
  const activeCampaigns = allocations.filter(a => a.status === 'active').length;
  const totalReach = allocations.reduce(
    (sum, a) => sum + a.performance.reach,
    0
  );
  const avgEngagement =
    allocations.length > 0
      ? allocations.reduce((sum, a) => sum + a.performance.engagement, 0) /
        allocations.length
      : 0;

  const pendingInvitations = allocations.filter(a => a.status === 'pending');
  const activeAllocations = allocations.filter(
    a => a.status === 'active' || a.status === 'accepted'
  );

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <div className='border-b bg-card'>
        <div className='container mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Avatar className='h-12 w-12'>
                <AvatarImage src='/placeholder.svg' alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className='text-2xl font-bold'>{user.name}</h1>
                <p className='text-sm text-muted-foreground'>
                  {user.instagramHandle && `@${user.instagramHandle}`}
                  {user.tiktokHandle && ` • @${user.tiktokHandle}`}
                </p>
              </div>
            </div>
            <div className='flex gap-2'>
              <NotificationsDropdown userId={user.id} />
              <Link href='/creator/messages'>
                <Button variant='ghost' size='icon'>
                  <MessageSquare className='h-5 w-5' />
                </Button>
              </Link>
              <Link href='/creator/profile'>
                <Button variant='outline'>
                  <Settings className='w-4 h-4 mr-2' />
                  Edit Profile
                </Button>
              </Link>
              <Link href='/creator/payments'>
                <Button variant='outline'>
                  <DollarSign className='w-4 h-4 mr-2' />
                  Payment Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-6 py-8'>
        {/* Stats Overview */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
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
              <p className='text-xs text-muted-foreground'>
                ${pendingEarnings.toLocaleString()} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Active Campaigns
              </CardTitle>
              <TrendingUp className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{activeCampaigns}</div>
              <p className='text-xs text-muted-foreground'>
                {pendingInvitations.length} pending invitations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Reach</CardTitle>
              <Eye className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {totalReach.toLocaleString()}
              </div>
              <p className='text-xs text-muted-foreground'>
                Across all campaigns
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Avg Engagement
              </CardTitle>
              <Heart className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {avgEngagement.toFixed(1)}%
              </div>
              <p className='text-xs text-muted-foreground'>Performance score</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue='campaigns' className='space-y-6'>
          <TabsList>
            <TabsTrigger value='campaigns'>My Campaigns</TabsTrigger>
            <TabsTrigger value='invitations'>
              Invitations
              {pendingInvitations.length > 0 && (
                <Badge variant='destructive' className='ml-2'>
                  {pendingInvitations.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value='earnings'>Earnings</TabsTrigger>
          </TabsList>

          {/* Active Campaigns */}
          <TabsContent value='campaigns' className='space-y-4'>
            {activeAllocations.length === 0 ? (
              <Card>
                <CardContent className='flex flex-col items-center justify-center py-12'>
                  <Users className='h-12 w-12 text-muted-foreground mb-4' />
                  <h3 className='text-lg font-semibold mb-2'>
                    No Active Campaigns
                  </h3>
                  <p className='text-muted-foreground text-center max-w-md'>
                    You don't have any active campaigns yet. Check your
                    invitations or wait for brands to discover your profile.
                  </p>
                </CardContent>
              </Card>
            ) : (
              activeAllocations.map(allocation => {
                const campaign = getCampaignById(allocation.campaignId);
                if (!campaign) return null;

                return (
                  <Card key={allocation.id}>
                    <CardHeader>
                      <div className='flex items-start justify-between'>
                        <div>
                          <CardTitle>{campaign.name}</CardTitle>
                          <CardDescription className='mt-1'>
                            {campaign.description}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={
                            allocation.status === 'active'
                              ? 'default'
                              : allocation.status === 'accepted'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {allocation.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      {/* Budget & Performance */}
                      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        <div>
                          <p className='text-sm text-muted-foreground'>
                            Your Budget
                          </p>
                          <p className='text-lg font-semibold'>
                            ${allocation.currentBudget.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className='text-sm text-muted-foreground'>Reach</p>
                          <p className='text-lg font-semibold'>
                            {allocation.performance.reach.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className='text-sm text-muted-foreground'>
                            Engagement
                          </p>
                          <p className='text-lg font-semibold'>
                            {allocation.performance.engagement}%
                          </p>
                        </div>
                        <div>
                          <p className='text-sm text-muted-foreground'>
                            Conversions
                          </p>
                          <p className='text-lg font-semibold'>
                            {allocation.performance.conversions}
                          </p>
                        </div>
                      </div>

                      {/* Tracking Link */}
                      {allocation.trackingLink && (
                        <div className='bg-muted p-3 rounded-lg'>
                          <p className='text-sm font-medium mb-1'>
                            Your Tracking Link
                          </p>
                          <div className='flex items-center gap-2'>
                            <code className='text-xs bg-background px-2 py-1 rounded flex-1 truncate'>
                              {allocation.trackingLink}
                            </code>
                            <Button
                              size='sm'
                              variant='outline'
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  allocation.trackingLink!
                                );
                                alert('Link copied!');
                              }}
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Contract Status */}
                      {!allocation.contractAccepted &&
                        allocation.status === 'accepted' && (
                          <div className='bg-orange-50 border border-orange-200 p-3 rounded-lg flex items-start gap-2'>
                            <AlertCircle className='h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5' />
                            <div className='flex-1'>
                              <p className='text-sm font-medium text-orange-900'>
                                Contract Pending
                              </p>
                              <p className='text-xs text-orange-700 mt-1'>
                                Please review and accept the campaign contract
                                to start creating content.
                              </p>
                              <Button
                                size='sm'
                                className='mt-2 bg-transparent'
                                variant='outline'
                              >
                                Review Contract
                              </Button>
                            </div>
                          </div>
                        )}

                      <div className='flex gap-2'>
                        <Button variant='outline' size='sm' asChild>
                          <Link href={`/creator/campaigns/${campaign.id}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button variant='outline' size='sm'>
                          Message Brand
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* Pending Invitations */}
          <TabsContent value='invitations' className='space-y-4'>
            {pendingInvitations.length === 0 ? (
              <Card>
                <CardContent className='flex flex-col items-center justify-center py-12'>
                  <Clock className='h-12 w-12 text-muted-foreground mb-4' />
                  <h3 className='text-lg font-semibold mb-2'>
                    No Pending Invitations
                  </h3>
                  <p className='text-muted-foreground text-center max-w-md'>
                    You're all caught up! New campaign invitations will appear
                    here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingInvitations.map(allocation => {
                const campaign = getCampaignById(allocation.campaignId);
                if (!campaign) return null;

                return (
                  <Card key={allocation.id}>
                    <CardHeader>
                      <div className='flex items-start justify-between'>
                        <div>
                          <CardTitle>{campaign.name}</CardTitle>
                          <CardDescription className='mt-1'>
                            {campaign.description}
                          </CardDescription>
                        </div>
                        <Badge variant='outline'>New</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                        <div>
                          <p className='text-sm text-muted-foreground'>
                            Offered Budget
                          </p>
                          <p className='text-lg font-semibold'>
                            ${allocation.allocatedBudget.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className='text-sm text-muted-foreground'>
                            Campaign Duration
                          </p>
                          <p className='text-sm font-medium'>
                            {new Date(campaign.startDate).toLocaleDateString()}{' '}
                            - {new Date(campaign.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className='text-sm text-muted-foreground'>
                            Platforms
                          </p>
                          <p className='text-sm font-medium'>
                            {campaign.platforms?.join(', ') || 'Not specified'}
                          </p>
                        </div>
                      </div>

                      <div className='flex gap-2'>
                        <Button
                          onClick={() => {
                            setSelectedAllocation(allocation);
                            setShowContractModal(true);
                          }}
                        >
                          <CheckCircle className='w-4 h-4 mr-2' />
                          Review Contract
                        </Button>
                        <Button variant='outline'>View Details</Button>
                        <Button variant='ghost'>Decline</Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* Earnings */}
          <TabsContent value='earnings' className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-sm font-medium'>
                    Total Earned
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-3xl font-bold text-green-600'>
                    ${totalEarnings.toLocaleString()}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Lifetime earnings
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='text-sm font-medium'>
                    Pending Payout
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-3xl font-bold'>
                    ${pendingEarnings.toLocaleString()}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Will be paid on completion
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='text-sm font-medium'>
                    Avg Campaign Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-3xl font-bold'>
                    $
                    {allocations.length > 0
                      ? Math.round(
                          totalEarnings / allocations.length
                        ).toLocaleString()
                      : 0}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Per campaign
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  Track your earnings and payment status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allocations.length === 0 ? (
                  <div className='text-center py-8 text-muted-foreground'>
                    No payment history yet
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {allocations.map(allocation => {
                      const campaign = getCampaignById(allocation.campaignId);
                      if (!campaign) return null;

                      return (
                        <div
                          key={allocation.id}
                          className='flex items-center justify-between border-b pb-4'
                        >
                          <div>
                            <p className='font-medium'>{campaign.name}</p>
                            <p className='text-sm text-muted-foreground'>
                              {campaign.createdAt 
                                ? new Date(campaign.createdAt).toLocaleDateString()
                                : 'N/A'}
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
                              {allocation.status}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showContractModal} onOpenChange={setShowContractModal}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Campaign Contract</DialogTitle>
          </DialogHeader>
          {selectedAllocation && (
            <ContractAcceptance
              allocation={selectedAllocation}
              campaign={getCampaignById(selectedAllocation.campaignId)!}
              onAccept={() => {
                setShowContractModal(false);
                refreshAllocations();
              }}
              onDecline={() => {
                setShowContractModal(false);
                refreshAllocations();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
