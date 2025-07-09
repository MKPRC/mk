'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/shared/lib/auth';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const processPaymentSuccess = async () => {
      try {
        // URL 파라미터에서 결제 정보 추출 (API에서 전달되는 실제 파라미터)
        const paymentKey = searchParams.get('paymentKey');
        const orderId = searchParams.get('orderId');
        const amount = searchParams.get('amount');
        const membershipType = searchParams.get('membershipType');
        const status = searchParams.get('status'); // pending_payment 상태 확인

        if (!paymentKey || !orderId || !amount || !membershipType) {
          throw new Error('결제 정보가 누락되었습니다.');
        }

        if (!user) {
          throw new Error('로그인이 필요합니다.');
        }

        // 멤버십 타입별 한글 이름 매핑
        const membershipNames: { [key: string]: string } = {
          'basic': 'Flow Basic',
          'plus': 'Flow+',
          'gold': 'Flow Gold'
        };

        // 결제 정보 설정
        const paymentInfo = {
          paymentKey,
          orderId,
          amount: parseInt(amount),
          membershipType,
          membershipName: membershipNames[membershipType] || membershipType,
          nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일 후
          isPending: status === 'pending_payment', // 첫 결제 대기 상태
        };

        setPaymentData(paymentInfo);
        setStatus('success');

        // 3초 후 홈페이지로 리디렉션
        setTimeout(() => {
          router.push('/');
        }, 3000);

      } catch (error) {
        console.error('결제 성공 처리 오류:', error);
        setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        setStatus('error');
      }
    };

    if (user) {
      processPaymentSuccess();
    }
  }, [user, searchParams, router]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">결제 처리 중...</h2>
            <p className="text-gray-600">잠시만 기다려 주세요.</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center">
            <div className={`mb-4 ${paymentData.isPending ? 'text-yellow-500' : 'text-green-500'}`}>
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {paymentData.isPending ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                )}
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">
              {paymentData.isPending ? '구독 등록 완료!' : '결제 완료!'}
            </h2>
            <p className="text-gray-600 mb-4">
              {paymentData.isPending 
                ? '흐름(Flow) 멤버십 구독이 등록되었습니다. 첫 결제는 곧 자동으로 처리됩니다.'
                : '흐름(Flow) 멤버십 구독이 성공적으로 시작되었습니다.'
              }
            </p>
            {paymentData && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">구독 정보</h3>
                <p><strong>멤버십:</strong> {paymentData.membershipName}</p>
                <p><strong>월 구독료:</strong> {paymentData.amount?.toLocaleString()}원</p>
                <p><strong>다음 결제일:</strong> {paymentData.nextPaymentDate?.toLocaleDateString('ko-KR')}</p>
                {paymentData.isPending && (
                  <p className="text-yellow-600 text-sm mt-2">
                    ⚠️ 첫 결제가 처리 중입니다. 잠시 후 자동으로 완료됩니다.
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  <strong>주문 ID:</strong> {paymentData.orderId}
                </p>
              </div>
            )}
            <p className="text-sm text-gray-500">
              {paymentData.isPending ? (
                <>
                  구독이 등록되었습니다. 첫 결제 완료 후 카카오톡으로 알림을 보내드립니다.<br />
                  3초 후 홈페이지로 이동합니다...
                </>
              ) : (
                <>
                  카카오톡으로 결제 완료 알림을 발송했습니다.<br />
                  3초 후 홈페이지로 이동합니다...
                </>
              )}
            </p>
          </div>
        );
      case 'error':
        return (
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">결제 처리 실패</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="btn btn-primary"
            >
              홈페이지로 돌아가기
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">로딩 중...</h2>
              <p className="text-gray-600">잠시만 기다려 주세요.</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
} 