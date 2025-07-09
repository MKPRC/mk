import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { alimtalkService } from '@/shared/lib/notification/alimtalk';

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId, billingKey, customerKey, amount, membershipType, planName } = await request.json();

    if (!subscriptionId || !billingKey || !customerKey || !amount || !membershipType || !planName) {
      return NextResponse.json({ error: '필수 파라미터가 누락되었습니다.' }, { status: 400 });
    }

    // Service Role Key로 Supabase 클라이언트 생성 (사용자 인증 우회)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 구독 정보 확인
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .single();

    if (subscriptionError || !subscription) {
      return NextResponse.json({ error: '구독 정보를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 구독 정보에서 사용자 ID 가져오기
    const userId = subscription.user_id;

    // 토스페이먼츠 결제 실행
    const orderId = `first_payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const orderName = `${planName} - 첫 결제`;

    console.log('결제 처리 시작:', {
      subscriptionId,
      billingKey,
      customerKey,
      amount,
      orderId,
      orderName
    });

    const secretKey = process.env.NEXT_PUBLIC_TOSS_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: '토스페이먼츠 설정이 올바르지 않습니다.' }, { status: 500 });
    }
    
    console.log('💳 빌링키 승인 요청 시 사용하는 Secret Key:', secretKey?.substring(0, 20) + '...');

    // 재시도 로직 (빌링키 활성화 대기)
    let paymentResponse: Response | null = null;
    let errorData: any = null;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      paymentResponse = await fetch(`https://api.tosspayments.com/v1/billing/${billingKey}`, {
        method: 'POST',
                  headers: {
            'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({
          customerKey,
          amount,
          orderId: `${orderId}_retry_${retryCount}`,
          orderName,
          customerEmail: subscription.customer_email || '',
          customerName: subscription.customer_name || '고객',
          taxFreeAmount: 0,
        }),
      });

      if (paymentResponse.ok) {
        break; // 성공하면 루프 종료
      }

      errorData = await paymentResponse.json();
      console.error(`결제 실패 (시도 ${retryCount + 1}/${maxRetries}):`, errorData);
      
      // INVALID_BILL_KEY_REQUEST 에러인 경우에만 재시도
      if (errorData.code === 'INVALID_BILL_KEY_REQUEST' && retryCount < maxRetries - 1) {
        console.log(`빌링키 활성화 대기 중... 3초 후 재시도`);
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3초 대기
        retryCount++;
      } else {
        break; // 다른 에러이거나 최대 재시도 횟수 도달
      }
    }

    if (!paymentResponse || !paymentResponse.ok) {
      console.error('최종 결제 실패:', errorData);
      
      // V2 에러 코드 처리
      let failureReason = errorData.message || '결제 실패';
      if (errorData.code === 'NOT_MATCHES_CUSTOMER_KEY') {
        failureReason = 'customerKey와 billingKey가 매칭되지 않습니다.';
      } else if (errorData.code === 'INVALID_BILL_KEY_REQUEST') {
        failureReason = '빌링키 인증이 완료되지 않았거나 유효하지 않습니다. 잠시 후 다시 시도해주세요.';
      }
      
      // 결제 실패 이력 저장
      await supabase
        .from('payment_history')
        .insert({
          user_id: userId,
          subscription_id: subscriptionId,
          amount: amount,
          payment_method: 'CARD',
          order_id: orderId,
          status: 'failed',
          failure_reason: failureReason,
          created_at: new Date().toISOString(),
        });

      // 구독 상태를 결제 실패로 변경
      await supabase
        .from('subscriptions')
        .update({
          status: 'payment_failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', subscriptionId);

      return NextResponse.json({ 
        success: false,
        error: failureReason,
        code: errorData.code || 'PAYMENT_FAILED'
      }, { status: 400 });
    }

    const paymentData = await paymentResponse.json();
    console.log('결제 성공:', paymentData);

    // 구독 상태를 활성으로 변경하고 다음 결제일 설정
    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    
    await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        next_billing_date: nextBillingDate.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscriptionId);

    // 결제 성공 이력 저장
    await supabase
      .from('payment_history')
      .insert({
        user_id: userId,
        subscription_id: subscriptionId,
        amount: amount,
        payment_method: 'CARD',
        payment_key: paymentData.paymentKey,
        order_id: paymentData.orderId,
        status: 'completed',
        paid_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });

    // 구독 완료 알림톡 발송 (비동기)
    try {
      console.log('알림톡 발송 시작 - 사용자 ID:', userId);
      
      // 사용자 정보 가져오기
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('display_name, phone')
        .eq('user_id', userId)
        .maybeSingle();

      console.log('사용자 프로필 조회 결과:', { userProfile, profileError });

      // 사용자 인증 정보에서 전화번호 가져오기 (프로필에 없는 경우 백업)
      const { data: authUserData } = await supabase.auth.admin.getUserById(userId);
      const authUser = authUserData?.user;
      
      console.log('사용자 인증 정보:', {
        phone: authUser?.phone,
        user_metadata_phone: authUser?.user_metadata?.phone,
        user_metadata_name: authUser?.user_metadata?.name
      });

      // 전화번호 우선순위: 프로필 > 인증 정보 > 메타데이터
      const phone = userProfile?.phone || authUser?.phone || authUser?.user_metadata?.phone;
      const name = userProfile?.display_name || authUser?.user_metadata?.name || authUser?.email?.split('@')[0] || '고객';

      console.log('알림톡 발송 대상:', { phone, name });

      if (phone) {
        // 현재 결제 날짜 (오늘)
        const currentBillingDate = new Date();
        const currentBillingDateStr = currentBillingDate.toLocaleDateString('ko-KR');

        console.log('알림톡 발송 시도:', {
          phone,
          name,
          membershipType: planName,
          amount,
          billingDate: currentBillingDateStr
        });

        await alimtalkService.sendSubscriptionSuccess(phone, {
          name,
          membershipType: planName, // planName 사용 (Flow Basic, Flow+, Flow Gold)
          amount: amount,
          billingDate: currentBillingDateStr,
        });
        
        console.log('알림톡 발송 성공');
      } else {
        console.log('전화번호가 없어서 알림톡 발송 건너뜀');
      }
    } catch (notificationError) {
      console.error('구독 완료 알림톡 발송 오류:', notificationError);
    }

    return NextResponse.json({
      success: true,
      paymentKey: paymentData.paymentKey,
      orderId: paymentData.orderId,
      amount: amount,
      membershipType: membershipType,
      message: '결제가 성공적으로 완료되었습니다.',
    });

  } catch (error) {
    console.error('결제 처리 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 