import { NextRequest, NextResponse } from 'next/server';
import { alimtalkService } from '@/shared/lib/notification/alimtalk';

export async function POST(request: NextRequest) {
  try {
    const { phone, name, membershipType, amount, nextBillingDate } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: '전화번호가 필요합니다.' }, { status: 400 });
    }

    console.log('알림톡 테스트 시작:', {
      phone,
      name: name || '고객',
      membershipType: membershipType || 'Premium',
      amount: amount || 29000,
      nextBillingDate: nextBillingDate || new Date().toLocaleDateString('ko-KR')
    });

    const result = await alimtalkService.sendSubscriptionSuccess(phone, {
      name: name || '고객',
      membershipType: membershipType || 'Premium',
      amount: amount || 29000,
      nextBillingDate: nextBillingDate || new Date().toLocaleDateString('ko-KR')
    });

    return NextResponse.json({
      success: true,
      message: '알림톡 테스트 발송 완료',
      result
    });

  } catch (error) {
    console.error('알림톡 테스트 오류:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : '알림톡 발송 오류'
    }, { status: 500 });
  }
} 