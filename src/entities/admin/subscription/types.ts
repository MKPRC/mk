export interface Subscription {
  id: string;
  user_id: string;
  membership_type: string;
  status: string;
  amount: number;
  billing_key: string;
  customer_key: string;
  current_period_start: string;
  current_period_end: string;
  next_billing_date: string;
  created_at: string;
  updated_at: string;
  payment_method: string;
  user_profiles?: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface SubscriptionFilters {
  status: string;
  membershipType: string;
  search: string;
} 