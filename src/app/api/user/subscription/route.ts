import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    // Service Role Key로 Supabase 클라이언트 생성 (RLS 우회)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('Authorization');
    let user = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const { data: { user: tokenUser }, error: tokenError } = await supabase.auth.getUser(token);
        if (!tokenError && tokenUser) {
          user = tokenUser;
        }
      } catch (error) {
        console.error('토큰 검증 오류:', error);
      }
    }
    
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    console.log('사용자 ID:', user.id);
    
    // 먼저 모든 구독 정보를 조회해서 확인
    const { data: allSubscriptions, error: allSubsError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    console.log('사용자의 모든 구독 정보:', allSubscriptions);
    console.log('구독 정보 조회 오류:', allSubsError);

    // 사용자의 활성 구독 정보 조회
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['active', 'pending_payment', 'payment_failed'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    console.log('활성 구독 정보:', subscription);
    console.log('활성 구독 조회 오류:', subscriptionError);

    if (subscriptionError) {
      console.error('구독 정보 조회 오류:', subscriptionError);
      return NextResponse.json({ error: '구독 정보를 조회할 수 없습니다.' }, { status: 500 });
    }

    // 사용자 프로필 정보 조회
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('display_name, email, phone, marketing_consent')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('프로필 정보 조회 오류:', profileError);
      return NextResponse.json({ error: '프로필 정보를 조회할 수 없습니다.' }, { status: 500 });
    }

    // 프로필이 없는 경우 기본값 생성
    const userProfile = profile || {
      display_name: user.user_metadata?.name || user.email?.split('@')[0] || '사용자',
      email: user.email,
      phone: user.phone || user.user_metadata?.phone || null,
      marketing_consent: false
    };

    // 구독이 있는 경우 결제 내역도 조회
    let paymentHistory = [];
    if (subscription) {
      const { data: payments, error: paymentError } = await supabase
        .from('payment_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!paymentError) {
        paymentHistory = payments || [];
      }
    }

    // 멤버십 타입을 한글명으로 변환
    const membershipNames: { [key: string]: string } = {
      'basic': 'Flow Basic',
      'plus': 'Flow+',
      'gold': 'Flow Gold'
    };

    const subscriptionInfo = subscription ? {
      ...subscription,
      membership_name: membershipNames[subscription.membership_type] || subscription.membership_type,
      next_billing_date: subscription.next_billing_date || subscription.current_period_end,
    } : null;

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        display_name: userProfile.display_name,
        phone: userProfile.phone,
        marketing_consent: userProfile.marketing_consent,
        provider: user.app_metadata?.provider || 'email',
      },
      subscription: subscriptionInfo,
      payment_history: paymentHistory,
    });

  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 