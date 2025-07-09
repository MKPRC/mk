export interface UserProfile {
  id: string;
  display_name: string;
  phone: string;
  kakao_id?: string;
  naver_id?: string;
  marketing_consent: boolean;
  created_at: string;
  updated_at: string;
  email?: string;
  last_sign_in_at?: string;
  subscription_status?: string;
  user_id?: string;
  user_id_status?: 'mapped' | 'unmapped';
  login_provider?: string;
  needs_mapping?: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  newUsers: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  failedPayments: number;
} 