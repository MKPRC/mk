import { Subscription, SubscriptionFilters } from '@/entities/admin/subscription/types';

export async function fetchSubscriptions(filters: SubscriptionFilters): Promise<{ subscriptions: Subscription[] }> {
  const params = new URLSearchParams();
  
  if (filters.status) params.append('status', filters.status);
  if (filters.membershipType) params.append('membershipType', filters.membershipType);
  if (filters.search) params.append('search', filters.search);
  
  const response = await fetch(`/api/admin/subscriptions?${params}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || '구독 데이터 조회 실패');
  }
  
  return data;
}

export async function updateSubscriptionStatus(subscriptionId: string, status: string): Promise<void> {
  const response = await fetch('/api/admin/subscriptions', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
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