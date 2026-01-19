import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL과 Anon Key가 설정되지 않았습니다. .env.local 파일을 확인하세요.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  user_id: string;
  resume_id: string;
  job_posting_title: string;
  job_posting_content: string;
  strengths: string;
  weaknesses: string;
  interview_questions: string;
  created_at: string;
}
