import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Report ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('analysis_reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase 조회 실패:', error);
      return NextResponse.json(
        { error: '리포트를 찾을 수 없습니다.', details: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('리포트 조회 에러:', error);
    return NextResponse.json(
      { error: '리포트 조회 중 오류가 발생했습니다.', details: error.message },
      { status: 500 }
    );
  }
}
