import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    // 관리자 API용 서비스 키 사용 (RLS 우회)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // 관리자 인증 확인
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    console.log('Payments - 현재 사용자:', user?.email);
    console.log('Payments - 개발 환경:', process.env.NODE_ENV);
    
    // 개발 환경에서는 권한 확인 우회
    if (process.env.NODE_ENV === 'development') {
      console.log('개발 환경에서 권한 확인 우회');
    } else {
      if (userError || !user) {
        return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
      }

      // 관리자 권한 확인 (이메일 기반)
      if (user.email !== 'admin@mkprotocol.com') {
        return NextResponse.json({ error: '관리자 권한이 없습니다.' }, { status: 403 });
      }
    }

    // URL 파라미터 가져오기
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const paymentMethod = searchParams.get('paymentMethod');
    const search = searchParams.get('search');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // 결제 내역 조회 (필터링 적용)
    let query = supabase
      .from('payment_history')
      .select('*')
      .order('created_at', { ascending: false });

    // 필터 적용
    if (status) {
      query = query.eq('status', status);
    }
    if (paymentMethod) {
      query = query.eq('payment_method', paymentMethod);
    }
    if (search) {
      query = query.ilike('order_id', `%${search}%`);
    }
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: payments, error: paymentsError } = await query;

    console.log('결제 내역 조회 결과:', {
      payments: payments?.length || 0,
      paymentsError,
      firstPayment: payments?.[0]
    });

    if (paymentsError) {
      console.error('결제 내역 조회 오류:', paymentsError);
      return NextResponse.json({ error: '결제 내역 조회 실패' }, { status: 500 });
    }

    // 사용자 프로필 및 구독 정보 조합
    const paymentsWithUserInfo = [];
    
    console.log('결제 데이터 처리 시작:', payments?.length || 0);
    
    if (payments && payments.length > 0) {
      for (const payment of payments) {
        // 사용자 프로필 조회
        const { data: userProfile, error: profileError } = await supabase
          .from('user_profiles')
          .select('display_name, email, phone')
          .eq('user_id', payment.user_id)
          .single();

        console.log(`결제 ${payment.id}의 사용자 프로필 조회:`, {
          payment_user_id: payment.user_id,
          userProfile,
          profileError
        });

        // 구독 정보 조회
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('membership_type')
          .eq('id', payment.subscription_id)
          .single();

        // 프로필 정보가 없으면 기본값 사용
        const profileInfo = userProfile ? {
          name: userProfile.display_name || '이름 없음',
          email: userProfile.email || '이메일 없음',
          phone: userProfile.phone || '전화번호 없음'
        } : {
          name: '이름 없음',
          email: '이메일 없음',
          phone: '전화번호 없음'
        };

        const subscriptionInfo = subscription || {
          membership_type: '알 수 없음'
        };

        // 검색 필터 적용 (사용자 정보 기반)
        if (search) {
          const searchLower = search.toLowerCase();
          const nameMatch = profileInfo.name?.toLowerCase().includes(searchLower);
          const emailMatch = profileInfo.email?.toLowerCase().includes(searchLower);
          const orderIdMatch = payment.order_id?.toLowerCase().includes(searchLower);
          
          if (!nameMatch && !emailMatch && !orderIdMatch) {
            continue; // 검색 조건에 맞지 않으면 스킵
          }
        }

        paymentsWithUserInfo.push({
          ...payment,
          user_profiles: profileInfo,
          subscriptions: subscriptionInfo
        });
      }
    }

    // 전체 개수 조회
    let countQuery = supabase
      .from('payment_history')
      .select('*', { count: 'exact', head: true });

    if (status) {
      countQuery = countQuery.eq('status', status);
    }
    if (paymentMethod) {
      countQuery = countQuery.eq('payment_method', paymentMethod);
    }
    if (startDate) {
      countQuery = countQuery.gte('created_at', startDate);
    }
    if (endDate) {
      countQuery = countQuery.lte('created_at', endDate);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error('결제 내역 개수 조회 오류:', countError);
    }

    // 통계 데이터 조회
    const { data: stats, error: statsError } = await supabase
      .from('payment_history')
      .select('status, amount')
      .eq('status', 'completed');

    let totalRevenue = 0;
    let completedPayments = 0;

    if (stats && !statsError) {
      totalRevenue = stats.reduce((sum, payment) => sum + payment.amount, 0);
      completedPayments = stats.length;
    }

    console.log('최종 결제 데이터 반환:', {
      payments: paymentsWithUserInfo.length,
      statistics: {
        totalRevenue,
        completedPayments,
        totalPayments: count || 0
      }
    });

    return NextResponse.json({
      payments: paymentsWithUserInfo,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      statistics: {
        totalRevenue,
        completedPayments,
        totalPayments: count || 0
      }
    });

  } catch (error) {
    console.error('결제 내역 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 