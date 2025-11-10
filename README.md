# 환경 변수 및 실행 가이드

## Supabase 설정

1. Supabase 프로젝트 생성 후 Project Settings → API에서 다음 값을 확인합니다.
2. Authentication → Providers에서 Google을 활성화하고 클라이언트 정보 입력.

## 환경 변수 파일 생성 (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

참고: Google OAuth는 Supabase 대시보드에서 리디렉션 URL이 자동으로 설정됩니다. 별도의 Next.js 콜백 라우트는 필요하지 않습니다.

## 설치 및 실행

```bash
npm install
npm run dev
```
