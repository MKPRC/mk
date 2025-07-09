'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/shared/config/database';

// user_profiles 테이블 업데이트 함수
const updateUserProfile = async (user: any) => {
  
  const userData = {
    user_id: user.id,
    display_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
    email: user.email || user.user_metadata?.email || null,
    phone: user.phone || user.user_metadata?.phone || null,
    kakao_id: user.app_metadata?.provider === 'kakao' ? (user.user_metadata?.provider_id || user.user_metadata?.sub) : null,
    naver_id: user.app_metadata?.provider === 'naver' ? (user.user_metadata?.provider_id || user.user_metadata?.sub) : null,
    marketing_consent: false,
  };

  try {
    // 1. 현재 user_id로 기존 사용자 검색
    const { data: currentUser, error: currentError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (currentError) {
      console.error('현재 사용자 검색 오류:', currentError);
      if (!(currentError as any)?.message?.includes('relation') && !(currentError as any)?.message?.includes('does not exist')) {
        throw currentError;
      }
    }

    // 2. 현재 user_id로 사용자가 존재하면 업데이트 (기존 사용자)
    if (currentUser) {
      
      const { data: updatedUser, error: updateError } = await supabase
        .from('user_profiles')
        .update({
          display_name: userData.display_name,
          email: userData.email,
          phone: userData.phone,
          kakao_id: userData.kakao_id,
          naver_id: userData.naver_id,
        })
        .eq('id', currentUser.id)
        .select();

      if (updateError) {
        console.error('user_profiles 업데이트 오류:', updateError);
        throw updateError;
      }
      
      return { isNewUser: false, userProfile: updatedUser?.[0] };
    }

    // 3. 소셜 ID로 기존 사용자 검색 (재가입 처리)
    let existingUser = null;
    
    if (userData.kakao_id) {
      const { data: kakaoMatch, error: kakaoError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('kakao_id', userData.kakao_id)
        .maybeSingle();

      if (kakaoError) {
        console.error('kakao_id 검색 오류:', kakaoError);
        if (!(kakaoError as any)?.message?.includes('relation') && !(kakaoError as any)?.message?.includes('does not exist')) {
          throw kakaoError;
        }
      } else if (kakaoMatch) {
        existingUser = kakaoMatch;
      }
    }

    if (!existingUser && userData.naver_id) {
      const { data: naverMatch, error: naverError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('naver_id', userData.naver_id)
        .maybeSingle();

      if (naverError) {
        console.error('naver_id 검색 오류:', naverError);
        if (!(naverError as any)?.message?.includes('relation') && !(naverError as any)?.message?.includes('does not exist')) {
          throw naverError;
        }
      } else if (naverMatch) {
        existingUser = naverMatch;
      }
    }

    // 4. 소셜 ID로 기존 사용자를 찾았으면 user_id 업데이트 (재가입 처리)
    if (existingUser) {
      
      const { data: reactivatedUser, error: reactivateError } = await supabase
        .from('user_profiles')
        .update({
          user_id: user.id, // 새로운 user_id로 업데이트
          display_name: userData.display_name,
          email: userData.email,
          phone: userData.phone,
          kakao_id: userData.kakao_id,
          naver_id: userData.naver_id,
        })
        .eq('id', existingUser.id)
        .select();

      if (reactivateError) {
        console.error('사용자 재활성화 오류:', reactivateError);
        throw reactivateError;
      }
      
      return { isNewUser: false, userProfile: reactivatedUser?.[0] };
    }

    // 5. 완전히 새로운 사용자 생성
    
    const { data: newUser, error: createError } = await supabase
      .from('user_profiles')
      .insert([userData])
      .select();

    if (createError) {
      console.error('user_profiles 생성 오류:', createError);
      console.error('오류 코드:', createError.code);
      console.error('오류 메시지:', createError.message);
      console.error('오류 상세:', createError.details);
      console.error('오류 힌트:', createError.hint);
      console.error('전체 오류 객체:', JSON.stringify(createError, null, 2));
      throw createError;
    }

    return { isNewUser: true, userProfile: newUser?.[0] };

  } catch (error) {
    console.error('user_profiles 업데이트 중 오류:', error);
    throw error;
  }
};

export default function AuthCallbackClientPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        
        // URL fragment에서 토큰 정보 추출
        const fragment = window.location.hash.substring(1);
        
        if (!fragment) {
          setErrorMessage('인증 정보가 없습니다.');
          setStatus('error');
          return;
        }

        // Fragment 파라미터 파싱
        const params = new URLSearchParams(fragment);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const error = params.get('error');
        const errorDescription = params.get('error_description');

        if (error) {
          console.error('OAuth 오류:', error, errorDescription);
          setErrorMessage(`인증 오류: ${error}`);
          setStatus('error');
          return;
        }

        if (!accessToken || !refreshToken) {
          console.error('토큰 정보 없음');
          setErrorMessage('인증 토큰이 없습니다.');
          setStatus('error');
          return;
        }

        // Supabase 세션 설정
        const { data: { user }, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          console.error('세션 설정 오류:', sessionError);
          setErrorMessage('세션 설정 중 오류가 발생했습니다.');
          setStatus('error');
          return;
        }
        
        // user_profiles 테이블에 사용자 정보 저장/업데이트
        let profileResult = null;
        try {
          profileResult = await updateUserProfile(user);
        } catch (profileError) {
          console.error('user_profiles 업데이트 오류:', profileError);
          // 프로필 업데이트 실패해도 로그인은 계속 진행
        }
        
        setStatus('success');
        
        console.log('로그인 제공자:', user?.app_metadata?.provider);
        console.log('프로필 업데이트 결과:', profileResult);
        
        // 리다이렉트 로직
        if (!profileResult) {
          // 프로필 업데이트 실패한 경우 안전하게 핸드폰번호 입력 페이지로
          console.log('프로필 업데이트 실패 → 핸드폰번호 입력 페이지로 이동');
          setTimeout(() => {
            router.replace('/auth/phone-input');
          }, 500);
        } else if (profileResult.isNewUser) {
          // 첫 회원가입인 경우 무조건 핸드폰번호 입력 페이지로
          console.log('첫 회원가입 사용자 → 핸드폰번호 입력 페이지로 이동');
          setTimeout(() => {
            router.replace('/auth/phone-input');
          }, 500);
        } else {
          // 기존 사용자인 경우 핸드폰번호 체크
          const userPhone = profileResult.userProfile?.phone;
          
          console.log('기존 사용자 - 핸드폰번호:', userPhone);
          
          if (!userPhone) {
            console.log('기존 사용자이지만 핸드폰번호 없음 → 핸드폰번호 입력 페이지로 이동');
            setTimeout(() => {
              router.replace('/auth/phone-input');
            }, 500);
          } else {
            console.log('기존 사용자이고 핸드폰번호 있음 → 홈으로 이동');
            setTimeout(() => {
              router.replace('/');
            }, 500);
          }
        }

      } catch (error) {
        console.error('콜백 처리 중 오류:', error);
        setErrorMessage('로그인 처리 중 오류가 발생했습니다.');
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, [router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">로그인 처리 중...</h2>
          <p className="text-gray-600">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">로그인 성공!</h2>
          <p className="text-gray-600">홈페이지로 이동 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">로그인 오류</h2>
        <p className="text-gray-600 mb-6">{errorMessage}</p>
        <button
          onClick={() => router.push('/')}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
} 