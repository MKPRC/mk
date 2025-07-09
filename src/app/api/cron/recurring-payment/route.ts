import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { alimtalkService } from '@/shared/lib/notification/alimtalk';

export async function POST(request: NextRequest) {
  try {
    // Vercel Cron 인증 확인
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // 정기결제 대상 구독 조회 (현재 기간이 만료된 활성 구독)
    const today = new Date();
    const { data: expiredSubscriptions, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active')
      .lte('current_period_end', today.toISOString());

    if (subscriptionError) {
      console.error('구독 조회 오류:', subscriptionError);
      return NextResponse.json({ error: '구독 조회 실패' }, { status: 500 });
    }

    if (!expiredSubscriptions || expiredSubscriptions.length === 0) {
      return NextResponse.json({ message: '정기결제 대상 구독이 없습니다.' });
    }

    console.log(`정기결제 대상 구독 ${expiredSubscriptions.length}개 발견`);

    const results = [];
    const secretKey = process.env.NEXT_PUBLIC_TOSS_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json({ error: '토스페이먼츠 설정이 올바르지 않습니다.' }, { status: 500 });
    }

    for (const subscription of expiredSubscriptions) {
      try {
        // 빌링키로 정기결제 실행 (V2 API 사용)
        const orderId = `recurring_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const orderName = `${subscription.membership_type} 멤버십 - 정기결제`;

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
          }),
        });

        if (paymentResponse.ok) {
          const paymentData = await paymentResponse.json();
          console.log(`구독 ${subscription.id} 정기결제 성공:`, paymentData);

          // 구독 기간 연장
          const newPeriodStart = new Date(subscription.current_period_end);
          const newPeriodEnd = new Date(newPeriodStart.getTime() + 30 * 24 * 60 * 60 * 1000); // 30일 후

          const { error: updateError } = await supabase
            .from('subscriptions')
            .update({
              current_period_start: newPeriodStart.toISOString(),
              current_period_end: newPeriodEnd.toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', subscription.id);

          if (updateError) {
            console.error(`구독 ${subscription.id} 업데이트 오류:`, updateError);
          }

          // 결제 성공 이력 저장
          const { error: paymentHistoryError } = await supabase
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

          if (paymentHistoryError) {
            console.error(`결제 이력 저장 오류:`, paymentHistoryError);
          }

          // 구독 갱신 알림톡 발송 (비동기)
          try {
            // 사용자 정보 가져오기
            const { data: userProfile } = await supabase
              .from('user_profiles')
              .select('display_name, phone')
              .eq('user_id', subscription.user_id)
              .single();

            if (userProfile && userProfile.phone) {
              // 다음 결제일 계산
              const nextBillingDate = new Date(newPeriodEnd);
              nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
              const nextBillingDateStr = nextBillingDate.toLocaleDateString('ko-KR');
              const billingDateStr = new Date().toLocaleDateString('ko-KR');

              // 멤버십 타입을 플랜명으로 변환
              const membershipNames: { [key: string]: string } = {
                'basic': 'Flow Basic',
                'plus': 'Flow+',
                'gold': 'Flow Gold'
              };
              const planName = membershipNames[subscription.membership_type] || subscription.membership_type;

              await alimtalkService.sendSubscriptionRenewal(userProfile.phone, {
                name: userProfile.display_name || '고객',
                membershipType: planName, // 변환된 플랜명 사용
                amount: subscription.amount,
                nextBillingDate: nextBillingDateStr,
                billingDate: billingDateStr,
              });
            }
          } catch (notificationError) {
            console.error('구독 갱신 알림톡 발송 오류:', notificationError);
          }

          results.push({
            subscriptionId: subscription.id,
            status: 'success',
            paymentKey: paymentData.paymentKey,
            orderId: paymentData.orderId,
          });

        } else {
          const errorData = await paymentResponse.json();
          console.error(`구독 ${subscription.id} 정기결제 실패:`, errorData);

          // V2 에러 코드 처리
          let failureReason = errorData.message || '정기결제 실패';
          if (errorData.code === 'NOT_MATCHES_CUSTOMER_KEY') {
            failureReason = 'customerKey와 billingKey가 매칭되지 않습니다.';
          } else if (errorData.code === 'INVALID_BILL_KEY_REQUEST') {
            failureReason = '빌링키 인증이 완료되지 않았거나 유효하지 않습니다.';
          }

          // 결제 실패 시 구독 상태 업데이트
          const { error: updateError } = await supabase
            .from('subscriptions')
            .update({
              status: 'payment_failed',
              updated_at: new Date().toISOString(),
            })
            .eq('id', subscription.id);

          if (updateError) {
            console.error(`구독 ${subscription.id} 상태 업데이트 오류:`, updateError);
          }

          // 결제 실패 이력 저장
          const { error: paymentHistoryError } = await supabase
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

          if (paymentHistoryError) {
            console.error(`결제 실패 이력 저장 오류:`, paymentHistoryError);
          }

          results.push({
            subscriptionId: subscription.id,
            status: 'failed',
            error: failureReason,
          });
        }

      } catch (error) {
        console.error(`구독 ${subscription.id} 처리 중 오류:`, error);
        results.push({
          subscriptionId: subscription.id,
          status: 'error',
          error: error instanceof Error ? error.message : '알 수 없는 오류',
        });
      }
    }

    return NextResponse.json({
      message: '정기결제 처리 완료',
      processedCount: expiredSubscriptions.length,
      results,
    });

  } catch (error) {
    console.error('정기결제 처리 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 