import { NextRequest, NextResponse } from 'next/server';
import { generateUploadSignature } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { folder = 'auto-order/dev', eager = 'q_auto,f_auto' } = body;
    
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    const uploadParams = generateUploadSignature({
      timestamp,
      folder,
      eager,
    });

    return NextResponse.json({
      ok: true,
      ...uploadParams,
      eager,
    });
  } catch (error) {
    console.error('Error generating upload signature:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to generate upload signature' },
      { status: 500 }
    );
  }
}
