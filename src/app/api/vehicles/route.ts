import { NextRequest, NextResponse } from 'next/server'
import { getVehicles } from '@/app/actions/vehicles'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc'
    
    const result = await getVehicles({
      featured,
      page,
      limit,
      sortBy,
      sortOrder
    })
    
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' }, 
      { status: 500 }
    )
  }
}
