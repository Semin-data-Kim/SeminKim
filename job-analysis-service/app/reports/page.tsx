'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface WinningPoint {
  title: string;
  description: string;
}

interface StrategicAdvice {
  title: string;
  description: string;
}

interface InterviewQuestion {
  question: string;
  intent: string;
  suggested_answer: string;
}

interface ReportData {
  id: string;
  job_posting_title: string;
  job_posting_company: string;
  matching_score: number;
  winning_points: WinningPoint[];
  strategic_advices: StrategicAdvice[];
  interview_questions: InterviewQuestion[];
  created_at: string;
}

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reportId = searchParams.get('id');

  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) {
      setError('리포트 ID가 없습니다.');
      setLoading(false);
      return;
    }

    async function fetchReport() {
      try {
        const response = await fetch(`/api/reports/${reportId}`);
        if (!response.ok) {
          throw new Error('리포트를 불러오는데 실패했습니다.');
        }
        const data = await response.json();
        setReport(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [reportId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">분석 결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-400 mb-2">
            오류 발생
          </h2>
          <p className="text-red-600 dark:text-red-300 mb-4">
            {error || '리포트를 찾을 수 없습니다.'}
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 섹션 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              채용 공고 분석 리포트
            </h1>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              홈으로
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">회사명</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                {report.job_posting_company}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400 mb-1">공고명</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                {report.job_posting_title}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">매칭 점수</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {report.matching_score}점
              </p>
            </div>
          </div>
        </div>

        {/* Winning Points & Strategic Advices (2열 배치) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Winning Points */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center">
              <span className="mr-2">✅</span>
              Winning Points
            </h2>
            <div className="space-y-4">
              {report.winning_points.map((point, index) => (
                <div
                  key={index}
                  className="border-l-4 border-green-500 bg-green-50 dark:bg-green-900/10 p-4 rounded-r"
                >
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                    {point.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Advices */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center">
              <span className="mr-2">💡</span>
              Strategic Advices
            </h2>
            <div className="space-y-4">
              {report.strategic_advices.map((advice, index) => (
                <div
                  key={index}
                  className="border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/10 p-4 rounded-r"
                >
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                    {advice.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {advice.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interview Strategy (다크 모드 스타일) */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black rounded-lg shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="mr-2">🎯</span>
            Interview Strategy
          </h2>
          <div className="space-y-6">
            {report.interview_questions.map((item, index) => (
              <div
                key={index}
                className="bg-gray-700/50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-600 dark:border-gray-700"
              >
                <div className="flex items-start mb-3">
                  <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded mr-3">
                    Q{index + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-white flex-1">
                    {item.question}
                  </h3>
                </div>
                <div className="ml-8">
                  <p className="text-sm text-gray-400 mb-2">
                    <span className="font-semibold text-yellow-400">질문 의도:</span>{' '}
                    {item.intent}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold text-green-400">추천 답변:</span>{' '}
                    {item.suggested_answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 푸터 */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>생성일: {new Date(report.created_at).toLocaleString('ko-KR')}</p>
        </div>
      </div>
    </div>
  );
}
