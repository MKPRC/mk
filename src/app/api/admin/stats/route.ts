import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Service Role Key로 RLS 우회하는 클라이언트 생성
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    // 현재 사용자 확인
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    console.log('Stats API - 현재 사용자:', user?.email);
    console.log('Stats API - 개발 환경:', process.env.NODE_ENV);
    
    // 개발 환경에서는 권한 확인 우회
    if (process.env.NODE_ENV === 'development') {
      console.log('개발 환경에서 권한 확인 우회');
    } else {
      if (userError || !user) {
        return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
      }

      // 관리자 권한 확인
      if (user.email !== 'admin@mkprotocol.com') {
        return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
      }
    }

    // 현재 달의 첫날과 마지막날 계산
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // 총 회원 수 (Service Role Key 사용)
    const { count: totalUsers } = await supabaseAdmin
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });

    // 이번 달 신규 회원 수 (Service Role Key 사용)
    const { count: newUsers } = await supabaseAdmin
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', firstDayOfMonth.toISOString())
      .lte('created_at', lastDayOfMonth.toISOString());

    // 총 구독자 수 (Service Role Key 사용)
    const { count: totalSubscriptions } = await supabaseAdmin
      .from('subscriptions')
      .select('*', { count: 'exact', head: true });

    // 활성 구독자 수 (Service Role Key 사용)
    const { count: activeSubscriptions } = await supabaseAdmin
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // 이번 달 매출 (Service Role Key 사용)
    const { data: monthlyPayments } = await supabaseAdmin
      .from('payment_history')
      .select('amount')
      .eq('status', 'completed')
      .gte('paid_at', firstDayOfMonth.toISOString())
      .lte('paid_at', lastDayOfMonth.toISOString());

    const monthlyRevenue = monthlyPayments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

    // 결제 실패 수 (이번 달) (Service Role Key 사용)
    const { count: failedPayments } = await supabaseAdmin
      .from('payment_history')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'failed')
      .gte('created_at', firstDayOfMonth.toISOString())
      .lte('created_at', lastDayOfMonth.toISOString());

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      newUsers: newUsers || 0,
      totalSubscriptions: totalSubscriptions || 0,
      activeSubscriptions: activeSubscriptions || 0,
      monthlyRevenue: monthlyRevenue,
      failedPayments: failedPayments || 0,
    });

  } catch (error) {
    console.error('관리자 통계 조회 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 