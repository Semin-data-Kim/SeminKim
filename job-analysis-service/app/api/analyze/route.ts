import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase-server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// JSON 클렌징 함수: 마크다운 태그 제거
function cleanJsonResponse(text: string): string {
  // ```json과 ``` 태그 제거
  let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
  // 앞뒤 공백 제거
  cleaned = cleaned.trim();
  return cleaned;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeText, jobPostingText, jobTitle, companyName } = body;

    if (!resumeText || !jobPostingText) {
      return NextResponse.json(
        { error: 'resumeText와 jobPostingText는 필수입니다.' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // Claude API 호출 (모델명 고정: claude-sonnet-4-20250514)
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `당신은 채용 전문 컨설턴트입니다. 아래 이력서와 채용 공고를 비교 분석하여 JSON 형식으로 결과를 제공하세요.

**이력서:**
${resumeText}

**채용 공고:**
제목: ${jobTitle || '제목 없음'}
회사: ${companyName || '회사명 없음'}
내용:
${jobPostingText}

**응답 형식 (반드시 JSON만 출력):**
{
  "matching_score": 85,
  "winning_points": [
    {
      "title": "강점 제목",
      "description": "구체적인 설명"
    }
  ],
  "strategic_advices": [
    {
      "title": "보완 전략 제목",
      "description": "구체적인 조언"
    }
  ],
  "interview_questions": [
    {
      "question": "면접 예상 질문",
      "intent": "질문 의도",
      "suggested_answer": "추천 답변 방향"
    }
  ]
}

**분석 가이드:**
- matching_score: 0-100 사이의 점수 (이력서와 공고의 적합도)
- winning_points: 이력서의 강점 3-5개 (공고 요구사항과 매칭되는 부분)
- strategic_advices: 보완이 필요한 부분과 전략 3-5개
- interview_questions: 예상 면접 질문 5-7개

응답은 반드시 순수한 JSON 형식만 출력하세요. 마크다운이나 다른 텍스트는 포함하지 마세요.`,
        },
      ],
    });

    // 응답 텍스트 추출
    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    // JSON 클렌징
    const cleanedJson = cleanJsonResponse(responseText);

    // JSON 파싱
    let analysisData;
    try {
      analysisData = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.error('JSON 파싱 실패:', cleanedJson);
      return NextResponse.json(
        { error: 'AI 응답을 파싱하는데 실패했습니다.', raw: cleanedJson },
        { status: 500 }
      );
    }

    // Supabase에 저장
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('analysis_reports')
      .insert({
        job_posting_title: jobTitle || '제목 없음',
        job_posting_company: companyName || '회사명 없음',
        job_posting_content: jobPostingText,
        resume_content: resumeText,
        matching_score: analysisData.matching_score || 0,
        winning_points: analysisData.winning_points || [],
        strategic_advices: analysisData.strategic_advices || [],
        interview_questions: analysisData.interview_questions || [],
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase 저장 실패:', error);
      return NextResponse.json(
        { error: 'DB 저장에 실패했습니다.', details: error.message },
        { status: 500 }
      );
    }

    // DB ID만 반환 (URI 길이 제한 문제 해결)
    return NextResponse.json({
      success: true,
      reportId: data.id,
    });
  } catch (error: any) {
    console.error('분석 에러:', error);
    return NextResponse.json(
      { error: '분석 중 오류가 발생했습니다.', details: error.message },
      { status: 500 }
    );
  }
}
