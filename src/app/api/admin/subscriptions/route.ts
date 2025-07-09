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
    
    console.log('현재 사용자:', user?.email);
    console.log('개발 환경:', process.env.NODE_ENV);
    
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
    const membershipType = searchParams.get('membershipType');
    const search = searchParams.get('search');

    // 구독 데이터 조회 (필터링 적용)
    let query = supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    // 필터 적용
    if (status) {
      query = query.eq('status', status);
    }
    if (membershipType) {
      query = query.eq('membership_type', membershipType);
    }

    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: subscriptions, error: subscriptionsError } = await query;

    console.log('구독 데이터 조회 결과:', {
      subscriptions: subscriptions?.length || 0,
      subscriptionsError,
      firstSubscription: subscriptions?.[0]
    });

    if (subscriptionsError) {
      console.error('구독 조회 오류:', subscriptionsError);
      return NextResponse.json({ error: '구독 데이터 조회 실패' }, { status: 500 });
    }

    // 사용자 프로필 정보 조합
    const subscriptionsWithUserInfo = [];
    
    console.log('구독 데이터 처리 시작:', subscriptions?.length || 0);
    
    if (subscriptions && subscriptions.length > 0) {
      for (const subscription of subscriptions) {
        // 사용자 프로필 조회
        const { data: userProfile, error: profileError } = await supabase
          .from('user_profiles')
          .select('display_name, email, phone')
          .eq('user_id', subscription.user_id)
          .single();

        console.log(`구독 ${subscription.id}의 사용자 프로필 조회:`, {
          subscription_user_id: subscription.user_id,
          userProfile,
          profileError
        });

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

        // 검색 필터 적용 (사용자 정보 기반)
        if (search) {
          const searchLower = search.toLowerCase();
          const nameMatch = profileInfo.name?.toLowerCase().includes(searchLower);
          const emailMatch = profileInfo.email?.toLowerCase().includes(searchLower);
          
          if (!nameMatch && !emailMatch) {
            continue; // 검색 조건에 맞지 않으면 스킵
          }
        }

        // 구독 기간 계산 함수
        const calculateBillingDates = (createdAt: string) => {
          const createdDate = new Date(createdAt);
          const currentPeriodStart = new Date(createdDate);
          const currentPeriodEnd = new Date(createdDate);
          const nextBillingDate = new Date(createdDate);
          
          // 현재 기간 종료일과 다음 결제일 = 생성일 + 1개월
          currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
          nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
          
          return {
            current_period_start: currentPeriodStart.toISOString(),
            current_period_end: currentPeriodEnd.toISOString(),
            next_billing_date: nextBillingDate.toISOString()
          };
        };

        const billingDates = calculateBillingDates(subscription.created_at);

        subscriptionsWithUserInfo.push({
          ...subscription,
          current_period_start: subscription.current_period_start || billingDates.current_period_start,
          current_period_end: subscription.current_period_end || billingDates.current_period_end,
          next_billing_date: subscription.next_billing_date || billingDates.next_billing_date,
          user_profiles: profileInfo
        });
      }
    }

    // 전체 개수 조회
    let countQuery = supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true });

    if (status) {
      countQuery = countQuery.eq('status', status);
    }
    if (membershipType) {
      countQuery = countQuery.eq('membership_type', membershipType);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error('구독 개수 조회 오류:', countError);
    }

    console.log('최종 구독 데이터 반환:', {
      subscriptions: subscriptionsWithUserInfo.length,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

    return NextResponse.json({
      subscriptions: subscriptionsWithUserInfo,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('구독 관리 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { subscriptionId, status, notes } = await request.json();
    
    if (!subscriptionId || !status) {
      return NextResponse.json({ error: '필수 파라미터가 누락되었습니다.' }, { status: 400 });
    }

    // 관리자 API용 서비스 키 사용 (RLS 우회)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // 관리자 인증 확인
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    console.log('PATCH - 현재 사용자:', user?.email);
    console.log('PATCH - 개발 환경:', process.env.NODE_ENV);
    
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

    // 구독 상태 업데이트
    const { data: updatedSubscription, error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriptionId)
      .select()
      .single();

    if (updateError) {
      console.error('구독 상태 업데이트 오류:', updateError);
      return NextResponse.json({ error: '구독 상태 업데이트 실패' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      subscription: updatedSubscription
    });

  } catch (error) {
    console.error('구독 상태 업데이트 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 