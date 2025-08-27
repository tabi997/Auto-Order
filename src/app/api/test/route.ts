import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const count = await prisma.listing.count()
    return NextResponse.json({ 
      ok: true, 
      message: 'Database connection working',
      count 
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { ok: false, message: 'Database error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
