'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ReportContent() {
  const [data, setData] = useState<any>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchAndSetData = () => {
      // 1. 우선순위: 로컬 스토리지에서 데이터 읽기 (URL 길이 제한 및 디코딩 에러 방지)
      const cached = localStorage.getItem('last_report_data');
      if (cached) {
        try {
          setData(JSON.parse(cached));
          return;
        } catch (e) {
          console.error("캐시 데이터 읽기 실패", e);
        }
      }

      // 2. 차선책: URL 파라미터 시도 (안전하게 디코딩)
      const dataParam = searchParams.get('data');
      if (dataParam) {
        try {
          const decoded = JSON.parse(decodeURIComponent(dataParam.replace(/\+/g, ' ')));
          setData(decoded);
        } catch (e) {
          console.error("URL 데이터 디코딩 실패", e);
        }
      }
    };

    fetchAndSetData();
  }, [searchParams]);

  if (!data) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-black italic text-slate-300 text-4xl animate-pulse">
      REPORT LOADING...
    </div>
  );

  const h = data.header || {};
  const a = data.career_assessment || {};

  const company = h.company_name || "회사 정보 없음";
  const title = h.job_title || "공고 제목 없음";
  const score = h.match_score || 0;
  const reason = h.match_reason || "분석 완료되었습니다.";
  const experience = h.required_experience || "정보 없음";

  const winningPoints = a.winning_points || a.strengths || [];
  const strategicAdvices = a.strategic_advices || a.considerations || [];
  const interview = data.interview_strategy || [];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto space-y-8 font-bold italic">

        {/* 오리지널 상단 레이아웃 */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <p className="text-blue-400 font-bold mb-2 tracking-widest uppercase">{company}</p>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter">{title}</h1>
                <div className="flex gap-2 mt-4 font-black text-[10px] uppercase">
                  <span className="bg-white/10 px-3 py-1 rounded-md border border-white/20 uppercase font-black">분석 완료</span>
                  <span className="bg-blue-600 px-3 py-1 rounded-md uppercase font-black tracking-widest">Personalized</span>
                </div>
              </div>
              <div className="text-left md:text-right">
                <div className="inline-block px-4 py-1 bg-blue-600 rounded-full text-xs font-black mb-2 uppercase italic tracking-widest">
                  REQ: {experience}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 grid md:grid-cols-4 gap-8 items-center bg-white border-b-8 border-slate-900">
            <div className="text-center border-r border-slate-100 py-2">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Match Score</p>
              <p className="text-6xl font-black text-blue-600 leading-none">{score}%</p>
            </div>
            <div className="md:col-span-3">
              <p className="text-slate-700 leading-relaxed font-bold italic text-lg tracking-tight">"{reason}"</p>
            </div>
          </div>
        </div>

        {/* 강점 및 보완점 (오리지널 2열 레이아웃) */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-800 flex items-center italic uppercase tracking-tighter">🚀 Winning Points</h3>
            <div className="space-y-4">
              {winningPoints.map((item: any, i: number) => (
                <div key={i} className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm hover:border-slate-900 transition-all">
                  <h4 className="font-black text-lg text-slate-900 mb-2 italic uppercase"># {item.title || item}</h4>
                  {item.description && <p className="text-slate-600 text-sm leading-relaxed font-bold">{item.description}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-800 flex items-center italic uppercase tracking-tighter">🎯 Strategic Advices</h3>
            <div className="space-y-4">
              {strategicAdvices.map((item: any, i: number) => (
                <div key={i} className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm">
                  <h4 className="font-black text-slate-900 mb-2 italic uppercase"># {item.topic || item.title || item}</h4>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-3">
                    <p className="text-slate-700 text-sm font-bold italic">"{item.advice || item.defense_strategy || item.description || '분석 중'}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 면접 전략 (오리지널 다크 레이아웃) */}
        <section className="bg-slate-900 p-8 md:p-12 rounded-[3rem] text-white shadow-2xl">
          <h3 className="text-3xl font-black mb-10 italic uppercase tracking-tighter text-center">Interview Strategy</h3>
          <div className="grid gap-8">
            {interview.map((item: any, i: number) => (
              <div key={i} className="border-b border-white/10 last:border-0 pb-8 last:pb-0">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-blue-500 font-black italic text-2xl uppercase">Q{i+1}.</span>
                  <h4 className="text-xl font-black italic tracking-tight uppercase leading-tight">{item.question || item}</h4>
                </div>
                {item.tip && (
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/10 italic ml-10 opacity-70">
                    <p className="text-sm font-bold">"TIP: {item.tip}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="text-center pt-8 pb-12">
          <Link href="/" className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 transition-all border-b-2 border-transparent hover:border-slate-900">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-black italic text-4xl animate-pulse text-slate-300">LOADING...</div>}>
      <ReportContent />
    </Suspense>
  );
}
