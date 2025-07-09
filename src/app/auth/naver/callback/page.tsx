'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/shared/config/database';

export default function NaverCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleNaverCallback = async () => {
      try {
        if (!window.location.hash) {
          throw new Error('토큰이 없습니다.');
        }

        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');

        if (!accessToken) {
          throw new Error('액세스 토큰이 없습니다.');
        }

        const response = await fetch('/api/auth/naver/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accessToken }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '로그인 처리 중 오류가 발생했습니다.');
        }

        const responseData = await response.json();

        // 서버에서 받은 세션 정보로 클라이언트 세션 설정
        if (responseData.session) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: responseData.session.access_token,
            refresh_token: responseData.session.refresh_token,
          });
          
          if (sessionError) {
            console.error('클라이언트 세션 설정 오류:', sessionError);
          }
        }

        setStatus('success');
        
        // 핸드폰번호 확인 후 적절한 페이지로 이동
        if (responseData.userProfile) {
          const userPhone = responseData.userProfile.phone;
          
          if (!userPhone) {
            // 핸드폰번호가 없으면 핸드폰번호 입력 페이지로
            setTimeout(() => {
              router.push('/auth/phone-input');
            }, 1000);
          } else {
            // 핸드폰번호가 있으면 홈페이지로
            setTimeout(() => {
              router.push('/');
            }, 1000);
          }
        } else {
          // 사용자 프로필이 없으면 핸드폰번호 입력 페이지로
          setTimeout(() => {
            router.push('/auth/phone-input');
          }, 1000);
        }

      } catch (error) {
        console.error('네이버 로그인 콜백 오류:', error);
        setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        setStatus('error');
        
        setTimeout(() => {
          router.push('/auth/auth-code-error');
        }, 3000);
      }
    };

    handleNaverCallback();
  }, [router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">로그인 처리 중...</h2>
          <p className="text-gray-600">잠시만 기다려 주세요.</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">로그인 성공!</h2>
          <p className="text-gray-600">홈페이지로 이동합니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">로그인 실패</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <p className="text-sm text-gray-500">에러 페이지로 이동합니다...</p>
      </div>
    </div>
  );
} 