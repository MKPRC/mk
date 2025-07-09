import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId, billingKey, customerKey, amount, orderName } = await request.json();

    if (!subscriptionId || !billingKey || !customerKey || !amount || !orderName) {
      return NextResponse.json({ error: '필수 파라미터가 누락되었습니다.' }, { status: 400 });
    }

    const supabase = createClient();
    
    // 구독 정보 조회
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .eq('status', 'active')
      .single();

    if (subscriptionError || !subscription) {
      return NextResponse.json({ error: '구독 정보를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 토스페이먼츠 V2 정기결제 실행
    const orderId = `recurring_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // V2 API 엔드포인트로 변경
    const paymentResponse = await fetch('https://api.tosspayments.com/v1/billing/pay', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(process.env.NEXT_PUBLIC_TOSS_SECRET_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        billingKey,
        customerKey,
        amount,
        orderName: `${orderName} - 정기결제`,
        orderId,
        customerEmail: subscription.customer_email,
        customerName: subscription.customer_name,
      }),
    });

    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.json();
      
      // V2 에러 코드 처리
      let failureReason = errorData.message || '정기결제 실행 실패';
      if (errorData.code === 'NOT_MATCHES_CUSTOMER_KEY') {
        failureReason = 'customerKey와 billingKey가 매칭되지 않습니다.';
      } else if (errorData.code === 'INVALID_BILL_KEY_REQUEST') {
        failureReason = '빌링키 인증이 완료되지 않았거나 유효하지 않습니다.';
      }
      
      // 결제 실패 시 구독 상태 업데이트
      await supabase
        .from('subscriptions')
        .update({
          status: 'payment_failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', subscriptionId);

      // 결제 실패 이력 저장
      await supabase
        .from('payment_history')
        .insert({
          user_id: subscription.user_id,
          subscription_id: subscriptionId,
          amount: amount,
          payment_method: subscription.payment_method,
          order_id: orderId,
          status: 'failed',
          failure_reason: failureReason,
          created_at: new Date().toISOString(),
        });

      return NextResponse.json({ 
        error: failureReason,
        subscriptionId,
        status: 'payment_failed'
      }, { status: 400 });
    }

    const paymentData = await paymentResponse.json();

    // 구독 정보 업데이트 (다음 결제일 설정)
    const nextPeriodStart = new Date();
    const nextPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30일 후

    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        current_period_start: nextPeriodStart.toISOString(),
        current_period_end: nextPeriodEnd.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscriptionId);

    if (updateError) {
      console.error('구독 정보 업데이트 오류:', updateError);
    }

    // 결제 성공 이력 저장
    const { error: paymentHistoryError } = await supabase
      .from('payment_history')
      .insert({
        user_id: subscription.user_id,
        subscription_id: subscriptionId,
        amount: amount,
        payment_method: subscription.payment_method,
        payment_key: paymentData.paymentKey,
        order_id: paymentData.orderId,
        status: 'completed',
        paid_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });

    if (paymentHistoryError) {
      console.error('결제 이력 저장 오류:', paymentHistoryError);
    }

    // 카카오톡 알림 발송 (비동기)
    try {
      await fetch('/api/notifications/kakao/recurring-payment-success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: subscription.user_id,
          membershipType: subscription.membership_type,
          amount,
          paymentKey: paymentData.paymentKey,
          isRecurring: true,
        }),
      });
    } catch (notificationError) {
      console.error('카카오톡 알림 발송 오류:', notificationError);
    }

    return NextResponse.json({
      success: true,
      subscription: subscription,
      payment: paymentData,
      nextPaymentDate: nextPeriodEnd,
      message: '정기결제가 성공적으로 처리되었습니다.',
    });

  } catch (error) {
    console.error('정기결제 실행 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 모든 활성 구독의 정기결제 실행 (cron job용)
export async function GET() {
  try {
    const supabase = createClient();
    
    // 오늘 결제일인 활성 구독 조회
    const today = new Date();
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active')
      .lte('current_period_end', today.toISOString());

    if (error) {
      console.error('구독 조회 오류:', error);
      return NextResponse.json({ error: '구독 조회 실패' }, { status: 500 });
    }

    const results = [];
    
    for (const subscription of subscriptions) {
      try {
        const response = await fetch('/api/billing/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscriptionId: subscription.id,
            billingKey: subscription.billing_key,
            customerKey: subscription.customer_key,
            amount: subscription.amount,
            orderName: `Flow ${subscription.membership_type}`,
          }),
        });

        const result = await response.json();
        results.push({
          subscriptionId: subscription.id,
          userId: subscription.user_id,
          success: response.ok,
          result: result,
        });
      } catch (error) {
        console.error(`구독 ${subscription.id} 정기결제 실행 오류:`, error);
        results.push({
          subscriptionId: subscription.id,
          userId: subscription.user_id,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return NextResponse.json({
      success: true,
      processedSubscriptions: results.length,
      results: results,
    });

  } catch (error) {
    console.error('정기결제 배치 실행 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 