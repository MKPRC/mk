import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // pending_payment 상태의 구독들 조회
    const { data: pendingSubscriptions, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'pending_payment')
      .order('created_at', { ascending: true });

    if (subscriptionError) {
      console.error('구독 조회 오류:', subscriptionError);
      return NextResponse.json({ error: '구독 조회 실패' }, { status: 500 });
    }

    if (!pendingSubscriptions || pendingSubscriptions.length === 0) {
      return NextResponse.json({ message: '처리할 대기 결제가 없습니다.' });
    }

    console.log(`처리할 대기 결제 ${pendingSubscriptions.length}개 발견`);

    const results = [];
    const secretKey = process.env.NEXT_PUBLIC_TOSS_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json({ error: '토스페이먼츠 설정이 올바르지 않습니다.' }, { status: 500 });
    }

    for (const subscription of pendingSubscriptions) {
      try {
        // 사용자 정보 조회
        const { data: userData } = await supabase.auth.admin.getUserById(subscription.user_id);
        
        if (!userData?.user) {
          console.error(`사용자 정보 없음: ${subscription.user_id}`);
          continue;
        }

        const user = userData.user;
        
        // 결제 재시도 (V2 API 사용)
        const orderId = `retry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const orderName = `${subscription.membership_type} 멤버십 - 첫 결제 재시도`;

        // V2 API 엔드포인트로 변경
        const paymentResponse = await fetch('https://api.tosspayments.com/v1/billing/pay', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            billingKey: subscription.billing_key,
            customerKey: subscription.customer_key,
            amount: subscription.amount,
            orderId,
            orderName,
            customerEmail: user.email,
            customerName: user.user_metadata?.name || user.email,
          }),
        });

        if (!paymentResponse.ok) {
          const errorData = await paymentResponse.json();
          console.error(`결제 재시도 실패 (${subscription.id}):`, errorData);
          
          // V2 에러 코드 처리
          let failureReason = errorData.message || '결제 재시도 실패';
          if (errorData.code === 'NOT_MATCHES_CUSTOMER_KEY') {
            failureReason = 'customerKey와 billingKey가 매칭되지 않습니다.';
          } else if (errorData.code === 'INVALID_BILL_KEY_REQUEST') {
            failureReason = '빌링키 인증이 완료되지 않았거나 유효하지 않습니다.';
          }
          
          // 결제 실패 이력 저장
          await supabase
            .from('payment_history')
            .insert({
              user_id: subscription.user_id,
              subscription_id: subscription.id,
              amount: subscription.amount,
              payment_method: 'CARD',
              order_id: orderId,
              status: 'failed',
              failure_reason: failureReason,
              created_at: new Date().toISOString(),
            });

          results.push({
            subscriptionId: subscription.id,
            status: 'failed',
            error: failureReason,
          });
          continue;
        }

        const paymentData = await paymentResponse.json();
        console.log(`결제 재시도 성공 (${subscription.id}):`, paymentData);

        // 구독 상태를 active로 변경
        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            updated_at: new Date().toISOString(),
          })
          .eq('id', subscription.id);

        // 결제 성공 이력 저장
        await supabase
          .from('payment_history')
          .insert({
            user_id: subscription.user_id,
            subscription_id: subscription.id,
            amount: subscription.amount,
            payment_method: 'CARD',
            payment_key: paymentData.paymentKey,
            order_id: paymentData.orderId,
            status: 'completed',
            paid_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          });

        // 카카오톡 알림 발송 (비동기)
        try {
          await fetch(`${request.nextUrl.origin}/api/notifications/kakao/payment-success`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: subscription.user_id,
              membershipType: subscription.membership_type,
              amount: subscription.amount,
              paymentKey: paymentData.paymentKey,
            }),
          });
        } catch (notificationError) {
          console.error('카카오톡 알림 발송 오류:', notificationError);
        }

        results.push({
          subscriptionId: subscription.id,
          status: 'success',
          paymentKey: paymentData.paymentKey,
          orderId: paymentData.orderId,
        });

      } catch (error) {
        console.error(`구독 처리 오류 (${subscription.id}):`, error);
        results.push({
          subscriptionId: subscription.id,
          status: 'error',
          error: error instanceof Error ? error.message : '알 수 없는 오류',
        });
      }
    }

    return NextResponse.json({
      message: '결제 재시도 완료',
      processed: results.length,
      results,
    });

  } catch (error) {
    console.error('결제 재시도 처리 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 