import { DashboardStats } from '@/entities/admin/user/types';
import { UserProfile } from '@/entities/admin/user/types';

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch('/api/admin/stats');
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || '대시보드 통계 조회 실패');
  }
  
  return data;
}

export async function fetchUsers(): Promise<{ users: UserProfile[] }> {
  const response = await fetch('/api/admin/users');
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || '사용자 데이터 조회 실패');
  }
  
  return data;
} 