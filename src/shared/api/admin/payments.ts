import { Payment, PaymentFilters, PaymentStatistics } from '@/entities/admin/payment/types';
import { supabase } from '@/shared/config/database';

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Authorization': `Bearer ${session?.access_token}`,
    'Content-Type': 'application/json',
  };
}

export async function fetchPayments(filters: PaymentFilters): Promise<{ 
  payments: Payment[];
  statistics: PaymentStatistics;
}> {
  const params = new URLSearchParams();
  
  if (filters.status) params.append('status', filters.status);
  if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod);
  if (filters.search) params.append('search', filters.search);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  
  const headers = await getAuthHeaders();
  const response = await fetch(`/api/admin/payments?${params}`, { headers });
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || '결제 데이터 조회 실패');
  }
  
  return data;
} 