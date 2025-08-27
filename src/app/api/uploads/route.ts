import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 8;
const UPLOAD_DIR = 'public/uploads';

interface UploadResponse {
  success: boolean;
  urls?: string[];
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const listingId = formData.get('listingId') as string;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { success: false, error: `Maximum ${MAX_FILES} files allowed` },
        { status: 400 }
      );
    }

    if (!listingId) {
      return NextResponse.json(
        { success: false, error: 'Listing ID is required' },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), UPLOAD_DIR, listingId);
    
    // Create upload directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const urls: string[] = [];

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { success: false, error: 'Only image files are allowed' },
          { status: 400 }
        );
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: `File ${file.name} exceeds 5MB limit` },
          { status: 400 }
        );
      }

      // Generate unique filename
      const fileExtension = path.extname(file.name);
      const fileName = `${randomUUID()}${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);

      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Optimize image with Sharp if available
      try {
        const optimizedBuffer = await sharp(buffer)
          .resize(1600, null, { withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();
        
        // Save optimized image
        const optimizedFileName = `${randomUUID()}.webp`;
        const optimizedFilePath = path.join(uploadDir, optimizedFileName);
        await writeFile(optimizedFilePath, optimizedBuffer);
        
        urls.push(`/uploads/${listingId}/${optimizedFileName}`);
      } catch (sharpError) {
        // If Sharp fails, save original image
        console.warn('Sharp optimization failed, saving original:', sharpError);
        await writeFile(filePath, buffer);
        urls.push(`/uploads/${listingId}/${fileName}`);
      }
    }

    return NextResponse.json({
      success: true,
      urls
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
