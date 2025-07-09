import { Subscription, SubscriptionFilters } from '@/entities/admin/subscription/types';
import { supabase } from '@/shared/config/database';

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Authorization': `Bearer ${session?.access_token}`,
    'Content-Type': 'application/json',
  };
}

export async function fetchSubscriptions(filters: SubscriptionFilters): Promise<{ subscriptions: Subscription[] }> {
  const params = new URLSearchParams();
  
  if (filters.status) params.append('status', filters.status);
  if (filters.membershipType) params.append('membershipType', filters.membershipType);
  if (filters.search) params.append('search', filters.search);
  
  const headers = await getAuthHeaders();
  const response = await fetch(`/api/admin/subscriptions?${params}`, { headers });
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || '구독 데이터 조회 실패');
  }
  
  return data;
}

export async function updateSubscriptionStatus(subscriptionId: string, status: string): Promise<void> {
  const headers = await getAuthHeaders();
  const response = await fetch('/api/admin/subscriptions', {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      subscriptionId,
      status
    })
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || '구독 상태 업데이트 실패');
  }
} 