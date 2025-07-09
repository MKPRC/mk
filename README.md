# 흐름(Flow) - 조율형 구독 플랫폼

Next.js 15 기반의 구독형 멤버십 플랫폼입니다.

## 🚀 구현된 기능

### 1. 인증 시스템

- **카카오 로그인**: Supabase Auth를 통한 OAuth 연동
- **네이버 로그인**: 블로그 참고한 커스텀 구현 (Supabase Auth + 고정 비밀번호 방식)
- **세션 관리**: Supabase Auth를 통한 자동 세션 관리

### 2. 결제 시스템

- **Toss 정기결제**: 빌링키 기반 정기결제 시스템
- **3단계 멤버십**: Basic (₩9,900), Plus (₩29,000), Gold (₩79,000)
- **결제 성공/실패 처리**: 완전한 결제 플로우 구현

### 3. 알림 시스템

- **카카오톡 알림**: 결제 성공 시 자동 알림 발송
- **정기결제 알림**: 매월 정기결제 완료 알림
- **알림 로그**: 모든 알림 내역 데이터베이스 저장

### 4. 관리자 대시보드

- **통계 대시보드**: 구독자 수, 매출, 실패 결제 통계
- **구독 관리**: 모든 구독 정보 조회 및 관리
- **결제 내역**: 상세한 결제 내역 조회
- **사용자 정보**: 구독자별 상세 정보 확인

### 5. UI/UX

- **반응형 디자인**: 모바일/데스크톱 최적화
- **Framer Motion**: 부드러운 애니메이션 효과
- **Tailwind CSS**: 현대적인 스타일링
- **FSD 아키텍처**: 확장 가능한 폴더 구조

## 🛠 기술 스택

### Frontend

- **Next.js 15**: App Router, Server Components
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 유틸리티 기반 스타일링
- **Framer Motion**: 애니메이션 라이브러리

### Backend

- **Supabase**: 데이터베이스 및 인증
- **Toss Payments**: 결제 처리
- **KakaoTalk API**: 알림 발송

### 배포 및 인프라

- **Vercel**: 프론트엔드 배포 (예정)
- **Supabase**: 백엔드 서비스

## 📁 프로젝트 구조 (FSD)

```
src/
├── app/                    # Next.js 15 App Router
│   ├── admin/             # 관리자 대시보드
│   ├── api/               # API 라우트
│   │   ├── auth/          # 인증 관련 API
│   │   ├── billing/       # 결제 관련 API
│   │   └── notifications/ # 알림 관련 API
│   ├── auth/              # 인증 페이지
│   ├── payment/           # 결제 페이지
│   └── ...
├── shared/                # 공통 모듈
│   ├── config/           # 설정 파일
│   └── lib/              # 유틸리티
├── entities/             # 엔티티 (멤버십 등)
├── features/             # 기능 모듈
│   ├── auth/            # 인증 기능
│   └── payment/         # 결제 기능
└── widgets/              # 위젯 (헤더, 푸터 등)
```

## 🚀 시작하기

### 1. 의존성 설치

```bash
yarn install
```

### 2. 환경변수 설정

```bash
cp env.local.example .env.local
```

다음 값들을 설정하세요:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 익명 키
- `NEXT_PUBLIC_KAKAO_CLIENT_ID`: 카카오 클라이언트 ID
- `NEXT_PUBLIC_NAVER_CLIENT_ID`: 네이버 클라이언트 ID
- `NEXT_PUBLIC_TOSS_CLIENT_KEY`: Toss 클라이언트 키
- `TOSS_SECRET_KEY`: Toss 시크릿 키
- `KAKAOTALK_ACCESS_TOKEN`: 카카오톡 액세스 토큰
- `SUPABASE_NAVER_FIXED_PASSWORD`: 네이버 로그인용 고정 비밀번호

### 3. 개발 서버 실행

```bash
yarn dev
```

### 4. 관리자 대시보드 접근

- URL: `http://localhost:3000/admin`
- 조건: `admin@mkprotocol.com`으로 로그인해야 함

## 📊 데이터베이스 스키마

### 주요 테이블

- `users`: 사용자 정보 (Supabase Auth)
- `subscriptions`: 구독 정보
- `payment_history`: 결제 내역
- `notification_logs`: 알림 로그
- `admin_users`: 관리자 사용자

## 🔧 API 엔드포인트

### 인증

- `POST /api/auth/kakao/login`: 카카오 로그인
- `POST /api/auth/naver/callback`: 네이버 로그인 콜백

### 결제

- `POST /api/billing/success`: 결제 성공 처리
- `POST /api/billing/execute`: 정기결제 실행
- `GET /api/billing/execute`: 정기결제 일괄 실행

### 알림

- `POST /api/notifications/kakao/payment-success`: 결제 성공 알림
- `POST /api/notifications/kakao/recurring-payment-success`: 정기결제 알림

### 관리자

- `GET /api/admin/stats`: 통계 데이터
- `GET /api/admin/subscriptions`: 구독 목록
- `GET /api/admin/payments`: 결제 내역

## 🎯 다음 단계

1. **데이터베이스 스키마 적용**: Supabase에 테이블 생성
2. **환경변수 설정**: 실제 API 키 설정
3. **테스트**: 결제 플로우 테스트
4. **배포**: Vercel에 배포
5. **도메인 연결**: 커스텀 도메인 설정

## 📝 참고사항

- 네이버 로그인은 [이 블로그](https://ifelseif.tistory.com/190)의 방식을 참고하여 구현
- 관리자 권한은 이메일 기반으로 간단히 구현 (실제 서비스에서는 더 강력한 권한 시스템 필요)
- 결제 테스트 시 Toss의 테스트 키를 사용하여 실제 결제 없이 테스트 가능

## 🤝 기여

이 프로젝트에 기여하고 싶다면 PR을 보내주세요!

## 📄 라이선스

MIT License
