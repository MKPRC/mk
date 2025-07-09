'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function PaymentFailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorCode, setErrorCode] = useState<string>('');

  useEffect(() => {
    // URL 파라미터에서 오류 정보 추출
    const message = searchParams.get('message') || '결제 처리 중 오류가 발생했습니다.';
    const code = searchParams.get('code') || 'UNKNOWN_ERROR';
    
    setErrorMessage(message);
    setErrorCode(code);
  }, [searchParams]);

  const getErrorDescription = (code: string) => {
    switch (code) {
      case 'PAY_PROCESS_CANCELED':
        return '결제가 취소되었습니다.';
      case 'PAY_PROCESS_ABORTED':
        return '결제가 중단되었습니다.';
      case 'REJECT_CARD_COMPANY':
        return '카드사에서 결제를 거부했습니다.';
      case 'INVALID_CARD_EXPIRATION':
        return '카드 유효기간이 만료되었습니다.';
      case 'INSUFFICIENT_BALANCE':
        return '잔액이 부족합니다.';
      case 'INVALID_CARD_INSTALLMENT_PLAN':
        return '할부 개월 수가 유효하지 않습니다.';
      case 'NOT_SUPPORTED_INSTALLMENT_PLAN':
        return '지원하지 않는 할부 개월 수입니다.';
      case 'INVALID_CARD_PASSWORD':
        return '카드 비밀번호가 틀렸습니다.';
      case 'INVALID_CARD_CVC':
        return 'CVC 번호가 틀렸습니다.';
      case 'EXCEED_MAX_CARD_MONEY':
        return '카드 한도를 초과했습니다.';
      case 'INVALID_CARD_NUMBER':
        return '카드 번호가 유효하지 않습니다.';
      case 'CARD_NOT_SUPPORTED':
        return '지원하지 않는 카드입니다.';
      case 'INVALID_AUTHORIZATION':
        return '권한이 유효하지 않습니다.';
      default:
        return '알 수 없는 오류가 발생했습니다.';
    }
  };

  const handleRetry = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">결제 실패</h2>
            
            <div className="bg-red-50 p-4 rounded-lg mb-4">
              <p className="text-red-700 font-semibold mb-2">
                {getErrorDescription(errorCode)}
              </p>
              <p className="text-red-600 text-sm">
                {errorMessage}
              </p>
              {errorCode && (
                <p className="text-red-500 text-xs mt-2">
                  오류 코드: {errorCode}
                </p>
              )}
            </div>
            
            <p className="text-gray-600 mb-6">
              결제 처리 중 문제가 발생했습니다.<br />
              다시 시도해 주시거나 다른 결제 방법을 사용해 주세요.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full btn btn-primary"
              >
                다시 시도하기
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="w-full btn btn-outline"
              >
                홈페이지로 돌아가기
              </button>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                지속적인 문제가 발생하시면 고객센터로 문의해 주세요.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                📞 053-710-5737<br />
                ✉️ support@mkprotocol.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4">로딩 중...</h2>
            </div>
          </div>
        </div>
      </div>
    }>
      <PaymentFailContent />
    </Suspense>
  );
} 