import { NextRequest, NextResponse } from 'next/server'
import { getUploadPreset, getUnsignedUploadUrl } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    // Upload to Cloudinary using unsigned upload
    const uploadUrl = getUnsignedUploadUrl()
    const uploadPreset = getUploadPreset()

    const uploadFormData = new FormData()
    uploadFormData.append('file', dataURI)
    uploadFormData.append('upload_preset', uploadPreset)
    uploadFormData.append('folder', 'autoorder/vehicles')

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: uploadFormData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload to Cloudinary')
    }

    const result = await response.json()
    
    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
