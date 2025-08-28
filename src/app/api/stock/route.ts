import { NextRequest, NextResponse } from 'next/server'
import { getStock } from '@/app/actions/stock'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const type = searchParams.get('type') || ''
    
    // Get sorting parameters
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    
    // Get filter parameters
    const brand = searchParams.get('brand') || ''
    const model = searchParams.get('model') || ''
    const body = searchParams.get('body') || ''
    const fuel = searchParams.get('fuel') || ''
    const yearMin = searchParams.get('yearMin') || ''
    const yearMax = searchParams.get('yearMax') || ''
    const kmMax = searchParams.get('kmMax') || ''
    const priceMin = searchParams.get('priceMin') || ''
    const priceMax = searchParams.get('priceMax') || ''
    const country = searchParams.get('country') || ''
    const gearbox = searchParams.get('gearbox') || ''
    
    const result = await getStock({
      page,
      limit,
      search,
      status,
      type,
      sortBy,
      sortOrder,
      brand,
      model,
      body,
      fuel,
      yearMin,
      yearMax,
      kmMax,
      priceMin,
      priceMax,
      country,
      gearbox
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
