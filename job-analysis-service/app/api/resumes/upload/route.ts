import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Force Node.js runtime for pdf-parse compatibility
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const file = formData.get('file') as File;

    // 입력 검증
    if (!title || !file) {
      return NextResponse.json(
        { error: '제목과 파일을 모두 제공해야 합니다.' },
        { status: 400 }
      );
    }

    // PDF 파일 확인
    if (!file.name.endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'PDF 파일만 업로드 가능합니다.' },
        { status: 400 }
      );
    }

    // PDF 파일을 Buffer로 변환
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // PDF에서 텍스트 추출
    let extractedText = '';
    try {
      // Use pdf2json for Node.js environment (100% pure JavaScript)
      const PDFParser = require('pdf2json');

      // Parse PDF and extract text
      extractedText = await new Promise<string>((resolve, reject) => {
        const pdfParser = new PDFParser();

        pdfParser.on('pdfParser_dataError', (errData: any) => {
          reject(new Error(errData.parserError));
        });

        pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
          // Extract text from all pages
          const textParts: string[] = [];

          if (pdfData.Pages) {
            pdfData.Pages.forEach((page: any) => {
              if (page.Texts) {
                page.Texts.forEach((text: any) => {
                  if (text.R) {
                    text.R.forEach((r: any) => {
                      if (r.T) {
                        // Decode URI-encoded text
                        textParts.push(decodeURIComponent(r.T));
                      }
                    });
                  }
                });
              }
            });
          }

          resolve(textParts.join(' '));
        });

        // Parse the buffer
        pdfParser.parseBuffer(buffer);
      });

      if (!extractedText || extractedText.trim().length === 0) {
        return NextResponse.json(
          { error: 'PDF에서 텍스트를 추출할 수 없습니다. 스캔된 PDF는 지원하지 않습니다.' },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('PDF parsing error:', error);
      return NextResponse.json(
        { error: 'PDF 파일을 읽는 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 임시 사용자 ID (나중에 Supabase Auth로 교체)
    // 지금은 데모를 위해 고정된 UUID를 사용합니다
    const tempUserId = '00000000-0000-0000-0000-000000000000';

    // Supabase에 이력서 저장
    const { data, error } = await supabase
      .from('resumes')
      .insert({
        user_id: tempUserId,
        title: title,
        content: extractedText,
        file_url: null, // 나중에 Storage 연동 시 업데이트
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: '데이터베이스 저장 중 오류가 발생했습니다: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: '이력서가 성공적으로 업로드되었습니다.',
      resume: {
        id: data.id,
        title: data.title,
        contentLength: extractedText.length,
      },
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: '업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// GET: 이력서 목록 조회 (추가 기능)
export async function GET() {
  try {
    // 임시 사용자 ID
    const tempUserId = '00000000-0000-0000-0000-000000000000';

    const { data, error } = await supabase
      .from('resumes')
      .select('id, title, created_at, updated_at')
      .eq('user_id', tempUserId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: '데이터베이스 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ resumes: data });

  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: '조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
