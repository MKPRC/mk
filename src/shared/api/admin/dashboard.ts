import { DashboardStats } from '@/entities/admin/user/types';
import { UserProfile } from '@/entities/admin/user/types';
import { supabase } from '@/shared/config/database';

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Authorization': `Bearer ${session?.access_token}`,
    'Content-Type': 'application/json',
  };
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const headers = await getAuthHeaders();
  const response = await fetch('/api/admin/stats', { headers });
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || '대시보드 통계 조회 실패');
  }
  
  return data;
}

export async function fetchUsers(): Promise<{ users: UserProfile[] }> {
  const headers = await getAuthHeaders();
  const response = await fetch('/api/admin/users', { headers });
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || '사용자 데이터 조회 실패');
  }
  
  return data;
} 