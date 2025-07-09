import Link from 'next/link';

export default async function AuthCodeErrorPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const error = params.error;
  
  let errorMessage = '로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.';
  
  if (error === 'session_exchange_failed') {
    errorMessage = '카카오 로그인 인증 실패. 카카오 개발자 콘솔 설정을 확인해주세요.';
  } else if (error === 'no_auth_code') {
    errorMessage = '인증 코드가 없습니다. 로그인을 다시 시도해주세요.';
  } else if (error === 'kakao_auth_error') {
    errorMessage = '카카오 로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
  } else if (error === 'callback_error') {
    errorMessage = '로그인 처리 중 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            로그인 오류
          </h1>
          <p className="text-gray-600">
            {errorMessage}
          </p>
          {error && (
            <p className="text-sm text-gray-500 mt-2">
              오류 코드: {error}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="w-full inline-flex justify-center py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            홈으로 돌아가기
          </Link>
          
          <p className="text-sm text-gray-500">
            문제가 지속되면 고객센터로 문의해주세요.
            <br />
            <a 
              href="mailto:support@mkprotocol.com"
              className="text-blue-600 hover:underline"
            >
              support@mkprotocol.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 