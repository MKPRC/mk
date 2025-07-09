'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/lib/auth';
import { supabase } from '@/shared/config/database';
import { motion } from 'framer-motion';

export default function PhoneInputPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // 로그인하지 않은 사용자는 홈페이지로 리다이렉트
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [user, isLoading, router]);

  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '');
    
    // 010-1234-5678 형태로 포맷팅
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
    setError('');
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePhone(phone)) {
      setError('올바른 핸드폰번호 형식이 아닙니다. (010-1234-5678)');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('핸드폰번호 업데이트 시작:', phone);
      
      // 1. 클라이언트에서 Supabase Auth 사용자 메타데이터 업데이트
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          phone: phone
        }
      });

      if (authError) {
        console.error('Supabase Auth 업데이트 오류:', authError);
        throw new Error('사용자 정보 업데이트에 실패했습니다.');
      }

      console.log('Supabase Auth 핸드폰번호 업데이트 성공');

      // 2. 서버 API로 user_profiles 테이블 업데이트
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('로그인이 필요합니다.');
      }
      
      const response = await fetch('/api/user/update-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.warn('user_profiles 업데이트 실패:', data.error);
        // user_profiles 업데이트 실패해도 Auth 업데이트는 성공했으므로 계속 진행
      } else {
        console.log('user_profiles 테이블 업데이트 성공:', data);
      }
      
      console.log('핸드폰번호 업데이트 완전 완료');
      
      // 성공 시 홈페이지로 리다이렉트
      router.replace('/');
      
    } catch (error) {
      console.error('핸드폰번호 업데이트 오류:', error);
      setError(error instanceof Error ? error.message : '핸드폰번호 업데이트에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    // 나중에 입력하기 (홈페이지로 이동)
    router.replace('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            핸드폰번호 입력
          </h2>
          <p className="text-gray-600">
            알림톡 발송을 위해 핸드폰번호가 필요합니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              핸드폰번호
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="010-1234-5678"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              maxLength={13}
              required
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  처리 중...
                </>
              ) : (
                '완료'
              )}
            </button>

            <button
              type="button"
              onClick={handleSkip}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              나중에 입력하기
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          입력하신 핸드폰번호는 결제 알림 및 서비스 알림 발송에만 사용됩니다.
        </p>
      </motion.div>
    </div>
  );
} 