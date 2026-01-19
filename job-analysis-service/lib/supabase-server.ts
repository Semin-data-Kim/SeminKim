import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

// 데이터베이스 타입 정의
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  content: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AnalysisReport {
  id: string;
  user_id?: string;
  resume_id?: string;
  job_posting_title: string;
  job_posting_company: string;
  job_posting_content: string;
  resume_content: string;
  matching_score: number;
  winning_points: {
    title: string;
    description: string;
  }[];
  strategic_advices: {
    title: string;
    description: string;
  }[];
  interview_questions: {
    question: string;
    intent: string;
    suggested_answer: string;
  }[];
  created_at: string;
}
