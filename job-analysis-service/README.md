# 🚀 AI 채용 공고 분석 SaaS (MVP)

직무 전환을 준비하는 경력직 구직자를 위한 AI 기반 채용 공고 분석 서비스입니다.

## ✨ 주요 기능

- 📝 **이력서 업로드**: PDF 또는 텍스트 형식의 이력서 관리
- 🔍 **AI 분석**: Claude Sonnet 4가 이력서와 채용 공고를 비교 분석
- 💪 **Winning Points**: 이력서의 강점 분석 (공고 요구사항 대비)
- 💡 **Strategic Advices**: 보완이 필요한 부분과 전략 제시
- 🎯 **Interview Strategy**: 예상 면접 질문 및 답변 가이드

## 🛠 기술 스택

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS
- **Backend**: Next.js API Routes (Route Handlers)
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude API (`claude-sonnet-4-20250514`)
- **File Processing**: pdf2json

## 📋 필수 요구사항

- Node.js 18 이상
- Supabase 계정
- Anthropic API 키

## 🚀 설치 및 실행

### 1. 프로젝트 클론 및 의존성 설치

```bash
cd job-analysis-service
npm install
```

### 2. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속
2. 새 프로젝트 생성 (리전: Seoul 권장)
3. **Settings → API**에서 다음 정보 복사:
   - `Project URL`
   - `anon/public key`

### 3. 데이터베이스 스키마 설정

1. Supabase 대시보드에서 **SQL Editor** 열기
2. `supabase/schema.sql` 파일 내용 전체 복사
3. SQL Editor에 붙여넣고 **Run** 클릭
4. "Success. No rows returned" 확인

### 4. Anthropic API 키 발급

1. [Anthropic Console](https://console.anthropic.com/settings/keys) 접속
2. API Key 생성
3. 키 복사 (한 번만 표시됨!)

### 5. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용 입력:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Anthropic API 설정
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### 6. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 📖 사용 방법

### 1. 메인 페이지에서 분석 시작

1. **회사명** 입력 (예: 카카오)
2. **공고 제목** 입력 (예: 프로덕트 매니저)
3. **채용 공고 내용** 전체 붙여넣기
4. **이력서 내용** 전체 붙여넣기
5. "🚀 분석 시작하기" 버튼 클릭

### 2. 분석 결과 확인

AI가 분석을 완료하면 자동으로 리포트 페이지로 이동합니다.

**리포트 구성:**
- 📊 **헤더**: 회사명, 공고명, 매칭 점수
- ✅ **Winning Points**: 이력서의 강점 (3-5개)
- 💡 **Strategic Advices**: 보완 전략 (3-5개)
- 🎯 **Interview Strategy**: 예상 질문 및 답변 (5-7개)

## 🏗 프로젝트 구조

```
job-analysis-service/
├── app/
│   ├── api/
│   │   ├── analyze/
│   │   │   └── route.ts          # AI 분석 API
│   │   └── reports/
│   │       └── [id]/
│   │           └── route.ts      # 리포트 조회 API
│   ├── reports/
│   │   └── page.tsx              # 분석 결과 페이지
│   ├── resumes/
│   │   └── page.tsx              # 이력서 관리 페이지
│   ├── page.tsx                  # 메인 페이지 (분석 폼)
│   └── layout.tsx
├── lib/
│   ├── supabase.ts               # Supabase 클라이언트 (클라이언트용)
│   └── supabase-server.ts        # Supabase SSR 클라이언트 (서버용)
├── supabase/
│   └── schema.sql                # 데이터베이스 스키마
├── .env.local.example
├── package.json
└── README.md
```

## 🔧 핵심 기술 구현

### 1. Next.js 15+ 비동기 쿠키 처리

```typescript
// lib/supabase-server.ts
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies(); // Next.js 15+
  // ...
}
```

### 2. Claude API 통합 (모델명 고정)

```typescript
// app/api/analyze/route.ts
const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514', // 고정
  max_tokens: 4096,
  messages: [...]
});
```

### 3. JSON 클렌징 (마크다운 태그 제거)

```typescript
function cleanJsonResponse(text: string): string {
  return text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
}
```

### 4. DB 기반 데이터 전달 (URI 길이 문제 해결)

```typescript
// URI 파라미터가 아닌 DB ID만 전달
return NextResponse.json({
  success: true,
  reportId: data.id  // ID만 반환
});

// 리포트 페이지에서 fetch
const response = await fetch(`/api/reports/${reportId}`);
```

## ⚠️ 해결된 기술 부채

### 1. ❌ URI Too Long 에러
**해결책**: URL 파라미터 대신 DB ID만 전달

### 2. ❌ JSON Parsing 실패
**해결책**: 정규표현식으로 마크다운 태그 제거

### 3. ❌ Supabase 쿠키 충돌
**해결책**: `@supabase/ssr` + `await cookies()` 사용

## 🔐 보안 및 RLS

현재 MVP 단계에서는 **인증 없이** 분석을 테스트할 수 있도록 설정되어 있습니다.

**프로덕션 배포 시 반드시 수정 필요:**
- Supabase Auth 구현
- RLS 정책 강화 (`auth.uid()` 체크)
- API Rate Limiting
- 환경 변수 보안

## 📝 다음 단계

- [ ] Supabase Auth 연동
- [ ] 리포트 목록 페이지
- [ ] 리포트 PDF 내보내기
- [ ] 채용 공고 URL 자동 스크래핑
- [ ] 크롬 확장프로그램

## 🐛 문제 해결

### "Supabase 저장 실패" 에러
→ `.env.local` 파일 확인 및 데이터베이스 스키마 실행 여부 확인

### "AI 응답 파싱 실패" 에러
→ Claude API 키 확인 및 모델명 확인

### 500 에러
→ 브라우저 콘솔(F12) 및 터미널 로그 확인

## 📄 라이선스

MIT License

## 👤 작성자

Semin Kim

---

**Made with ❤️ using Next.js, Supabase, and Claude AI**
