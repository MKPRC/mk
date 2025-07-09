import { Payment, PaymentFilters, PaymentStatistics } from '@/entities/admin/payment/types';

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
  
  const response = await fetch(`/api/admin/payments?${params}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || '결제 데이터 조회 실패');
  }
  
  return data;
} 