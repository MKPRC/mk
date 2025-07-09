export interface Payment {
  id: string;
  user_id: string;
  subscription_id: string;
  amount: number;
  currency?: string;
  payment_method: string;
  payment_key: string;
  order_id: string;
  status: string;
  paid_at: string;
  created_at: string;
  user_profiles?: {
    name: string;
    email: string;
    phone: string;
  };
  subscriptions?: {
    membership_type: string;
  };
}

export interface PaymentFilters {
  status: string;
  paymentMethod: string;
  search: string;
  startDate: string;
  endDate: string;
}

export interface PaymentStatistics {
  totalRevenue: number;
  completedPayments: number;
  totalPayments: number;
} 