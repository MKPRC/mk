import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const authKey = searchParams.get('authKey');
  const customerKey = searchParams.get('customerKey');

  if (!authKey || !customerKey) {
    return NextResponse.redirect(new URL('/?error=missing_params', request.url));
  }

      try {
      // 토스페이먼츠 V2 빌링키 발급 API 호출
      const secretKey = process.env.NEXT_PUBLIC_TOSS_SECRET_KEY;
      if (!secretKey) {
        throw new Error('토스페이먼츠 시크릿 키가 설정되지 않았습니다.');
      }
      
      console.log('🔑 빌링키 발급 시 사용하는 Secret Key:', secretKey?.substring(0, 20) + '...');

    // V2 API 엔드포인트로 변경
    const billingResponse = await fetch('https://api.tosspayments.com/v1/billing/authorizations/issue', {
      method: 'POST',
              headers: {
          'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
          'Content-Type': 'application/json',
        },
      body: JSON.stringify({
        authKey,
        customerKey,
      }),
    });

    if (!billingResponse.ok) {
      const errorData = await billingResponse.json();
      console.error('토스페이먼츠 빌링키 발급 실패:', errorData);
      
      // V2 에러 코드 처리
      if (errorData.code === 'UNAUTHORIZED_KEY') {
        return NextResponse.redirect(new URL('/?error=invalid_api_key', request.url));
      } else if (errorData.code === 'NOT_SUPPORTED_METHOD') {
        return NextResponse.redirect(new URL('/?error=billing_not_supported', request.url));
      }
      
      return NextResponse.redirect(new URL('/?error=billing_issue_failed', request.url));
    }

    const billingData = await billingResponse.json();
    console.log('빌링키 발급 성공:', billingData);

    // 쿠키에서 선택한 플랜 정보 가져오기
    const planInfoCookie = request.cookies.get('selectedPlan');
    if (!planInfoCookie) {
      return NextResponse.redirect(new URL('/?error=no_plan_selected', request.url));
    }

    const planInfo = JSON.parse(planInfoCookie.value);
    const { planId, planName, price, userId, userEmail } = planInfo;

    if (!userId) {
      return NextResponse.redirect(new URL('/?error=user_info_missing', request.url));
    }

    // Service Role Key로 Supabase 클라이언트 생성 (사용자 인증 우회)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 사용자 정보는 쿠키에서 가져온 정보 사용
    const user = { id: userId, email: userEmail };

    // 빌링키 정보 저장 (기존 스키마에 맞춤)
    const { data: billingKeyData, error: insertError } = await supabase
      .from('billing_keys')
      .insert([
        {
          user_id: user.id,
          customer_key: customerKey,
          billing_key: billingData.billingKey,
          card_info: {
            ...billingData.card,
            cardCompany: billingData.cardCompany,
            cardNumber: billingData.cardNumber,
            mId: billingData.mId
          },
          method: billingData.method,
          authenticated_at: billingData.authenticatedAt,
          is_active: true
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('빌링키 저장 실패:', insertError);
      return NextResponse.redirect(new URL('/?error=save_failed', request.url));
    }

    // 구독 정보 저장 (활성 상태로)
    const currentPeriodStart = new Date();
    const currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30일 후

    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        membership_type: planId,
        billing_key: billingData.billingKey,
        customer_key: customerKey,
        status: 'pending_payment', // 결제 대기 상태로 설정
        current_period_start: currentPeriodStart.toISOString(),
        current_period_end: currentPeriodEnd.toISOString(),
        amount: price,
        payment_method: 'CARD',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
     
    if (subscriptionError) {
      console.error('구독 정보 저장 오류:', subscriptionError);
      return NextResponse.redirect(new URL('/?error=subscription_failed', request.url));
    }

    // 빌링키 상태 업데이트 (구독 연결)
    const { error: billingKeyUpdateError } = await supabase
      .from('billing_keys')
      .update({
        subscription_id: subscription.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', billingKeyData.id);

    if (billingKeyUpdateError) {
      console.error('빌링키 업데이트 오류:', billingKeyUpdateError);
    }

    console.log('빌링키 발급 및 구독 등록 완료, processing 페이지로 이동');

    // processing 페이지로 리다이렉트 (5초 후 결제 처리)
    const processingUrl = new URL('/payment/processing', request.url);
    processingUrl.searchParams.set('subscriptionId', subscription.id);
    processingUrl.searchParams.set('billingKey', billingData.billingKey);
    processingUrl.searchParams.set('customerKey', customerKey);
    processingUrl.searchParams.set('amount', price.toString());
    processingUrl.searchParams.set('membershipType', planId);
    processingUrl.searchParams.set('planName', planName);

    // 쿠키 삭제하고 리다이렉트
    const redirectResponse = NextResponse.redirect(processingUrl);
    redirectResponse.cookies.delete('selectedPlan');
    
    return redirectResponse;

  } catch (error) {
    console.error('빌링키 발급 처리 중 오류:', error);
    return NextResponse.redirect(new URL('/?error=server_error', request.url));
  }
} 