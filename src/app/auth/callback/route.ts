import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/shared/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  
  // 오류가 있으면 오류 페이지로 리다이렉트
  if (error) {
    console.error('OAuth 오류:', error, errorDescription);
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${error}`);
  }
  
  // 코드가 있으면 Supabase에서 세션 교환 처리
  if (code) {
    try {
      
      const response = NextResponse.redirect(`${origin}/auth/callback-client`);
      const supabase = createRouteHandlerClient(request, response);
      
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error('세션 교환 오류:', exchangeError);
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=session_exchange_failed`);
      }
      
      // 세션 교환 성공 시 클라이언트 사이드로 리다이렉트
      return response;
      
    } catch (error) {
      console.error('세션 교환 중 예외 발생:', error);
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=callback_error`);
    }
  }
  
  // 코드도 오류도 없으면 클라이언트 사이드에서 fragment 처리
  return NextResponse.redirect(`${origin}/auth/callback-client`);
} 