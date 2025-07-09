import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase 환경 변수가 설정되지 않았습니다.');
}

// 클라이언트 사이드용 (Supabase Auth 사용)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// 서버 사이드용 
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

// 데이터베이스 타입 정의
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  provider: 'kakao' | 'naver' | 'email';
  provider_id?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_period: string;
  features: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  billing_key: string;
  customer_key: string;
  status: 'active' | 'paused' | 'cancelled';
  next_billing_date: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentHistory {
  id: string;
  subscription_id: string;
  user_id: string;
  amount: number;
  payment_key: string;
  order_id: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  payment_method: string;
  receipt_url?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationLog {
  id: string;
  user_id: string;
  type: string;
  template_code: string;
  phone: string;
  message: string;
  status: 'pending' | 'sent' | 'failed';
  response_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
} 