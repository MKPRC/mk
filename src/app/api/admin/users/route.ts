import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Service Role Key 확인
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ 
        error: 'SUPABASE_SERVICE_ROLE_KEY 환경변수가 설정되지 않았습니다.',
        setup_required: true 
      }, { status: 500 });
    }

    // Service Role Key로 RLS 우회하는 클라이언트 생성
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('Authorization');
    let user = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const { data: { user: tokenUser }, error: tokenError } = await supabase.auth.getUser(token);
        if (!tokenError && tokenUser) {
          user = tokenUser;
        }
      } catch (error) {
        console.error('토큰 검증 오류:', error);
      }
    }
    
    console.log('현재 사용자:', user?.email);
    console.log('개발 환경:', process.env.NODE_ENV);
    
    // 개발 환경에서는 권한 확인 우회
    if (process.env.NODE_ENV === 'development') {
      console.log('개발 환경에서 권한 확인 우회');
    } else {
      if (!user) {
        return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
      }
      
      if (user.email !== 'admin@mkprotocol.com') {
        return NextResponse.json({ 
          error: '관리자 권한이 필요합니다.', 
          currentUser: user.email 
        }, { status: 403 });
      }
    }

    // user_profiles 테이블에서 회원 정보 가져오기 (Service Role Key로 RLS 우회)
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    console.log('Supabase 쿼리 오류:', profilesError);
    console.log('Raw 프로필 데이터:', JSON.stringify(profiles, null, 2));

    if (profilesError) {
      console.error('회원 프로필 조회 오류:', profilesError);
      return NextResponse.json({ error: '회원 정보를 불러오는 중 오류가 발생했습니다.' }, { status: 500 });
    }

    console.log('조회된 프로필 수:', profiles?.length);
    console.log('실제 프로필 데이터:', profiles);
    
    // auth.users 테이블에서 사용자 정보도 가져오기
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error('Auth 사용자 조회 오류:', authError);
    }

    // 프로필 정보와 auth 정보를 매핑
    const users = profiles?.map(profile => {
      // auth 사용자 정보 찾기
      const authUser = authUsers?.users?.find(au => au.id === profile.user_id);
      
      return {
        ...profile,
        email: profile.email || authUser?.email || 
               (profile.kakao_id ? `kakao_${profile.kakao_id}@example.com` : 
                profile.naver_id ? `naver_${profile.naver_id}@example.com` : '이메일 없음'),
        last_sign_in_at: authUser?.last_sign_in_at || profile.updated_at || profile.created_at,
        auth_user_id: authUser?.id,
        user_id_status: profile.user_id ? 'mapped' : 'unmapped',
        login_provider: profile.kakao_id ? 'kakao' : profile.naver_id ? 'naver' : 'unknown',
        // user_id가 NULL인 경우 표시
        needs_mapping: !profile.user_id
      };
    }) || [];
    
    console.log('변환된 사용자 데이터:', users);

    // 통계 정보 추가
    const totalUsers = users.length;
    const mappedUsers = users.filter(u => u.user_id).length;
    const unmappedUsers = users.filter(u => !u.user_id).length;

    return NextResponse.json({ 
      users,
      stats: {
        total: totalUsers,
        mapped: mappedUsers,
        unmapped: unmappedUsers,
        mapping_needed: unmappedUsers > 0
      }
    });

  } catch (error) {
    console.error('회원 목록 조회 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 