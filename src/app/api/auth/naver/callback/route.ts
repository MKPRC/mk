import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json({ error: '액세스 토큰이 필요합니다.' }, { status: 400 });
    }

    // 네이버 API를 통해 사용자 정보 가져오기
    const naverResponse = await fetch('https://openapi.naver.com/v1/nid/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!naverResponse.ok) {
      return NextResponse.json({ error: '네이버 API 호출 실패' }, { status: 400 });
    }

    const naverData = await naverResponse.json();
    
    if (naverData.resultcode !== '00') {
      return NextResponse.json({ error: '네이버 사용자 정보 가져오기 실패' }, { status: 400 });
    }

    const { response: userInfo } = naverData;
    const { id, email, name, profile_image, mobile } = userInfo;

    if (!email) {
      return NextResponse.json({ error: '이메일 정보가 필요합니다.' }, { status: 400 });
    }

    const supabase = createClient();
    
    // 고정 비밀번호 (환경변수로 관리)
    const fixedPassword = process.env.SUPABASE_NAVER_FIXED_PASSWORD || 'naver_user_fixed_password_2024!@#';

    // 먼저 기존 사용자 로그인 시도
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: fixedPassword,
    });

    if (signInData?.user) {
      // 기존 사용자 로그인 성공
      
      // 기존 사용자 user_profiles 업데이트 (최신 정보 반영)
      try {
        const { error: updateError } = await supabase
          .from('user_profiles')
          .upsert([{
            user_id: signInData.user.id,
            display_name: name || email.split('@')[0],
            email: email,
            phone: mobile || null,
            naver_id: id,
            marketing_consent: false,
          }], {
            onConflict: 'user_id'
          });

        if (updateError) {
          console.error('기존 사용자 프로필 업데이트 오류:', updateError);
        }
      } catch (profileError) {
        console.error('프로필 업데이트 중 예외:', profileError);
      }
      
      // 업데이트된 사용자 프로필 조회
      let userProfile = null;
      try {
        const { data: profileData, error: profileFetchError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', signInData.user.id)
          .single();
          
        if (profileFetchError) {
          console.error('사용자 프로필 조회 오류:', profileFetchError);
        } else {
          userProfile = profileData;
        }
      } catch (error) {
        console.error('프로필 조회 중 예외:', error);
      }
      
      // 세션 설정
      const response = NextResponse.json({ 
        success: true, 
        user: signInData.user,
        userProfile: userProfile,
        session: signInData.session,
        message: '로그인되었습니다.' 
      });
      
      // 쿠키 설정
      if (signInData.session) {
        response.cookies.set('supabase-auth-token', signInData.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7일
        });
      }
      
      return response;
    }

    // 로그인 실패 시 - 이메일 발송 제한 문제를 피하기 위해 다른 방식 사용
    
    try {
      // 서비스 역할로 관리자 권한 클라이언트 생성
      const supabaseAdmin = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      
      // 회원가입 대신 관리자 권한으로 사용자 생성
      const { data: adminSignUpData, error: adminSignUpError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: fixedPassword,
        email_confirm: true, // 이메일 확인 없이 바로 활성화
        user_metadata: {
          name: name,
          avatar_url: profile_image,
          provider: 'naver',
          naver_id: id,
          full_name: name,
        },
      });

      if (adminSignUpError) {
        console.error('관리자 권한 회원가입 오류:', adminSignUpError);
        
        // 429 오류 (rate limit)인 경우 특별 처리
        if (adminSignUpError.status === 429) {
          return NextResponse.json({ 
            error: '잠시 후 다시 시도해주세요. (보안 제한)', 
            code: 'rate_limit',
            retry_after: 60
          }, { status: 429 });
        }
        
        // 사용자가 이미 존재하는 경우
        if (adminSignUpError.message?.includes('already registered')) {
          // 다시 로그인 시도
          const { data: retrySignInData, error: retrySignInError } = await supabase.auth.signInWithPassword({
            email: email,
            password: fixedPassword,
          });
          
          if (retrySignInData?.user) {
            
            // 재시도 로그인 시에도 프로필 업데이트
            try {
              const { error: retryUpdateError } = await supabase
                .from('user_profiles')
                .upsert([{
                  user_id: retrySignInData.user.id,
                  display_name: name || email.split('@')[0],
                  email: email,
                  phone: mobile || null,
                  naver_id: id,
                  marketing_consent: false,
                }], {
                  onConflict: 'user_id'
                });

              if (retryUpdateError) {
                console.error('재시도 프로필 업데이트 오류:', retryUpdateError);
              }
            } catch (profileError) {
              console.error('재시도 프로필 업데이트 중 예외:', profileError);
            }
            
            // 재시도 사용자 프로필 조회
            let retryUserProfile = null;
            try {
              const { data: retryProfileData, error: retryProfileFetchError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', retrySignInData.user.id)
                .single();
                
              if (retryProfileFetchError) {
                console.error('재시도 사용자 프로필 조회 오류:', retryProfileFetchError);
              } else {
                retryUserProfile = retryProfileData;
              }
            } catch (error) {
              console.error('재시도 프로필 조회 중 예외:', error);
            }
            
            const response = NextResponse.json({ 
              success: true, 
              user: retrySignInData.user,
              userProfile: retryUserProfile,
              session: retrySignInData.session,
              message: '로그인되었습니다.' 
            });
            
            if (retrySignInData.session) {
              response.cookies.set('supabase-auth-token', retrySignInData.session.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7,
              });
            }
            
            return response;
          }
        }
        
        return NextResponse.json({ error: '회원가입 처리 중 오류가 발생했습니다.' }, { status: 500 });
      }

      if (!adminSignUpData.user) {
        return NextResponse.json({ error: '회원가입에 실패했습니다.' }, { status: 500 });
      }

      // 생성된 사용자로 로그인
      const { data: newSignInData, error: newSignInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: fixedPassword,
      });

      if (newSignInError || !newSignInData.user) {
        console.error('새 사용자 로그인 실패:', newSignInError);
        return NextResponse.json({ error: '로그인 처리 중 오류가 발생했습니다.' }, { status: 500 });
      }

      // 새 사용자 user_profiles 테이블에 추가
      try {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([{
            user_id: newSignInData.user.id,
            display_name: name || email.split('@')[0],
            email: email,
            phone: mobile || null,
            naver_id: id,
            marketing_consent: false,
          }]);

        if (profileError) {
          console.error('새 사용자 프로필 생성 오류:', profileError);
        }
      } catch (profileError) {
        console.error('프로필 생성 중 예외:', profileError);
      }

      // 새 사용자 프로필 조회
      let newUserProfile = null;
      try {
        const { data: newProfileData, error: newProfileFetchError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', newSignInData.user.id)
          .single();
          
        if (newProfileFetchError) {
          console.error('새 사용자 프로필 조회 오류:', newProfileFetchError);
        } else {
          newUserProfile = newProfileData;
        }
      } catch (error) {
        console.error('새 사용자 프로필 조회 중 예외:', error);
      }

      // 세션 설정
      const response = NextResponse.json({ 
        success: true, 
        user: newSignInData.user,
        userProfile: newUserProfile,
        session: newSignInData.session,
        message: '회원가입이 완료되었습니다.' 
      });

      // 쿠키 설정
      if (newSignInData.session) {
        response.cookies.set('supabase-auth-token', newSignInData.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7일
        });
      }

      return response;

    } catch (createError) {
      console.error('사용자 생성 중 예외:', createError);
      return NextResponse.json({ error: '회원가입 처리 중 오류가 발생했습니다.' }, { status: 500 });
    }

  } catch (error) {
    console.error('네이버 로그인 콜백 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 