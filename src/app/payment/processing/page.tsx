'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ProcessingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('결제 처리 중...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const subscriptionId = searchParams.get('subscriptionId');
    const billingKey = searchParams.get('billingKey');
    const customerKey = searchParams.get('customerKey');
    const amount = searchParams.get('amount');
    const membershipType = searchParams.get('membershipType');
    const planName = searchParams.get('planName');

    if (!subscriptionId || !billingKey || !customerKey || !amount || !membershipType || !planName) {
      router.push('/?error=missing_params');
      return;
    }

    // 진행률 애니메이션
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    // 5초 후 결제 처리
    const paymentTimer = setTimeout(async () => {
      setStatus('결제 승인 중...');
      setProgress(95);

      try {
        const response = await fetch('/api/billing/process-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscriptionId,
            billingKey,
            customerKey,
            amount: parseInt(amount),
            membershipType,
            planName,
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setStatus('결제 완료!');
          setProgress(100);
          
          // 성공 페이지로 이동
          setTimeout(() => {
            router.push(`/payment/success?paymentKey=${result.paymentKey}&orderId=${result.orderId}&amount=${amount}&membershipType=${membershipType}&status=completed`);
          }, 1000);
        } else {
          // 빌링키 오류인 경우 재시도 안내
          if (result.code === 'INVALID_BILL_KEY_REQUEST') {
            setStatus('빌링키 활성화 대기 중...');
            setProgress(100);
            
            setTimeout(() => {
              router.push(`/payment/fail?code=${result.code || 'PAYMENT_FAILED'}&message=${encodeURIComponent('빌링키 활성화가 지연되고 있습니다. 잠시 후 다시 시도해주세요.')}`);
            }, 2000);
          } else {
            setStatus('결제 실패');
            setProgress(100);
            
            // 실패 페이지로 이동
            setTimeout(() => {
              router.push(`/payment/fail?code=${result.code || 'PAYMENT_FAILED'}&message=${encodeURIComponent(result.message || '결제에 실패했습니다.')}`);
            }, 1000);
          }
        }
      } catch (error) {
        console.error('결제 처리 오류:', error);
        setStatus('결제 실패');
        setProgress(100);
        
        setTimeout(() => {
          router.push('/?error=payment_failed');
        }, 1000);
      }
    }, 5000); // 5초 대기

    return () => {
      clearInterval(progressInterval);
      clearTimeout(paymentTimer);
    };
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              {status}
            </h2>
            
            <p className="text-sm text-gray-500 mb-6">
              잠시만 기다려주세요. 결제를 처리하고 있습니다.
            </p>
            
            {/* 진행률 바 */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="text-xs text-gray-400">
              {progress}% 완료
            </div>
            
            <div className="mt-6 text-xs text-gray-500">
              <p>• 페이지를 새로고침하거나 뒤로 가지 마세요</p>
              <p>• 결제 처리가 완료될 때까지 기다려주세요</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProcessingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">로딩 중...</h2>
            </div>
          </div>
        </div>
      </div>
    }>
      <ProcessingContent />
    </Suspense>
  );
} 