import ResumeUpload from '@/components/ResumeUpload';

export default function ResumesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">이력서 관리</h1>
          <p className="text-gray-600 dark:text-gray-400">
            PDF 이력서를 업로드하여 AI 분석을 시작하세요
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <ResumeUpload />
        </div>

        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold mb-2">💡 사용 팁</h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>• 최신 이력서를 PDF 형식으로 준비하세요</li>
            <li>• 파일명은 한글이나 영문 모두 가능합니다</li>
            <li>• 업로드된 이력서는 안전하게 암호화되어 저장됩니다</li>
            <li>• 여러 버전의 이력서를 관리할 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
