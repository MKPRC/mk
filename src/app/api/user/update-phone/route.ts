import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: '핸드폰번호가 필요합니다.' },
        { status: 400 }
      );
    }

    // 핸드폰번호 형식 검증
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: '올바른 핸드폰번호 형식이 아닙니다. (010-1234-5678)' },
        { status: 400 }
      );
    }

    // Service Role Key로 Supabase 클라이언트 생성 (RLS 우회)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 요청 헤더에서 Authorization 토큰 가져오기
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // 토큰으로 사용자 정보 가져오기
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }

    console.log('user_profiles 테이블 핸드폰번호 업데이트 요청:', { userId: user.id, phone });

    // 기존 프로필 확인
    const { data: existingProfile, error: selectError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    console.log('기존 프로필:', existingProfile);
    console.log('프로필 조회 오류:', selectError);

    if (selectError) {
      console.error('기존 프로필 조회 실패:', selectError);
      return NextResponse.json({ error: '프로필 조회 실패' }, { status: 500 });
    }

    let profileData;
    let profileUpdateError;

    if (existingProfile) {
      // 기존 프로필이 있는 경우 UPDATE
      const { data: updateData, error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          phone: phone,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select();

      profileData = updateData;
      profileUpdateError = updateError;
      console.log('기존 프로필 업데이트 결과:', updateData);
    } else {
      // 프로필이 없는 경우 INSERT (새로 생성)
      const profileInsertData = {
        user_id: user.id,
        display_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '사용자',
        email: user.email,
        phone: phone,
        kakao_id: user.app_metadata?.provider === 'kakao' ? (user.user_metadata?.provider_id || user.user_metadata?.sub) : null,
        naver_id: user.app_metadata?.provider === 'naver' ? (user.user_metadata?.provider_id || user.user_metadata?.sub) : null,
        marketing_consent: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: insertData, error: insertError } = await supabase
        .from('user_profiles')
        .insert([profileInsertData])
        .select();

      profileData = insertData;
      profileUpdateError = insertError;
      console.log('새 프로필 생성 결과:', insertData);
    }

    console.log('최종 업데이트 결과:', profileData);
    console.log('업데이트 오류:', profileUpdateError);

    if (profileUpdateError) {
      console.error('user_profiles 테이블 업데이트 오류:', profileUpdateError);
      return NextResponse.json({ 
        error: 'user_profiles 테이블 업데이트 실패',
        details: profileUpdateError.message 
      }, { status: 500 });
    } else {
      console.log('user_profiles 테이블 핸드폰번호 업데이트 성공:', profileData);
    }

    console.log('user_profiles 테이블 핸드폰번호 업데이트 완료:', { userId: user.id, phone });

    return NextResponse.json({
      success: true,
      message: 'user_profiles 테이블 핸드폰번호가 성공적으로 업데이트되었습니다.',
      phone: phone
    });

  } catch (error) {
    console.error('핸드폰번호 업데이트 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 