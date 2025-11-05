export interface Notification {
  id: string;
  userId: string;
  type:
    | 'campaign_invite'
    | 'contract_update'
    | 'payment'
    | 'message'
    | 'budget_change'
    | 'content_approval';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: any;
}

