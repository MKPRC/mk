import { supabase } from '@/shared/config/database';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  phone: string;
  marketing_consent: boolean;
  provider: string;
}

export interface UserSubscription {
  id: string;
  membership_type: string;
  membership_name: string;
  status: string;
  amount: number;
  next_billing_date: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  payment_method: string;
  order_id: string;
  status: string;
  paid_at: string;
  created_at: string;
}

export interface UserProfileResponse {
  user: UserProfile;
  subscription: UserSubscription | null;
  payment_history: PaymentHistory[];
}

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Authorization': `Bearer ${session?.access_token}`,
    'Content-Type': 'application/json',
  };
}

export async function fetchUserProfile(): Promise<UserProfileResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch('/api/user/subscription', { headers });
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || '사용자 정보 조회 실패');
  }
  
  return data;
}

export async function updateUserPhone(phone: string): Promise<void> {
  const headers = await getAuthHeaders();
  const response = await fetch('/api/user/update-phone', {
    method: 'POST',
    headers,
    body: JSON.stringify({ phone }),
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || '전화번호 업데이트 실패');
  }
} 