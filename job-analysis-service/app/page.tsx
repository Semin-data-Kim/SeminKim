'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    jobPostingText: '',
    resumeText: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          jobTitle: formData.jobTitle,
          jobPostingText: formData.jobPostingText,
          resumeText: formData.resumeText,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '분석에 실패했습니다.');
      }

      // localStorage에 리포트 데이터 저장 (URI 길이 제한 해결)
      if (result.data) {
        localStorage.setItem('last_report_data', JSON.stringify(result.data));
      }

      // 리포트 페이지로 이동
      router.push('/reports');
    } catch (error: any) {
      alert(`오류: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
            AI 채용 공고 분석 서비스
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            이력서와 채용 공고를 AI로 분석하여 맞춤형 인사이트를 제공합니다
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/resumes"
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              📄 이력서 관리
            </Link>
          </div>
        </div>

        {/* 분석 폼 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
            🔍 채용 공고 분석
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 회사명 & 공고 제목 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  회사명
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  placeholder="예: 카카오"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  공고 제목
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, jobTitle: e.target.value })
                  }
                  placeholder="예: 프로덕트 매니저"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* 채용 공고 내용 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                채용 공고 내용
              </label>
              <textarea
                value={formData.jobPostingText}
                onChange={(e) =>
                  setFormData({ ...formData, jobPostingText: e.target.value })
                }
                placeholder="채용 공고 전체 내용을 붙여넣으세요..."
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                required
              />
            </div>

            {/* 이력서 내용 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                이력서 내용
              </label>
              <textarea
                value={formData.resumeText}
                onChange={(e) =>
                  setFormData({ ...formData, resumeText: e.target.value })
                }
                placeholder="이력서 전체 내용을 붙여넣으세요..."
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                required
              />
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg font-semibold text-white text-lg transition ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  AI가 분석 중입니다...
                </span>
              ) : (
                '🚀 분석 시작하기'
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              💡 <strong>팁:</strong> 이력서와 공고 내용을 자세히 입력할수록 더
              정확한 분석 결과를 얻을 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
