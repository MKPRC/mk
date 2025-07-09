'use client';

import React, { useRef, useCallback, useEffect } from 'react';

interface NaverLoginButtonProps {
  onLogin?: () => void;
  className?: string;
}

export const NaverLoginButton: React.FC<NaverLoginButtonProps> = ({
  onLogin,
  className = "w-full flex items-center justify-center gap-3 py-3 px-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
}) => {
  const naverRef = useRef<HTMLButtonElement>(null);

  const handleNaverInit = useCallback(() => {
    if (typeof window === 'undefined' || !window.naver) return;

    const naver = window.naver;
    const naverLogin = new naver.LoginWithNaverId({
      clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
      callbackUrl: `${window.location.origin}/auth/naver/callback`,
      callbackHandle: true,
      isPopup: false,
      loginButton: {
        color: 'green',
        type: 1,
        height: '60',
      },
    });
    naverLogin.init();
  }, []);

  const handleNaverLoginClick = () => {
    if (
      !naverRef ||
      !naverRef.current ||
      !naverRef.current.children ||
      !naverRef.current.children[0]?.children
    )
      return;

    (naverRef.current.children[0].children[0] as HTMLImageElement).click();
  };

  useEffect(() => {
    // 네이버 SDK 로드 대기
    const checkNaverSDK = () => {
      if (window.naver) {
        handleNaverInit();
      } else {
        setTimeout(checkNaverSDK, 100);
      }
    };
    checkNaverSDK();
  }, [handleNaverInit]);

  return (
    <>
      <button ref={naverRef} id="naverIdLogin" className="hidden" />
      <button
        onClick={handleNaverLoginClick}
        className={className}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
        </svg>
        네이버로 로그인
      </button>
    </>
  );
}; 