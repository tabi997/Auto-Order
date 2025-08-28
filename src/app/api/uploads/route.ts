import { NextRequest, NextResponse } from 'next/server'
import { uploadLocal } from '@/app/actions/upload'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    const result = await uploadLocal(files)
    
    return NextResponse.json({
      success: true,
      urls: result.files.map((file: any) => file.url)
    })
  } catch (error: any) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload files' },
      { status: 500 }
    )
  }
}
