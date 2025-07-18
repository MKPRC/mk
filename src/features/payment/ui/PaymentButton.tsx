'use client';

import React, { useState } from 'react';
import { useAuth } from '@/shared/lib/auth';
import { LoginModal } from '@/features/auth';

declare global {
  interface Window {
    TossPayments: any;
  }
}

interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

interface PaymentButtonProps {
  plan: MembershipPlan;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({ plan }) => {
  const { user, session } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const generateCustomerKey = () => {
    return 'customer_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  };

  const handlePayment = async () => {
    if (!user || !session) {
      setShowLoginModal(true);
      return;
    }

    try {
      setIsLoading(true);

      // 토스페이먼츠 V2 SDK 로드 확인
      if (!window.TossPayments) {
        const script = document.createElement('script');
        script.src = 'https://js.tosspayments.com/v2/standard';
        script.onload = () => initiateBillingAuth();
        document.head.appendChild(script);
      } else {
        initiateBillingAuth();
      }
    } catch (error) {
      console.error('구독 처리 중 오류:', error);
      alert('구독 처리 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  const initiateBillingAuth = async () => {
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
    
    if (!clientKey) {
      alert('결제 설정이 올바르지 않습니다.');
      setIsLoading(false);
      return;
    }
    
    console.log('🔑 빌링키 발급 요청 시 사용하는 Client Key:', clientKey?.substring(0, 20) + '...');

    const customerKey = generateCustomerKey();
    
    // 선택한 플랜 정보와 사용자 정보를 쿠키에 저장
    document.cookie = `selectedPlan=${JSON.stringify({
      planId: plan.id,
      planName: plan.name,
      price: plan.price,
      userId: user?.id,
      userEmail: user?.email
    })}; path=/; max-age=3600`; // 1시간 유효

    // 환경변수에서 사이트 URL 가져오기, 없으면 현재 origin 사용
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    
    try {
      // 토스페이먼츠 V2 SDK 초기화
      const tossPayments = window.TossPayments(clientKey);
      
      // 회원 결제 (customerKey 사용)
      const payment = tossPayments.payment({ customerKey });
      
      // 빌링키 발급 요청 (V2 방식)
      await payment.requestBillingAuth({
        method: "CARD", // 자동결제(빌링)는 카드만 지원
        successUrl: `${siteUrl}/api/billing/success`,
        failUrl: `${siteUrl}/?error=billing_failed`,
        customerEmail: user?.email || '',
        customerName: user?.user_metadata?.name || user?.email?.split('@')[0] || '고객',
      });
      
    } catch (error: any) {
      console.error('빌링키 발급 오류:', error);
      if (error.code === 'PAY_PROCESS_CANCELED') {
        alert('사용자가 결제를 취소했습니다.');
      } else if (error.code === 'PAY_PROCESS_ABORTED') {
        alert('결제가 실패했습니다: ' + error.message);
      } else if (error.code === 'REJECT_CARD_COMPANY') {
        alert('카드 정보에 문제가 있습니다: ' + error.message);
      } else {
        alert('빌링키 발급 중 오류가 발생했습니다: ' + error.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed text-white'
            : 'bg-primary-500 hover:bg-primary-600 text-white'
        }`}
      >
        {isLoading ? '처리 중...' : '구독하기'}
      </button>

      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </>
  );
}; 